'use client'

import Loader from "@/components/Loader/RotatingLines";
import AddEditCarDetails from "@/components/popup/AddEditCar";
import EMIHistoryPopup from "@/components/popup/EMIHistory";
import ADDEMIDetails from "@/components/popup/NewEMIDetails";
import { SearchComponent } from "@/components/SearchComponent";
import { useEMIContext } from "@/context/EMIContext";
import { useFirebaseContext } from "@/context/firebaseContext";
import { firestore } from "@/firebase/firebase.config";
import { handleDateDisplay } from "@/Helper/utils";
import { CarDetailsWithIdType, EmiDetailsType } from "@/interface/CarEntriesTypes";
import { OptionType } from "@/interface/CommonTypes";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SingleValue } from "react-select";
import { toast } from "react-toastify";

const DashBoard = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [allRegisteredCarInfo, setAllRegisteredCarInfo] = useState<CarDetailsWithIdType[]>([]);
    const [fillteredRegisteredCarInfo, setFillteredRegisteredCarInfo] = useState<CarDetailsWithIdType[]>([]);
    const [totalLoanAmount, setTotalLoanAmount] = useState<string>("0");
    const [showConfirm, setShowConfirm] = useState<boolean>(false);
    const [isShowEMIPopup, setIsShowEMIPopup] = useState<boolean>(false);
    const [registrationNumber, setRegistrationNumber] = useState<SingleValue<OptionType> | null>(null);
    const [registrationNumberEMIFilter, setRegistrationNumberEMIFilter] = useState<SingleValue<OptionType> | null>(null);
    const [registrationNumberOptionList, setRegistrationNumberOptionList] = useState<OptionType[]>([]);
    const [historyTableTitle, setHistoryTableTitle] = useState<string>("");
    const [loanIdEMIUpdate, setLoanIdEMIUpdate] = useState<string>("");
    const firebaseContext = useFirebaseContext();
    const emiContext = useEMIContext();
    const router = useRouter();

    const getTotalLoanAmount = () => {
        if (fillteredRegisteredCarInfo && fillteredRegisteredCarInfo.length > 0) {
            let totalAmount = "0";
            fillteredRegisteredCarInfo.forEach((item: CarDetailsWithIdType) => {
                totalAmount = (Number(totalAmount) + Number(item.loanInfo.totalLoanAmount.replace(/\D/g, ""))).toString();
            })

            setTotalLoanAmount(totalAmount);
        }
    }

    const getCarRecords = async () => {
        setIsLoading(true);

        try {
            const requiredCarData: CarDetailsWithIdType[] = (await Promise.all(firebaseContext?.userDetails?.registeredCars.map(async (item: string) => {
                const docRef = doc(firestore, "CarDetails", item);
                const carDocument = await getDoc(docRef);
                const loanDocs = await firebaseContext.getDataWithQuery("LoanDetails", "carId", "==", item);


                return {
                    carInfo: {
                        ...carDocument.data(),
                    },

                    loanInfo: !loanDocs.empty ? {
                        ...loanDocs.docs[0].data(),
                    } : null,

                    carId: carDocument.id,
                    loanId: !loanDocs.empty ? loanDocs.docs[0].id : null,
                }
            }))).filter((item) => item.loanInfo !== null && item.carInfo !== null && !item.carInfo?.isDeleted);

            setAllRegisteredCarInfo(requiredCarData);
            setFillteredRegisteredCarInfo(requiredCarData);
        } catch (error) {
            console.error("Error encounter for fetching data: ", error);
        }

        setIsLoading(false);
    }


    const handleFilterVehicle = () => {
        const fillteredInfo = allRegisteredCarInfo ? allRegisteredCarInfo.filter((item) => ((item.carInfo.registrationNumber).toLowerCase().includes(registrationNumber ? registrationNumber.value.toLowerCase() : ""))) : [];
        setFillteredRegisteredCarInfo(fillteredInfo);
    }
    const handleCreateOptionList = () => {
        const optionList = allRegisteredCarInfo ? allRegisteredCarInfo.map((item) => ({ label: item.carInfo.registrationNumber, value: item.carInfo.registrationNumber })) : [];

        setRegistrationNumberOptionList([{ label: "Select All", value: "" }, ...optionList]);
    }
    const getEMIDetails = async (registrationNumber: string, setHistoryTableTitle?: React.Dispatch<React.SetStateAction<string>>) => {
        if (emiContext) {
            setIsLoading(true);
            const loanId = allRegisteredCarInfo.filter((item) => item.carInfo.registrationNumber === registrationNumber).map((carItem) => carItem.loanId).toString();

            setLoanIdEMIUpdate(loanId);
            await emiContext.getEMIHistory(loanId);
            if (setHistoryTableTitle) {
                setHistoryTableTitle(`EMI History (${registrationNumber})`);
            }
            setTimeout(() => {
                setIsLoading(false);
            }, 300);
        }
    }
    const handleEMIUpdate = async (emiDetails: EmiDetailsType, id: string) => {
        try {
            setIsLoading(true);
            const updateResult = await emiContext?.updateEMIDetails(emiDetails, id, loanIdEMIUpdate);
            if (updateResult)
                getEMIDetails(registrationNumberEMIFilter ? registrationNumberEMIFilter.value : "", setHistoryTableTitle);
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            }
            else {
                toast.error("Something went wrong");
            }
        } finally {
            setIsLoading(false);
        }

    }

    useEffect(() => {
        if (firebaseContext?.userDetails && firebaseContext?.userDetails?.registeredCars?.length) {
            getCarRecords();
        }
    }, [firebaseContext?.userDetails])

    useEffect(() => {
        if (allRegisteredCarInfo && allRegisteredCarInfo.length > 0) {
            handleCreateOptionList();
        }
    }, [allRegisteredCarInfo])

    useEffect(() => {
        handleFilterVehicle();
    }, [registrationNumber])
    useEffect(() => {
        if (fillteredRegisteredCarInfo && fillteredRegisteredCarInfo.length > 0) {
            getTotalLoanAmount();
        }
    }, [fillteredRegisteredCarInfo])

    useEffect(() => {
        if ((showConfirm) && (document.getElementById("main-container"))) {
            // document.body.style.display = "fixed";
            // document.body.style.overflow = "hidden";
            document.getElementById("main-container")?.classList.add("scroll-hidden");
        }
        else {
            // document.body.style.display = "relative";
            // document.body.style.overflow = "auto";
            document.getElementById("main-container")?.classList.remove("scroll-hidden");
        }

        return () => {
            // document.body.style.display = "relative";
            // document.body.style.overflow = "auto";
            document.getElementById("main-container")?.classList.remove("scroll-hidden");
        }

    }, [showConfirm])

    return (
        <>
            {isLoading && <Loader />}
            <AddEditCarDetails title="Add New Car" isShowPopup={showConfirm} closePopup={() => {
                setShowConfirm(false);
            }} />
            {emiContext && <EMIHistoryPopup
                isShowPopup={isShowEMIPopup}
                loanId={loanIdEMIUpdate}
                emiHistoryDetails={emiContext.emiHistoryDetails}
                setEMIHistoryDetails={emiContext.setEMIHistoryDetails}
                registrationNumberEMIFilter={registrationNumberEMIFilter}
                setRegistrationNumberEMIFilter={setRegistrationNumberEMIFilter}
                registrationNumberOptionList={registrationNumberOptionList}
                historyTableTitle={historyTableTitle}
                setHistoryTableTitle={setHistoryTableTitle}
                getEMIDetails={getEMIDetails}
                setEMIPopupTitle={emiContext.setEMIPopupTitle}
                setExistingEMIDetails={emiContext.setExistingEMIDetails}
                setShowEditPopup={emiContext.setShowAddEMIPopup}
                closePopup={() => {
                    setIsShowEMIPopup(false);
                    setHistoryTableTitle("");
                    setRegistrationNumberEMIFilter(null);
                    setLoanIdEMIUpdate("");
                }}
            />}
            {emiContext && <ADDEMIDetails
                isShowPopup={emiContext ? emiContext.showAddEMIPopup : false}
                closePopup={() => {
                    emiContext.setShowAddEMIPopup(false);
                    emiContext.setExistingEMIDetails(null);
                }}
                handleEMIUpdate={handleEMIUpdate}
                existingDetails={emiContext.existingEMIDetails}
                loanId={loanIdEMIUpdate}
                getEMIDetails={() => getEMIDetails(registrationNumberEMIFilter ? registrationNumberEMIFilter.value : "", setHistoryTableTitle)}
                title={emiContext.emiPopupTitle} />}
            <div>
                <main className="p-5">
                    <div className="text-2xl text-primary font-bold text-center pt-10">User DashBoard</div>
                    <div className="flex flex-col justify-center items-center py-10">
                        <div className="text-2xl text-primary font-bold text-center pt-5 pb-10">Registered Car Details</div>
                        <div className="w-full">
                            <div className="flex items-center justify-end w-full text-md gap-3 md:gap-5 py-5 flex-wrap">
                                <button className="text-white bg-primary px-5 py-2 rounded " onClick={() => {
                                    setIsShowEMIPopup(true);
                                }}>Add New EMI</button>
                                <button className="text-white bg-primary px-5 py-2 rounded " onClick={() => {
                                    setShowConfirm(true);
                                }}>Add New Car</button>

                                <SearchComponent
                                    registrationNumber={registrationNumber}
                                    setRegistrationNumber={setRegistrationNumber}
                                    registrationNumberOptionList={registrationNumberOptionList}
                                    isEmiHistory={false} />
                            </div>
                            <div className="w-full overflow-auto">
                                <table className="border border-black min-w-fit w-full">
                                    <thead>
                                        <tr>
                                            <th className="border border-black px-3 py-3 text-left text-white bg-primary">Sno.</th>
                                            <th className="border border-black px-3 py-3 text-left text-white bg-primary">Registration Number</th>
                                            <th className="border border-black px-3 py-3 text-left text-white bg-primary">Car Model</th>
                                            <th className="border border-black px-3 py-3 text-left text-white bg-primary">Purchased Date</th>
                                            <th className="border border-black px-3 py-3 text-left text-white bg-primary">EMI Amount</th>
                                            <th className="border border-black px-3 py-3 text-left text-white bg-primary">Action</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {
                                            (fillteredRegisteredCarInfo && fillteredRegisteredCarInfo.length > 0) ?
                                                fillteredRegisteredCarInfo?.map((item, index) => {

                                                    return (
                                                        <tr key={item.carInfo.registrationNumber}>
                                                            <td className="px-3 py-2 border border-black">{index + 1}</td>
                                                            <td className="px-3 py-2 border border-black">{item.carInfo.registrationNumber}</td>
                                                            <td className="px-3 py-2 border border-black">{item.carInfo.modelNumber}</td>
                                                            <td className="px-3 py-2 border border-black whitespace-nowrap">{(item.carInfo.purchasedDate && item.carInfo.purchasedDate.trim()) ? handleDateDisplay(item.carInfo.purchasedDate) : "--"}</td>
                                                            <td className="px-3 py-2 border border-black">{"₹" + ((item.loanInfo.emiAmount).toString().trim() ? item.loanInfo.emiAmount : 0)}</td>
                                                            <td className="px-3 py-2 border border-black">

                                                                <button className="text-accent font-bold mr-5" onClick={(e) => {
                                                                    e.preventDefault();

                                                                    router.replace(`CarDetails?carId=${item.carId}&loanId=${item.loanId}`);
                                                                }}>View</button>
                                                            </td>
                                                        </tr>
                                                    )
                                                }) :
                                                <tr>
                                                    <td colSpan={7} className="text-center text-xl text-accent font-bold py-5">No Registered Car Found!</td>
                                                </tr>
                                        }
                                    </tbody>
                                </table>
                            </div>
                            <div className="flex flex-col justify-center gap-5 my-16 p-5 font-bold border border-primary rounded">
                                <div className="text-xl text-primary underline">Summary</div>
                                <div className="flex flex-col items-start justify-center gap-3 px-2 md:px-5 text-lg">
                                    <div className="flex items-center gap-3">
                                        <label className="text-primary">Total Car Registered: </label>
                                        <h2>{fillteredRegisteredCarInfo?.length || 0}</h2>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <label className="text-primary">Total Loan Amount: </label>
                                        <h2>{totalLoanAmount}</h2>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    )
}

export default DashBoard;