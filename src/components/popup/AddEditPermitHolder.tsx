import { useEffect, useState } from "react";
import { MdClose } from "react-icons/md";
import Modal from "react-modal"
import { toast } from "react-toastify";
import Loader from "../Loader/RotatingLines";
import { useFirebaseContext } from "@/context/firebaseContext";
import { isMobile, isTablet } from "react-device-detect";
import { CustomerInfoType } from "@/interface/CarEntriesTypes";

Modal.setAppElement("#documentBody");

interface Props {
    isShowPopup: boolean;
    closePopup: () => void;
    existingDetails?: CustomerInfoType | null;
    handlePermitHolderUpdate: (details: CustomerInfoType) => void;
    getData: () => Promise<void>;
    carId: string | null;
    title: string;
}
const ADDEMIPermitHolderDetails = ({ isShowPopup, closePopup, getData, existingDetails, title, handlePermitHolderUpdate, carId }: Props) => {
    const [modalWidth, setModalWidth] = useState<string>("50%");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const firebaseContext = useFirebaseContext();
    const [details, setDetails] = useState<Partial<CustomerInfoType>>({
        permitHolderName: existingDetails?.permitHolderName || "",
        address: existingDetails?.address || "",
        mobileNumber: existingDetails?.mobileNumber || "",
        guarantorName: existingDetails?.guarantorName || "",
        guarantorMobileNumber: existingDetails?.guarantorMobileNumber || "",
        guarantorAddress: existingDetails?.guarantorAddress || "",
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
            height: "90%",
            border: "1px solid #ccc",
            borderRadius: "8px",
            background: "#ffffff",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            overflow: "auto",
        },
    };

    const handleValueChange = (value: string, field: keyof CustomerInfoType) => {
        setDetails((prevState) => ({
            ...prevState,
            [field]: value,
        }));
    }
    const handleClosePopup = () => {
        setDetails({
            permitHolderName: existingDetails?.permitHolderName || "",
            address: existingDetails?.address || "",
            mobileNumber: existingDetails?.mobileNumber || "",
            guarantorName: existingDetails?.guarantorName || "",
            guarantorMobileNumber: existingDetails?.guarantorMobileNumber || "",
            guarantorAddress: existingDetails?.guarantorAddress || "",
        })
        closePopup();
    }

    const handleSave = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setIsLoading(true);

        const permitDetailsResponse = await firebaseContext?.addPermitHolderDetails(carId!, details);

        if (typeof permitDetailsResponse === "boolean") {
            toast.success("Permit Holder Details Successfully Added.");
            handleClosePopup();
            getData();
        }
        else {
            toast.error(permitDetailsResponse);
        }

        setIsLoading(false);
    }
    const handleUpdate = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        handlePermitHolderUpdate(details as CustomerInfoType);
        setDetails({
            permitHolderName: existingDetails?.permitHolderName || "",
            address: existingDetails?.address || "",
            mobileNumber: existingDetails?.mobileNumber || "",
            guarantorName: existingDetails?.guarantorName || "",
            guarantorMobileNumber: existingDetails?.guarantorMobileNumber || "",
            guarantorAddress: existingDetails?.guarantorAddress || "",
        });
    }

    useEffect(() => {
        setDetails({
            permitHolderName: existingDetails?.permitHolderName || "",
            address: existingDetails?.address || "",
            mobileNumber: existingDetails?.mobileNumber || "",
            guarantorName: existingDetails?.guarantorName || "",
            guarantorMobileNumber: existingDetails?.guarantorMobileNumber || "",
            guarantorAddress: existingDetails?.guarantorAddress || "",
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

                    <div className="flex flex-col gap-10 justify-between py-5 px-3">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold text-primary">{title}</h2>
                            <MdClose className="text-2xl font-bold text-red-500 cursor-pointer" onClick={handleClosePopup} />
                        </div>
                        <div className="flex flex-col gap-5">
                            <div className="w-full flex items-center flex-col gap-5 md:flex-row md:items-start">
                                <div className="flex flex-col gap-2 w-full md:w-1/2">
                                    <label htmlFor="permitHolerName" className="text-lg font-semibold">Permit Holder Name:</label>
                                    <input type="text" id="permitHolerName" value={details.permitHolderName} onChange={(e) => handleValueChange(e.target.value, "permitHolderName")} placeholder="Enter Permit Holer Name" className="focus:outline-none border border-gray-300 rounded-md p-2" />
                                </div>

                                <div className="flex flex-col gap-2 w-full md:w-1/2">
                                    <label htmlFor="mobileNumber" className="text-lg font-semibold">Mobile Number(s)</label>
                                    <input type="text" id="mobileNumber" value={details.mobileNumber} onChange={(e) => handleValueChange(e.target.value, "mobileNumber")} placeholder="Enter Mobile Number" className="focus:outline-none border border-gray-300 rounded-md p-2" />
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label htmlFor="address" className="text-lg font-semibold">Address.</label>
                                <input type="text" id="address" value={details.address} onChange={(e) => handleValueChange(e.target.value, "address")} placeholder="Enter Address" className="focus:outline-none border border-gray-300 rounded-md p-2" />
                            </div>

                            <div className="w-full flex items-center flex-col gap-5 md:flex-row md:items-start">
                                <div className="flex flex-col gap-2 w-full md:w-1/2">
                                    <label htmlFor="guarantorName" className="text-lg font-semibold">Guarantor name:</label>
                                    <input type="text" id="guarantorName" value={details.guarantorName} onChange={(e) => handleValueChange(e.target.value, "guarantorName")} placeholder="Enter guarantor name" className="focus:outline-none border border-gray-300 rounded-md p-2" />
                                </div>

                                <div className="flex flex-col gap-2 w-full md:w-1/2">
                                    <label htmlFor="guarantorMobileNo" className="text-lg font-semibold">Guarantor Mobile Number(s)</label>
                                    <input type="text" id="guarantorMobileNo" value={details.guarantorMobileNumber} onChange={(e) => handleValueChange(e.target.value, "guarantorMobileNumber")} placeholder="Enter guarantor Mobile Number" className="focus:outline-none border border-gray-300 rounded-md p-2" />
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label htmlFor="guarantorAddress" className="text-lg font-semibold">Guarantor Address</label>
                                <input type="text" id="guarantorAddress" value={details.guarantorAddress} onChange={(e) => handleValueChange(e.target.value, "guarantorAddress")} placeholder="Enter guarantor Address" className="focus:outline-none border border-gray-300 rounded-md p-2" />
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

export default ADDEMIPermitHolderDetails;