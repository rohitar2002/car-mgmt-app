import { useFirebaseContext } from "@/context/firebaseContext";
import { EMIHistoryDBType, EMIHistoryDetailsType } from "@/interface/CarEntriesTypes";
import { useEffect, useState } from "react";
import { MdClose } from "react-icons/md";
import Modal from "react-modal"
import Loader from "../Loader/RotatingLines";
import { toast } from "react-toastify";

Modal.setAppElement("#documentBody");

const customStyles: any = {
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
        width: "60%",
        height: "auto",
        border: "1px solid #ccc",
        borderRadius: "8px",
        background: "#ffffff",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        overflow: "hidden",
    },
};

interface Props {
    loanId: string | undefined;
    isShowPopup: boolean;
    closePopup: () => void;
}

export const EMIHistoryPopup = ({ loanId, isShowPopup, closePopup }: Props) => {
    const [emiHistoryDetails, setEMIHistoryDetails] = useState<EMIHistoryDetailsType[] | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const firebaseContext = useFirebaseContext();

    const downloadCSV = (e: any) => {
        e.preventDefault();

        if (emiHistoryDetails) {
            setIsLoading(true);
            try {
                const headers = ["EMI Number,Due Date,Status,Amount,Late Fee,Payment Date"];

                const rows = emiHistoryDetails.map(
                    (item: EMIHistoryDetailsType, index: number) =>
                        `${index + 1},"${item["Due Date"]}",${item["EMI Status"]},${item["EMI Amount"]},${item["Late Fees"] || "--"},"${item["Payment Date"] || "--"}"`
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

            } catch (error: any) {
                toast.error("Something Went wrong during downloading data!");
            }
            setIsLoading(false);
        }
    };

    const getEMIDetails = async () => {
        setIsLoading(true);
        const queryResult = await firebaseContext?.getDataWithQuery("EMIDetails", "Loan Id", "==", loanId);
        if (!queryResult.empty) {
            const emiArray = queryResult.docs.map((item: any) => (item.data()));

            const historyData = emiArray.map((item: EMIHistoryDBType) => {
                const status = getStatus(item);
                const lateFees = getLateFees(item);

                return {
                    ...item,
                    "EMI Status": status,
                    "Late Fees": lateFees.toString(),
                }
            })

            setEMIHistoryDetails(historyData);
        }
    }

    const getStatus = (emiInfo: EMIHistoryDBType) => {
        const currentDate = new Date();
        const dueDate = new Date(emiInfo["Due Date"]);

        if (emiInfo["Payment Date"]) {
            return "Paid";
        }

        else if (dueDate < currentDate) {
            return "Overdue";
        }

        return "Pending";
    }

    const getLateFees = (emiInfo: EMIHistoryDBType) => {
        const dueDate = new Date(emiInfo["Due Date"]);
        const currentDate = new Date();

        const yearsDiff = currentDate.getFullYear() - dueDate.getFullYear();
        const monthsDiff = currentDate.getMonth() - dueDate.getMonth();

        // Total months difference
        let totalMonthsPassed = yearsDiff * 12 + monthsDiff;

        // Check if the current day is before the due day in the current month
        if (currentDate.getDate() < dueDate.getDate()) {
            totalMonthsPassed--; // Subtract one month if the day hasn't fully passed
        }

        return totalMonthsPassed >= 2 ? (totalMonthsPassed / 2) * 500 : 0;

    }
    useEffect(() => {
        if (isShowPopup) {
            loanId && getEMIDetails();
        }
    }, [isShowPopup])

    useEffect(() => {
        emiHistoryDetails && setIsLoading(false);
    }, [emiHistoryDetails])

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
                                        <th className="border border-black px-3 py-3 text-left text-white bg-primary">EMI no.</th>
                                        <th className="border border-black px-3 py-3 text-left text-white bg-primary">Due Date</th>
                                        <th className="border border-black px-3 py-3 text-left text-white bg-primary">Amount</th>
                                        <th className="border border-black px-3 py-3 text-left text-white bg-primary">Status</th>
                                        <th className="border border-black px-3 py-3 text-left text-white bg-primary">Late fees</th>
                                        <th className="border border-black px-3 py-3 text-left text-white bg-primary">Payment Date</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {
                                        emiHistoryDetails ? (emiHistoryDetails.map((item: EMIHistoryDetailsType, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td className="px-3 py-2 border border-black">{index + 1}</td>
                                                    <td className="px-3 py-2 border border-black">{item["Due Date"]}</td>
                                                    <td className="px-3 py-2 border border-black">₹{item["EMI Amount"]}</td>
                                                    <td className={`px-3 py-2 font-bold border border-black ${item["EMI Status"] === "Paid" ? "text-accent" : item["EMI Status"] === "Pending" ? "text-orange-500" : "text-error"}`}>{item["EMI Status"]}</td>
                                                    <td className="px-3 py-2 border border-black">{item["Late Fees"] ? "₹" + item["Late Fees"] : "--"}</td>
                                                    <td className="px-3 py-2 border border-black">{item["Payment Date"] ? item["Payment Date"] : "--"}</td>
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