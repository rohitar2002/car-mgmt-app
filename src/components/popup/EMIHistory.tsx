import { EMIDetailsWithIDType } from "@/interface/CarEntriesTypes";
import { useEffect, useState } from "react";
import { MdClose } from "react-icons/md";
import Modal from "react-modal"
import Loader from "../Loader/RotatingLines";
import { toast } from "react-toastify";
import { isMobile, isTablet } from "react-device-detect";
import { TbEdit } from "react-icons/tb";
import { SearchComponent } from "../SearchComponent";
import { SingleValue } from "react-select";
import { OptionType } from "@/interface/CommonTypes";
import { useEMIContext } from "@/context/EMIContext";
import { handleDateDisplay } from "@/Helper/utils";
import { useFirebaseContext } from "@/context/firebaseContext";
import { firestore } from "@/firebase/firebase.config";
import { doc, getDoc } from "firebase/firestore";

Modal.setAppElement("#documentBody");

interface Props {
    loanId: string | undefined;
    isShowPopup: boolean;
    emiHistoryDetails: EMIDetailsWithIDType[];
    setEMIHistoryDetails: (value: EMIDetailsWithIDType[]) => void;
    setExistingEMIDetails: (value: EMIDetailsWithIDType) => void;
    getEMIDetails: (value: string, setHistoryTableTitle?: React.Dispatch<React.SetStateAction<string>>) => void;
    registrationNumberEMIFilter?: SingleValue<OptionType> | null;
    setRegistrationNumberEMIFilter?: (value: SingleValue<OptionType> | null) => void;
    registrationNumberOptionList?: OptionType[];
    historyTableTitle?: string;
    setHistoryTableTitle?: React.Dispatch<React.SetStateAction<string>>;
    setEMIPopupTitle: (value: string) => void;
    setShowEditPopup: (value: boolean) => void;
    closePopup: () => void;
}

