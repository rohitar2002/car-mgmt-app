'use client'

import { EMIContextType, EmiDetailsType, EMIDetailsWithIDType } from "@/interface/CarEntriesTypes";
import { doc, DocumentData, updateDoc } from "firebase/firestore";
import { createContext, useContext, useState } from "react";
import { useFirebaseContext } from "./firebaseContext";
import { toast } from "react-toastify";
import { firestore } from "@/firebase/firebase.config";
import { dateToString, getLastDateOfMonth } from "@/Helper/utils";

const EMIContext = createContext<EMIContextType | null>(null);

export const EMIContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [emiHistoryDetails, setEMIHistoryDetails] = useState<EMIDetailsWithIDType[]>([]);
    const [existingEMIDetails, setExistingEMIDetails] = useState<EMIDetailsWithIDType | null>(null);
    const [emiPopupTitle, setEMIPopupTitle] = useState<string>("Add EMI Details");
    const [showAddEMIPopup, setShowAddEMIPopup] = useState<boolean>(false);
    const firebaseContext = useFirebaseContext();

    const getStatus = (emiInfo: EMIDetailsWithIDType) => {
        const currentDate = new Date();
        const dueDate = new Date(emiInfo.data.emiDueDate);
        dueDate.setHours(0, 0, 0, 0);
        currentDate.setHours(0, 0, 0, 0);

        if (emiInfo.data.emiReceivedDate) {
            return "Paid";
        }

        else if (dueDate < currentDate) {
            return "Overdue";
        }

        return "Pending";
    }
    const getEMIHistory = async (loanId: string) => {
        // API call to fetch EMI history based on loanId
        const queryResult = await firebaseContext?.getDataWithQuery("EMIDetails", "loanId", "==", loanId);
        if (queryResult && !queryResult.empty) {
            const emiArray = queryResult.docs.map((item: DocumentData) => ({
                data: item.data(),
                id: item.id,
            }));

            const historyData = emiArray.map((item: EMIDetailsWithIDType) => {
                const status = getStatus(item);

                return {
                    id: item.id,
                    data: {
                        ...item.data,
                        emiStatus: status,
                    }
                }
            })
            historyData.sort((a: EMIDetailsWithIDType, b: EMIDetailsWithIDType) => Number(a.data.emiNo) - Number(b.data.emiNo));
            setEMIHistoryDetails(historyData);
        }
    }

    const updateEMIDetails = async (emiDetails: EmiDetailsType, id: string, loanId: string) => {
        if (emiDetails.emiNo.toString().trim() && id.trim()) {
            const emiDocs = await firebaseContext?.getDataWithQuery("EMIDetails", "loanId", "==", loanId);
            if (emiDocs && !emiDocs.empty) {
                const emiData = emiDocs.docs.find((item: DocumentData) => item.data().emiNo === emiDetails.emiNo && item.id !== id);
                if (emiData) {
                    toast.error("EMI No already exists. Please use a different EMI No.");
                    return false;
                }
            }
        }

        await updateDoc(doc(firestore, 'EMIDetails', id), {
            ...emiDetails
        })

        setShowAddEMIPopup(false);
        setExistingEMIDetails(null);
        setEMIPopupTitle("Add EMI Details");
        toast.success("EMI Details Updated Successfully");
        return true;
    }

    const nextEMIDate = (value: string, firstDueDate: string | undefined) => {
        const [year, month, date] = value.split("-").map(Number);
        let dueDate;
        if (firstDueDate && firstDueDate.trim()) {
            [dueDate] = firstDueDate.split("-").map(Number).reverse();
        }
        const safeDate = Math.min(dueDate ? dueDate : date, getLastDateOfMonth(year, month));
        const nextEMIDateCalculate = new Date(year, month, safeDate);
        return dateToString(nextEMIDateCalculate);
    }

    return (
        <EMIContext.Provider value={{ emiHistoryDetails, setEMIHistoryDetails, existingEMIDetails, setExistingEMIDetails, emiPopupTitle, setEMIPopupTitle, showAddEMIPopup, setShowAddEMIPopup, getEMIHistory, updateEMIDetails, nextEMIDate }}>
            {children}
        </EMIContext.Provider>
    )
}

export const useEMIContext = () => {
    const emiContext = useContext<EMIContextType | null>(EMIContext);
    return emiContext
}