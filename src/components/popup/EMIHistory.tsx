import { EmiDetailsType } from "@/interface/CarEntriesTypes";
import { useEffect, useState } from "react";
import { MdClose } from "react-icons/md";
import Modal from "react-modal"
import Loader from "../Loader/RotatingLines";
import { toast } from "react-toastify";
import { isMobile, isTablet } from "react-device-detect";
import { TbEdit } from "react-icons/tb";

Modal.setAppElement("#documentBody");

interface Props {
    loanId: string | undefined;
    isShowPopup: boolean;
    emiHistoryDetails: EmiDetailsType[] | null;
    setEMIHistoryDetails: (value: EmiDetailsType[] | null) => void;
    setExistingEMIDetails: (value: EmiDetailsType) => void;
    getEMIDetails: (loanId: string) => void;
    setEMIPopupTitle: (value: string) => void;
    setShowEditPopup: (value: boolean) => void;
    closePopup: () => void;
}

export const EMIHistoryPopup = ({ loanId, isShowPopup, closePopup, setShowEditPopup, emiHistoryDetails, setExistingEMIDetails, setEMIHistoryDetails, setEMIPopupTitle, getEMIDetails }: Props) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [modalWidth, setModalWidth] = useState<string>("50%");

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

        if (emiHistoryDetails) {
            setIsLoading(true);
            try {
                const headers = ["EMI Number, Slip Number, Due Date, Received Date, Status, Emi Amount, OverDue, Other Interest"];

                const rows = emiHistoryDetails.map(
                    (item: EmiDetailsType) =>
                        `${item.emiNo}, ${item.slipNo || "--"}, "${item.emiDueDate}", "${item.emiReceivedDate || "--"}", ${item.emiAmount}, ${item.emiStatus},${item.overdue || "--"}, ${item.otherInterest || "--"}`
                );

                // Combine headers and rows
                const csvContent = [headers, ...rows].join("\n");

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

    const handleEditClick = (data: EmiDetailsType) => {
        setShowEditPopup(true);
        setExistingEMIDetails(data);
        setEMIPopupTitle("Edit EMI Details");
    }
    // const getLateFees = (emiInfo: EMIHistoryDBType) => {
    //     const dueDate = new Date(emiInfo["Due Date"]);
    //     const currentDate = new Date();

    //     const yearsDiff = currentDate.getFullYear() - dueDate.getFullYear();
    //     const monthsDiff = currentDate.getMonth() - dueDate.getMonth();

    //     // Total months difference
    //     let totalMonthsPassed = yearsDiff * 12 + monthsDiff;

    //     // Check if the current day is before the due day in the current month
    //     if (currentDate.getDate() < dueDate.getDate()) {
    //         totalMonthsPassed--; // Subtract one month if the day hasn't fully passed
    //     }

    //     return totalMonthsPassed >= 2 ? (totalMonthsPassed / 2) * 500 : 0;

    // }
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
                            <h2 className="text-lg md:text-2xl font-bold text-primary">Loan EMI History</h2>
                            <MdClose className="text-2xl font-bold text-red-500 cursor-pointer" onClick={() => {
                                setEMIHistoryDetails(null);
                                closePopup();
                            }} />
                        </div>

                        <div className="flex-grow overflow-auto max-h-96">
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
                                        emiHistoryDetails ? (emiHistoryDetails.map((item: EmiDetailsType, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td className="px-3 py-2 border border-black">{item.emiNo}</td>
                                                    <td className="px-3 py-2 border border-black">{item.slipNo ? item.slipNo : "--"}</td>
                                                    <td className="px-3 py-2 border border-black">{item.emiDueDate}</td>
                                                    <td className="px-3 py-2 border border-black whitespace-nowrap">{item.emiReceivedDate ? item.emiReceivedDate : "--"}</td>
                                                    <td className="px-3 py-2 border border-black">₹{item.emiAmount}</td>
                                                    <td className={`px-3 py-2 font-bold border border-black ${item.emiStatus === "Paid" ? "text-accent" : item.emiStatus === "Pending" ? "text-orange-500" : "text-error"}`}>{item.emiStatus}</td>
                                                    <td className="px-3 py-2 border border-black">{item.overdue ? "₹" + item.overdue : "--"}</td>
                                                    <td className="px-3 py-2 border border-black">{item.otherInterest ? "₹" + item.otherInterest : "--"}</td>
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
                            </table>
                        </div>
                        <div className="flex justify-center sm:justify-end items-center flex-col sm:flex-row gap-5 py-5 mt-3">
                            <button className="px-5 py-2 w-full sm:w-fit rounded bg-primary text-white" onClick={downloadCSV}>Download CSV</button>
                            <button className="px-8 py-2 w-full sm:w-fit rounded bg-primary text-white" onClick={() => {
                                setEMIHistoryDetails(null);
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