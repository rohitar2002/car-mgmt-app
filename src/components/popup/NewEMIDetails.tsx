import { useEffect, useState } from "react";
import { MdClose } from "react-icons/md";
import Modal from "react-modal"
import { toast } from "react-toastify";
import Loader from "../Loader/RotatingLines";
import { useFirebaseContext } from "@/context/firebaseContext";
import { isMobile, isTablet } from "react-device-detect";
import { EmiDetailsType } from "@/interface/CarEntriesTypes";
import { DocumentData } from "firebase/firestore";

Modal.setAppElement("#documentBody");

interface Props {
    isShowPopup: boolean;
    closePopup: () => void;
    existingDetails?: EmiDetailsType | null;
    handleEMIUpdate: (emiDetails: EmiDetailsType) => void;
    title: string
    loanId: string;
}
const ADDEMIDetails = ({ isShowPopup, closePopup, loanId, existingDetails, title, handleEMIUpdate }: Props) => {
    const [modalWidth, setModalWidth] = useState<string>("50%");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const firebaseContext = useFirebaseContext();
    const [emiDetails, setEMIDetails] = useState<EmiDetailsType>({
        emiNo: existingDetails?.emiNo || "",
        emiDueDate: existingDetails?.emiDueDate || "",
        emiReceivedDate: existingDetails?.emiReceivedDate || "",
        emiAmount: existingDetails?.emiAmount || "",
        slipNo: existingDetails?.slipNo || "",
        overdue: existingDetails?.overdue || "",
        otherInterest: existingDetails?.otherInterest || "",
    })
    const [errorDetails, setErrorDetails] = useState<Partial<EmiDetailsType>>({
        emiNo: "",
        emiDueDate: "",
        emiAmount: "",
        slipNo: "",
    })
    const customStyles: ReactModal.Styles = {
        overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 5000,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
        },
        content: {
            position: "relative",
            inset: "auto",
            padding: "20px",
            width: modalWidth,
            height: "95%",
            border: "1px solid #ccc",
            borderRadius: "8px",
            background: "#ffffff",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            overflow: "auto",
        },
    };

    const handleValueChange = (value: string, field: keyof EmiDetailsType) => {
        setEMIDetails((prevState) => ({
            ...prevState,
            [field]: value,
        }));
        if (field === "emiNo" || field === "emiAmount" || field === "emiDueDate" || field === "slipNo") {
            setErrorDetails((prevState) => ({
                ...prevState,
                [field]: "",
            }))
        }
    }
    const handleClosePopup = () => {
        setEMIDetails({
            emiNo: "",
            emiDueDate: "",
            emiReceivedDate: "",
            emiAmount: "",
            slipNo: "",
            overdue: "",
            otherInterest: "",
        })
        closePopup();
    }

    const handleValidation = () => {
        if (emiDetails.emiNo === "") {
            setErrorDetails((prevState) => ({
                ...prevState,
                emiNo: "EMI Number is required",
            }))
            return false;
        }
        if (emiDetails.emiDueDate === "") {
            setErrorDetails((prevState) => ({
                ...prevState,
                emiDueDate: "EMI Due Date is required",
            }))
            return false;
        }
        if (emiDetails.emiAmount === "") {
            setErrorDetails((prevState) => ({
                ...prevState,
                emiAmount: "EMI Amount is required",
            }))
            return false;
        }

        return true;
    }
    const slipNoValidation = () => {
        if (emiDetails.emiReceivedDate && emiDetails.slipNo === "") {
            setErrorDetails((prevState) => ({
                ...prevState,
                slipNo: "Slip Number is required",
            }))
            return false;
        }
        return true;
    }
    const handleSave = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        const isValid = handleValidation();
        if (!isValid) return;
        const isSlipNoValid = slipNoValidation();
        if (!isSlipNoValid) return;
        setErrorDetails({
            emiNo: "",
            emiDueDate: "",
            emiAmount: "",
            slipNo: "",
        })

        setIsLoading(true);

        const emiDocs = await firebaseContext?.getDataWithQuery("EMIDetails", "loanId", "==", loanId);
        if (emiDocs && !emiDocs.empty) {
            const emiData = emiDocs.docs.find((item: DocumentData) => item.data().emiNo == emiDetails.emiNo);
            if (emiData) {
                toast.error("EMI Number Already Exists");
                setIsLoading(false);
                return;
            }
        }


        const emiDetailsResponse = await firebaseContext?.addEMIDetails(loanId, emiDetails);

        if (typeof emiDetailsResponse === "boolean") {
            toast.success("EMI Entry Successfully Added.");
            handleClosePopup();
        }
        else {
            toast.error(emiDetailsResponse);
        }

        setIsLoading(false);
    }
    const handleUpdate = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        const isSlipNoValid = slipNoValidation();
        if (!isSlipNoValid) return;
        setErrorDetails({
            emiNo: "",
            emiDueDate: "",
            emiAmount: "",
            slipNo: "",
        })
        handleEMIUpdate(emiDetails);
    }

    useEffect(() => {
        setEMIDetails({
            emiNo: existingDetails?.emiNo || "",
            emiDueDate: existingDetails?.emiDueDate || "",
            emiReceivedDate: existingDetails?.emiReceivedDate || "",
            emiAmount: existingDetails?.emiAmount || "",
            slipNo: existingDetails?.slipNo || "",
            overdue: existingDetails?.overdue || "",
            otherInterest: existingDetails?.otherInterest || "",
        })
    }, [existingDetails])

    useEffect(() => {
        const handleScreenSize = () => {
            if (window.innerWidth >= 1800) {
                setModalWidth("40%");
            }
            else if (window.innerWidth >= 1000) {
                setModalWidth("50%");
            }
            else if (window.innerWidth >= 768) {
                setModalWidth("80%");
            }
            else {
                setModalWidth("90%");
            }
        }

        if (isShowPopup) {
            window.addEventListener("resize", handleScreenSize);

            if (isShowPopup) {
                if (isMobile) {
                    setModalWidth("90%");
                }
                else if (isTablet) {
                    setModalWidth("70%");
                }
                else {
                    setModalWidth("50%");
                }
            }
        }
        else {
            window.removeEventListener("resize", handleScreenSize);
        }

        return () => {
            window.removeEventListener("resize", handleScreenSize);
        }
    }, [isShowPopup])
    return (
        <>
            <div>
                <Modal isOpen={isShowPopup} style={customStyles}>
                    {isLoading && <Loader />}

                    <div className="flex flex-col gap-5 py-5 px-3">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold text-primary">{title}</h2>
                            <MdClose className="text-2xl font-bold text-red-500 cursor-pointer" onClick={handleClosePopup} />
                        </div>
                        <div className="flex flex-col gap-5">
                            <div className="w-full flex items-center flex-col gap-5 md:flex-row md:items-start">
                                <div className="flex flex-col gap-2 w-full md:w-1/2">
                                    <label htmlFor="emiNumber" className="text-lg font-semibold">EMI No.</label>
                                    <input type="text" id="emiNumber" value={emiDetails.emiNo} onChange={(e) => handleValueChange(e.target.value.replace(/\D/g, ""), "emiNo")} placeholder="Enter EMI Number" disabled={existingDetails ? true : false} className={`focus:outline-none border border-gray-300 rounded-md p-2 ${existingDetails && "bg-gray-200"}`} />
                                    {errorDetails.emiNo && <p className="text-red-500 text-lg font-bold">{errorDetails.emiNo}</p>}
                                </div>

                                <div className="flex flex-col gap-2 w-full md:w-1/2">
                                    <label htmlFor="slipNumber" className="text-lg font-semibold">Slip No.</label>
                                    <input type="text" id="slipNumber" value={emiDetails.slipNo} onChange={(e) => handleValueChange(e.target.value.replace(/\D/g, ""), "slipNo")} placeholder="Enter Slip Number" className="focus:outline-none border border-gray-300 rounded-md p-2" />
                                    {errorDetails.slipNo && <p className="text-red-500 text-lg font-bold">{errorDetails.slipNo}</p>}
                                </div>
                            </div>

                            <div className="w-full flex items-center flex-col gap-5 md:flex-row md:items-start">
                                <div className="flex flex-col gap-2 w-full md:w-1/2">
                                    <label htmlFor="dueDate" className="text-lg font-semibold">Due Date</label>
                                    <input type="date" id="dueDate" value={emiDetails.emiDueDate} onChange={(e) => handleValueChange(e.target.value, "emiDueDate")} className="focus:outline-none border border-gray-300 rounded-md p-2" />
                                    {errorDetails.emiDueDate && <p className="text-red-500 text-lg font-bold">{errorDetails.emiDueDate}</p>}
                                </div>

                                <div className="flex flex-col gap-2 w-full md:w-1/2">
                                    <label htmlFor="receivedDate" className="text-lg font-semibold">Received Date</label>
                                    <input type="date" id="receivedDate" value={emiDetails.emiReceivedDate} onChange={(e) => handleValueChange(e.target.value, "emiReceivedDate")} className="focus:outline-none border border-gray-300 rounded-md p-2" />
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label htmlFor="emiAmount" className="text-lg font-semibold">EMI Amount</label>
                                <input type="text" id="emiAmount" value={emiDetails.emiAmount} onChange={(e) => handleValueChange(e.target.value.replace(/\D/g, ""), "emiAmount")} placeholder="Enter EMI Amount" className="focus:outline-none border border-gray-300 rounded-md p-2" />
                                {errorDetails.emiAmount && <p className="text-red-500 text-lg font-bold">{errorDetails.emiAmount}</p>}
                            </div>

                            <div className="flex flex-col gap-2">
                                <label htmlFor="overdueAmt" className="text-lg font-semibold">Overdue Amount</label>
                                <input type="text" id="overdueAmt" value={emiDetails.overdue} onChange={(e) => handleValueChange(e.target.value.replace(/\D/g, ""), "overdue")} placeholder="Enter Overdue Amount" className="focus:outline-none border border-gray-300 rounded-md p-2" />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label htmlFor="otnerInt" className="text-lg font-semibold">Other Interest Amount</label>
                                <input type="text" id="otnerInt" value={emiDetails.otherInterest} onChange={(e) => handleValueChange(e.target.value.replace(/\D/g, ""), "otherInterest")} placeholder="Enter Other Interest Amount" className="focus:outline-none border border-gray-300 rounded-md p-2" />
                            </div>

                        </div>
                        <div className="flex flex-col items-center md:flex-row md:items-end md:justify-end gap-5 pt-5">
                            <button type="button" className="text-primary border border-primary bg-white px-10 py-2 rounded text-lg w-full md:w-auto" onClick={handleClosePopup}>Cancel</button>
                            <button type="button" className="text-white bg-primary px-10 py-2 rounded text-lg w-full md:w-auto" onClick={existingDetails ? handleUpdate : handleSave}>{existingDetails ? "Update" : "Save"}</button>
                        </div>
                    </div>
                </Modal>
            </div>
        </>
    )
}

export default ADDEMIDetails;