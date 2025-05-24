'use client'

import Loader from "@/components/Loader/RotatingLines";
import AddEditCarDetails from "@/components/popup/AddEditCar";
import { EMIHistoryPopup } from "@/components/popup/EMIHistory";
import { firestore } from "@/firebase/firebase.config";
import { CarDetailsWithIdType, CarInfoType, CustomerInfoType, EmiDetailsType, LoanInfoType } from "@/interface/CarEntriesTypes";
import { doc, DocumentData, getDoc, updateDoc } from "firebase/firestore";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import ADDEMIDetails from "../popup/NewEMIDetails";
import { toast } from "react-toastify";
import { useFirebaseContext } from "@/context/firebaseContext";
import { CustomerInfoViewer } from "./CustomerInfoViewer";
import { CarInfoViewer } from "./CarInfoViewer";
import { LoanInfoViewer } from "./LoanInfoViewer";

const CarViewDataContent = () => {
    const [carDetails, setCarDetails] = useState<CarDetailsWithIdType | null>(null);
    const [emiHistoryDetails, setEMIHistoryDetails] = useState<EmiDetailsType[] | null>(null);
    const [existingEMIDetails, setExistingEMIDetails] = useState<EmiDetailsType | null>(null);
    const [emiPopupTitle, setEMIPopupTitle] = useState<string>("Add EMI Details");
    const [showConfirm, setShowConfirm] = useState<boolean>(false);
    const [showUpdatePopup, setShowUpdatePopup] = useState<boolean>(false);
    const [showAddEMIPopup, setShowAddEMIPopup] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [loanId, setLoanId] = useState<string>("");
    const searchParms = useSearchParams();
    const firebaseContext = useFirebaseContext();

    const getData = async () => {
        setIsLoading(true);
        const carId = searchParms.get("carId");
        const loanId = searchParms.get("loanId");

        if (carId && loanId) {
            try {
                const carDocRef = doc(firestore, "CarDetails", carId);
                const carDocument = await getDoc(carDocRef);

                const loanDocRef = doc(firestore, "LoanDetails", loanId);
                const loanDocument = await getDoc(loanDocRef);

                const queryResult = await firebaseContext?.getDataWithQuery("CustomerDetails", "carId", "==", carId);
                const carInfo: CarInfoType = {
                    ...carDocument.data() as CarInfoType
                };

                const loanInfo: LoanInfoType = {
                    ...loanDocument?.data() as LoanInfoType
                };
                const customerInfo = queryResult?.docs[0]?.data() as CustomerInfoType;

                const carDetails: CarDetailsWithIdType = {
                    carInfo,
                    loanInfo,
                    customerInfo,
                    carId: carId,
                    loanId: loanId,
                    customerId: queryResult?.docs[0]?.id as string,
                }
                setCarDetails(carDetails);

            } catch (error) {
                console.error("Error Encouter during fetching Data: ", error);

            }
            setIsLoading(false);
        }
    }

    const handleEMIClosePopup = () => {
        setShowAddEMIPopup(false);
        setExistingEMIDetails(null);
        setEMIPopupTitle("Add EMI Details");
    }
    useEffect(() => {
        if (carDetails) {
            setIsLoading(false);
        }

    }, [carDetails])

    const getStatus = (emiInfo: EmiDetailsType) => {
        const currentDate = new Date();
        const dueDate = new Date(emiInfo.emiDueDate);
        dueDate.setHours(0, 0, 0, 0);
        currentDate.setHours(0, 0, 0, 0);

        if (emiInfo.emiReceivedDate) {
            return "Paid";
        }

        else if (dueDate < currentDate) {
            return "Overdue";
        }

        return "Pending";
    }

    const getEMIDetails = async (loanId: string) => {
        setIsLoading(true);
        const queryResult = await firebaseContext?.getDataWithQuery("EMIDetails", "loanId", "==", loanId);
        if (queryResult && !queryResult.empty) {
            const emiArray = queryResult.docs.map((item: DocumentData) => (item.data()));

            const historyData = emiArray.map((item: EmiDetailsType) => {
                const status = getStatus(item);

                return {
                    ...item,
                    emiStatus: status,
                }
            })
            historyData.sort((a: EmiDetailsType, b: EmiDetailsType) => parseInt(a.emiNo) - parseInt(b.emiNo));
            setEMIHistoryDetails(historyData);
        }
        setIsLoading(false);
    }

    const handleEMIUpdate = async (emiDetails: EmiDetailsType) => {
        setIsLoading(true);
        try {
            const emiDocs = await firebaseContext?.getDataWithQuery("EMIDetails", "loanId", "==", loanId);
            if (emiDocs && !emiDocs.empty) {
                const emiData = emiDocs.docs.find((item: DocumentData) => item.data().emiNo === emiDetails.emiNo);
                if (emiData) {
                    await updateDoc(emiData.ref, {
                        ...emiDetails
                    })
                }
            }

            getEMIDetails(loanId);
            setShowAddEMIPopup(false);
            setExistingEMIDetails(null);
            setEMIPopupTitle("Add EMI Details");
            toast.success("EMI Details Updated Successfully");

        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            }
            else {
                toast.error("Something went wrong");
            }
        }
        finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        if (searchParms.size) {
            getData();
            if (searchParms.get("loanId")) {
                setLoanId(searchParms.get("loanId")!);
            }
        }
    }, [searchParms])

    useEffect(() => {
        if (showConfirm || showUpdatePopup) {
            document.body.style.display = "fixed";
            document.body.style.overflow = "hidden";
        }
        else {
            document.body.style.display = "relative";
            document.body.style.overflow = "auto";
        }

        return () => {
            document.body.style.display = "relative";
            document.body.style.overflow = "auto";
        }

    }, [showConfirm || showUpdatePopup])

    return (
        <>
            {isLoading && <Loader />}
            <EMIHistoryPopup loanId={carDetails?.loanId} emiHistoryDetails={emiHistoryDetails} setEMIHistoryDetails={setEMIHistoryDetails} getEMIDetails={getEMIDetails} isShowPopup={showConfirm} setEMIPopupTitle={setEMIPopupTitle} setExistingEMIDetails={setExistingEMIDetails} setShowEditPopup={setShowAddEMIPopup} closePopup={() => {
                setShowConfirm(false);
            }} />

            <AddEditCarDetails isShowPopup={showUpdatePopup} closePopup={() => {
                setShowUpdatePopup(false);
                setEMIPopupTitle("Add EMI Details");
            }} title="Update Information" existingDetails={carDetails!} getCarDetails={getData} />

            <ADDEMIDetails isShowPopup={showAddEMIPopup} title={emiPopupTitle} handleEMIUpdate={handleEMIUpdate} existingDetails={existingEMIDetails} closePopup={handleEMIClosePopup} loanId={loanId} />


            <div className="flex justify-center items-center relative top-20">
                <div className="w-full lg:w-3/5 h-full border border-primary rounded m-10">
                    <div className="text-2xl underline bg-primary text-white font-bold text-center py-5 ">Car Details</div>
                    <CarInfoViewer carInfo={carDetails?.carInfo} />
                    <LoanInfoViewer loanInfo={carDetails?.loanInfo} />

                    <section className="border-b border-gray-500 bg-white p-5">
                        <h2 className="text-xl font-bold text-primary mb-5 text-center sm:text-left">EMI History</h2>

                        <div className="flex flex-col items-center-center sm:flex-row sm:items-start lg:px-10 gap-5">
                            <button className="px-3 py-2 bg-primary text-white rounded" onClick={() => {
                                setShowAddEMIPopup(true);
                            }}>Add EMI Details</button>
                            <button className="px-3 py-2 bg-primary text-white rounded" onClick={() => {
                                setShowConfirm(true);
                            }}>Click to see EMI history</button>
                        </div>
                    </section>

                    <CustomerInfoViewer customerInfo={carDetails?.customerInfo} />

                    <div className="flex items-center justify-center flex-col sm:flex-row sm:justify-end gap-5 p-5">
                        <button className="px-3 py-2 w-full sm:w-fit bg-primary text-white rounded" onClick={() => {
                            setShowUpdatePopup(true);
                        }}>Update Car Info</button>
                        <Link href="/pages/DashBoard" className="w-full sm:w-fit">
                            <button className="px-3 py-2 w-full bg-primary text-white rounded">Go to DashBoard</button>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CarViewDataContent;