'use client'

import Loader from "@/components/Loader/RotatingLines";
import AddEditCarDetails from "@/components/popup/AddEditCar";
import { EMIHistoryPopup } from "@/components/popup/EMIHistory";
import { firestore } from "@/firebase/firebase.config";
import { CarDetailsWithIdType, CarInfoType, LoanInfoType } from "@/interface/CarEntriesTypes";
import { doc, getDoc } from "firebase/firestore";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const CarViewDataContent = () => {
    const [carDetails, setCarDetails] = useState<CarDetailsWithIdType | null>(null);
    const [showConfirm, setShowConfirm] = useState<boolean>(false);
    const [showUpdatePopup, setShowUpdatePopup] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const searchParms = useSearchParams();

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

                const carInfo: CarInfoType = {
                    ...carDocument.data() as CarInfoType
                };

                const loanInfo: LoanInfoType = {
                    ...loanDocument?.data() as LoanInfoType
                };

                const carDetails: CarDetailsWithIdType = {
                    carInfo,
                    loanInfo,
                    carId: carId,
                    loanId: loanId,
                }
                setCarDetails(carDetails);

            } catch (error) {
                console.error("Error Encouter during fetching Data: ", error);

            }
            setIsLoading(false);
        }
    }

    useEffect(() => {
        if (carDetails) {
            setIsLoading(false);
        }

    }, [carDetails])

    useEffect(() => {
        if (searchParms.size) {
            getData();
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
            <EMIHistoryPopup loanId={carDetails?.loanId} isShowPopup={showConfirm} closePopup={() => {
                setShowConfirm(false);
            }} />

            <AddEditCarDetails isShowPopup={showUpdatePopup} closePopup={() => {
                setShowUpdatePopup(false);
            }} title="Update Information" existingDetails={carDetails!} getCarDetails={getData} />

            <div className="flex justify-center items-center">
                <div className="w-full lg:w-3/5 h-full border border-primary rounded m-10">
                    <div className="text-2xl underline bg-primary text-white font-bold text-center py-5 ">Car Details</div>

                    <section className="border-b border-gray-500 bg-white p-5">
                        <h2 className="text-xl font-bold text-primary mb-5 text-center sm:text-left">Car Information</h2>
                        <div className="flex flex-col gap-3 justify-center  px-2 lg:px-10">
                            <div className="flex sm:items-center justify-between flex-col sm:flex-row gap-3" >
                                <label className="font-bold text-md md:text-lg">Registration Number:</label>
                                <h2 className="text-md">{carDetails?.carInfo["Registration Number"] || "--"}</h2>
                            </div>
                            <div className="flex sm:items-center justify-between flex-col sm:flex-row gap-3">
                                <label className="font-bold text-md md:text-lg">Car Brand:</label>
                                <h2 className="text-md">{carDetails?.carInfo["Brand Name"] || "--"}</h2>
                            </div>
                            <div className="flex sm:items-center justify-between flex-col sm:flex-row gap-3">
                                <label className="font-bold text-md md:text-lg">Car Model:</label>
                                <h2 className="text-md">{carDetails?.carInfo["Model Number"] || "--"}</h2>
                            </div>
                            <div className="flex sm:items-center justify-between flex-col sm:flex-row gap-3">
                                <label className="font-bold text-md md:text-lg">Chassis Number:</label>
                                <h2 className="text-md">{carDetails?.carInfo["Chassis Number"] || "--"}</h2>
                            </div>
                            <div className="flex sm:items-center justify-between flex-col sm:flex-row gap-3">
                                <label className="font-bold text-md md:text-lg">Engine Number:</label>
                                <h2 className="text-md">{carDetails?.carInfo["Engine Number"] || "--"}</h2>
                            </div>
                            <div className="flex sm:items-center justify-between flex-col sm:flex-row gap-3">
                                <label className="font-bold text-md md:text-lg">Purchase Date:</label>
                                <h2 className="text-md">{carDetails?.carInfo["Purchased Date"] || "--"}</h2>
                            </div>
                        </div>
                    </section>
                    <section className="border-b border-gray-500 bg-white p-5">
                        <h2 className="text-xl font-bold text-primary mb-5 text-center sm:text-left">Loan Information</h2>
                        <div className="flex flex-col gap-3 justify-center px-2 lg:px-10">
                            <div className="flex sm:items-center justify-between flex-col sm:flex-row gap-3">
                                <label className="font-bold text-lg">Total Loan Amount:</label>
                                <h2 className="text-md">{carDetails?.loanInfo["Total Loan Amount"] || "--"}</h2>
                            </div>
                            <div className="flex sm:items-center justify-between flex-col sm:flex-row gap-3">
                                <label className="font-bold text-lg">Loan Start Date:</label>
                                <h2 className="text-md">{carDetails?.loanInfo["Loan Start Date"] || "--"}</h2>
                            </div>
                            <div className="flex sm:items-center justify-between flex-col sm:flex-row gap-3">
                                <label className="font-bold text-lg">Loan Tenure:</label>
                                <h2 className="text-md">{carDetails?.loanInfo["Loan Tenure"] || "--"} Month</h2>
                            </div>
                            <div className="flex sm:items-center justify-between flex-col sm:flex-row gap-3">
                                <label className="font-bold text-lg">Interest Rate:</label>
                                <h2 className="text-md">{carDetails?.loanInfo["Interest Rate"] || "--"}%</h2>
                            </div>
                            <div className="flex sm:items-center justify-between flex-col sm:flex-row gap-3">
                                <label className="font-bold text-lg">Total paid Amount:</label>
                                <h2 className="text-md">{carDetails?.loanInfo["Total Paid Amount"] || "--"}</h2>
                            </div>
                            <div className="flex sm:items-center justify-between flex-col sm:flex-row gap-3">
                                <label className="font-bold text-lg">Remaining Balance:</label>
                                <h2 className="text-md">{(Number(carDetails?.loanInfo["Total Loan Amount"]) - Number(carDetails?.loanInfo["Total Paid Amount"])).toString() || "--"}</h2>
                            </div>
                        </div>
                    </section>

                    <section className="border-b border-gray-500 bg-white p-5">
                        <h2 className="text-xl font-bold text-primary mb-5 text-center sm:text-left">EMI History</h2>

                        <div className="flex justify-center sm:justify-start items-center lg:px-10">
                            <button className="px-3 py-2 bg-primary text-white rounded" onClick={() => {
                                setShowConfirm(true);
                            }}>Click to see EMI history</button>
                        </div>
                    </section>

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