export const EMIHistoryPopup = ({ loanId, isShowPopup, closePopup, setShowEditPopup, emiHistoryDetails, setExistingEMIDetails, setEMIHistoryDetails, setEMIPopupTitle, getEMIDetails, historyTableTitle, setHistoryTableTitle, registrationNumberEMIFilter, setRegistrationNumberEMIFilter, registrationNumberOptionList }: Props) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [modalWidth, setModalWidth] = useState<string>("50%");
    const emiContext = useEMIContext();
    const firebaseContext = useFirebaseContext();

    const customStyles: ReactModal.Styles = {
        overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1000,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
        },
        content: {
            position: "relative",
            inset: "auto",
            padding: "20px",
            width: modalWidth,
            height: "auto",
            border: "1px solid #ccc",
            borderRadius: "8px",
            background: "#ffffff",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            overflow: "hidden",
        },
    };

    const downloadCSV = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        if (emiHistoryDetails && emiHistoryDetails.length > 0) {
            setIsLoading(true);
            try {
                const headers = ["EMI Number, Slip Number, Due Date, Received Date, Status, Emi Amount, OverDue, Other Interest"];

                const rows = emiHistoryDetails.map(
                    (item: EMIDetailsWithIDType) =>
                        `${item.data.emiNo}, ${item.data.slipNo || "--"}, "${handleDateDisplay(item.data.emiDueDate)}", "${handleDateDisplay(item.data.emiReceivedDate) || "--"}", ${item.data.emiAmount}, ${item.data.emiStatus},${item.data.overdue || "--"}, ${item.data.otherInterest || "--"}`
                );

                // Combine headers and rows
                let csvContent = [headers, ...rows].join("\n");
                const tableFooter = document.querySelector("#emiTable_footer tr");
                if (tableFooter) {
                    const footerContent = Array.from(tableFooter.children).map((item) => (item && item.textContent) ? (item.textContent.includes("₹") ? item.textContent.slice(1,) : item.textContent) : "").join(", ");
                    csvContent = csvContent.concat("\n").concat(footerContent);
                }

                // Create a Blob from the CSV content
                const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

                // Create a download link and trigger download
                const link = document.createElement("a");
                const url = URL.createObjectURL(blob);
                link.setAttribute("href", url);
                link.setAttribute("download", "EMI_History.csv");
                link.style.visibility = "hidden";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                toast.success("File Downloaded successfully. Adjust the column size to see the Dates(if needed).");

            } catch (error) {
                console.error(error);

                toast.error("Something Went wrong during downloading data!");
            }
            setIsLoading(false);
        }
    };

    const handleEditClick = (data: EMIDetailsWithIDType) => {
        setShowEditPopup(true);
        setExistingEMIDetails(data);
        setEMIPopupTitle("Edit EMI Details");
    }

    const handleAddNewEMI = async () => {
        if ((emiContext && loanId && firebaseContext && emiHistoryDetails && emiHistoryDetails.length > 0)) {
            const queryResult = await getDoc(doc(firestore, "LoanDetails", loanId));

            if (queryResult && queryResult.data()?.emiAmount?.trim() && queryResult.data()?.firstEmiDate?.trim()) {
                const recordIndex = emiHistoryDetails.findLastIndex((item: EMIDetailsWithIDType) => item.data.emiNo.toString().trim() !== "");
                const emiAmount = emiHistoryDetails[recordIndex].data.emiAmount;
                const emiDueDate = emiHistoryDetails[recordIndex].data.emiDueDate;
                const firstDueDate: string | undefined = queryResult.data()?.firstEmiDate;
                if (emiAmount.trim() && emiDueDate.trim()) {
                    const emiNo = (parseInt(emiHistoryDetails[recordIndex].data.emiNo) + 1).toString();
                    const nextDueDate = emiContext.nextEMIDate(emiDueDate, firstDueDate);
                    const data = { emiNo: emiNo, emiDueDate: nextDueDate, emiAmount: emiAmount, slipNo: "", emiReceivedDate: "", overdue: "", otherInterest: "" };

                    setExistingEMIDetails({ id: "", data: data });
                    setEMIPopupTitle("Add EMI Details");
                    setShowEditPopup(true);
                }
            }
            else
                toast.error("Unable to create EMI entry. Ensure the loan has a valid EMI amount and a EMI first due date set.");
        }

    }
    const totalEmiAmount = (emiHistoryDetails && emiHistoryDetails.length > 0) ? emiHistoryDetails.reduce((total, item) => total + (item.data?.emiAmount.toString().trim() ? parseInt(item.data.emiAmount.replace(/\D/g, "")) : 0), 0) : 0;
    const totalOverDueAmount = (emiHistoryDetails && emiHistoryDetails.length > 0) ? emiHistoryDetails.reduce((total, item) => total + (item.data.overdue?.toString().trim() ? parseInt(item.data.overdue.replace(/\D/g, "")) : 0), 0) : 0;
    const totalOtherInterestAmount = (emiHistoryDetails && emiHistoryDetails.length > 0) ? emiHistoryDetails.reduce((total, item) => total + (item.data.otherInterest?.toString().trim() ? parseInt(item.data.otherInterest.replace(/\D/g, "")) : 0), 0) : 0;

    useEffect(() => {
        if (isShowPopup) {
            if (loanId) {
                getEMIDetails(loanId);
            }
        }
    }, [isShowPopup])

    useEffect(() => {
        const handleScreenSize = () => {
            if (window.innerWidth >= 1000) {
                setModalWidth("70%");
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
                    setModalWidth("60%");
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
                    <div className="flex flex-col gap-3">
                        <div className="flex justify-between items-center py-5">
                            <h2 className="text-lg md:text-2xl font-bold text-primary">{registrationNumberOptionList ? "Add New EMI" : "Loan EMI History"}</h2>
                            <MdClose className="text-2xl font-bold text-red-500 cursor-pointer" onClick={() => {
                                setEMIHistoryDetails([]);
                                closePopup();
                            }} />
                        </div>

                        {setRegistrationNumberEMIFilter && registrationNumberOptionList &&
                            <div className="flex flex-col gap-5">
                                <SearchComponent
                                    registrationNumber={registrationNumberEMIFilter || null}
                                    registrationNumberOptionList={registrationNumberOptionList}
                                    setRegistrationNumber={setRegistrationNumberEMIFilter}
                                    isEmiHistory={true}
                                    setHistoryTableTitle={setHistoryTableTitle}
                                    getEMIDetails={getEMIDetails}
                                />
                            </div>
                        }
                        <div className="flex-grow overflow-auto max-h-80">
                            {registrationNumberOptionList && <h2 className="text-lg font-bold text-primary pt-5 pb-3">{historyTableTitle}</h2>}
                            <table className="w-full border border-black">
                                <thead>
                                    <tr>
                                        <th className="border border-black px-3 py-3 text-left text-white bg-primary whitespace-nowrap">EMI no.</th>
                                        <th className="border border-black px-3 py-3 text-left text-white bg-primary whitespace-nowrap">Slip no.</th>
                                        <th className="border border-black px-3 py-3 text-left text-white bg-primary whitespace-nowrap">Due Date</th>
                                        <th className="border border-black px-3 py-3 text-left text-white bg-primary whitespace-nowrap">Received Date</th>
                                        <th className="border border-black px-3 py-3 text-left text-white bg-primary whitespace-nowrap">Amount</th>
                                        <th className="border border-black px-3 py-3 text-left text-white bg-primary whitespace-nowrap">Status</th>
                                        <th className="border border-black px-3 py-3 text-left text-white bg-primary whitespace-nowrap">OverDue</th>
                                        <th className="border border-black px-3 py-3 text-left text-white bg-primary whitespace-nowrap">Other Interest</th>
                                        <th className="border border-black px-3 py-3 text-left text-white bg-primary whitespace-nowrap">Action</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {
                                        emiHistoryDetails ? (emiHistoryDetails.map((item: EMIDetailsWithIDType, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td className="px-3 py-2 border border-black">{item.data.emiNo ? item.data.emiNo : "--"}</td>
                                                    <td className="px-3 py-2 border border-black">{item.data.slipNo ? item.data.slipNo : "--"}</td>
                                                    <td className="px-3 py-2 border border-black whitespace-nowrap">{(item.data.emiDueDate && item.data.emiDueDate.trim()) ? handleDateDisplay(item.data.emiDueDate) : "--"}</td>
                                                    <td className="px-3 py-2 border border-black whitespace-nowrap">{(item.data.emiReceivedDate && item.data.emiReceivedDate.trim()) ? handleDateDisplay(item.data.emiReceivedDate) : "--"}</td>
                                                    <td className="px-3 py-2 border border-black">{item.data.emiAmount ? "₹" + item.data.emiAmount : "--"}</td>
                                                    <td className={`px-3 py-2 font-bold border border-black ${item.data.emiStatus === "Paid" ? "text-accent" : item.data.emiStatus === "Pending" ? "text-orange-500" : "text-error"}`}>{item.data.emiStatus}</td>
                                                    <td className="px-3 py-2 border border-black">{item.data.overdue ? "₹" + item.data.overdue : "--"}</td>
                                                    <td className="px-3 py-2 border border-black">{item.data.otherInterest ? "₹" + item.data.otherInterest : "--"}</td>
                                                    <td className="px-5 py-2 border border-black">
                                                        <TbEdit size={30} className="cursor-pointer text-center" onClick={() => handleEditClick(item)} />
                                                    </td>
                                                </tr>)
                                        })) :
                                            <tr>
                                                <td colSpan={6} className="font-bold text-xl text-primary text-center py-5">No EMI Found!</td>
                                            </tr>
                                    }
                                </tbody>
                                <tfoot id="emiTable_footer">
                                    <tr>
                                        <td className="px-3 py-2 border border-black">Total:</td>
                                        <td className="px-3 py-2 border border-black">{""}</td>
                                        <td className="px-3 py-2 border border-black">{""}</td>
                                        <td className="px-3 py-2 border border-black">{""}</td>
                                        <td className="px-3 py-2 border border-black">{"₹" + totalEmiAmount}</td>
                                        <td className="px-3 py-2 border border-black">{""}</td>
                                        <td className="px-3 py-2 border border-black">{"₹" + totalOverDueAmount}</td>
                                        <td className="px-3 py-2 border border-black">{"₹" + totalOtherInterestAmount}</td>
                                        <td className="px-3 py-2 border border-black">{""}</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                        <div className="flex justify-center sm:justify-end items-center flex-col sm:flex-row gap-5 py-5 mt-3">
                            <button className="px-3 py-2 w-full sm:w-fit bg-primary text-white rounded" disabled={emiHistoryDetails.length == 0} onClick={handleAddNewEMI}>Add EMI Details</button>
                            <button className="px-5 py-2 w-full sm:w-fit rounded bg-primary text-white" onClick={downloadCSV}>Download CSV</button>
                            <button className="px-8 py-2 w-full sm:w-fit rounded bg-primary text-white" onClick={() => {
                                setEMIHistoryDetails([]);
                                closePopup();
                            }}>OK</button>
                        </div>
                    </div>
                </Modal>
            </div>
        </>
    )
}

export default EMIHistoryPopup;