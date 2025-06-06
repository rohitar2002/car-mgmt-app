'use client'

import Loader from "@/components/Loader/RotatingLines";
import AddEditCarDetails from "@/components/popup/AddEditCar";
import DeleteConfirmPopup from "@/components/popup/DeleteConfirmPopup";
import { useFirebaseContext } from "@/context/firebaseContext";
import { firestore } from "@/firebase/firebase.config";
import { CarDetailsWithIdType } from "@/interface/CarEntriesTypes";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


const DashBoard = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [allRegisteredCarInfo, setAllRegisteredCarInfo] = useState<CarDetailsWithIdType[] | null>(null);
    const [fillteredRegisteredCarInfo, setFillteredRegisteredCarInfo] = useState<CarDetailsWithIdType[] | null>(null);
    const [totalLoanAmount, setTotalLoanAmount] = useState<string>("0");
    const [showConfirm, setShowConfirm] = useState<boolean>(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
    const [carIdForDeletion, setCarIdForDeletion] = useState<string>("");
    const [carRegistrationNoForDeletion, setCarRegistrationNoForDeletion] = useState<string>("");
    const [registrationNumber, setRegistrationNumber] = useState<string>("");
    const [carModel, setCarModel] = useState<string>("");
    const [showRegistrationInput, setShowRegistrationInput] = useState<boolean>(false);
    const [showCarModelInput, setShowCarModelInput] = useState<boolean>(false);
    const firebaseContext = useFirebaseContext();
    const router = useRouter()

    const getTotalLoanAmount = () => {
        if (fillteredRegisteredCarInfo && fillteredRegisteredCarInfo.length > 0) {
            let totalAmount = "0";
            fillteredRegisteredCarInfo.forEach((item: CarDetailsWithIdType) => {
                totalAmount = (Number(totalAmount) + Number(item.loanInfo.totalLoanAmount)).toString();
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


    const handleSearch = (registrationNumber: string | null, carModel: string | null) => {
        if (registrationNumber !== null) {
            const fillteredInfo = allRegisteredCarInfo?.filter((item) => ((item.carInfo.registrationNumber).toLowerCase().includes(registrationNumber.toLowerCase())));

            setFillteredRegisteredCarInfo(fillteredInfo ? fillteredInfo : null);
        }
        else if (carModel !== null) {
            const fillteredInfo = allRegisteredCarInfo?.filter((item) => ((item.carInfo.modelNumber).toLowerCase()).includes(carModel.toLowerCase()));

            setFillteredRegisteredCarInfo(fillteredInfo ? fillteredInfo : null);
        }
    }
    useEffect(() => {
        if (firebaseContext?.userDetails && firebaseContext?.userDetails?.registeredCars?.length) {
            getCarRecords();
        }
    }, [firebaseContext?.userDetails])

    useEffect(() => {
        if (fillteredRegisteredCarInfo && fillteredRegisteredCarInfo.length > 0) {
            getTotalLoanAmount();
        }
    }, [fillteredRegisteredCarInfo])

    useEffect(() => {
        if ((showConfirm || showDeleteConfirm) && (document.getElementById("main-container"))) {
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

    }, [showConfirm, showDeleteConfirm])

    return (
        <>
            {isLoading && <Loader />}
            <AddEditCarDetails title="Add New Car" isShowPopup={showConfirm} closePopup={() => {
                setShowConfirm(false);
            }} />

            <DeleteConfirmPopup isShowPopup={showDeleteConfirm} closePopup={() => {
                setShowDeleteConfirm(false);
                setCarIdForDeletion("");
                setCarRegistrationNoForDeletion("");
            }} carId={carIdForDeletion} registrationNumber={carRegistrationNoForDeletion} getCarRecords={getCarRecords} />

            <div>
                <main className="p-5">
                    <div className="text-2xl text-primary font-bold text-center pt-10">User DashBoard</div>
                    <div className="flex flex-col justify-center items-center py-10">
                        <div className="text-2xl text-primary font-bold text-center pt-5 pb-10">Registered Car Details</div>
                        <div className="w-full">
                            <div className="flex items-center justify-end w-full text-md gap-3 md:gap-8 py-5 flex-wrap">
                                <button className="text-white bg-primary px-5 py-2 rounded " onClick={() => {
                                    setShowConfirm(true);
                                }}>Add New Car</button>

                                {showCarModelInput ?
                                    (
                                        <div className="flex items-center gap-3">
                                            <input type="text" className="border border-primary px-3 py-2 rounded focus:outline-none" placeholder="Car Model" value={carModel} onChange={(e) => {
                                                setCarModel(e.target.value);
                                            }}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") {
                                                        handleSearch(null, carModel);
                                                    }
                                                }} />
                                            <button className="text-white bg-primary px-5 py-2 rounded " onClick={(e) => {
                                                e.preventDefault();

                                                handleSearch(null, carModel)
                                            }}>Search</button>
                                        </div>
                                    ) : <button className="text-white bg-primary px-5 py-2 rounded " onClick={() => {
                                        setShowRegistrationInput(false);
                                        setShowCarModelInput(true);
                                        setCarModel("");
                                    }}>Search Using Car Model</button>}

                                {showRegistrationInput ?
                                    (
                                        <div className="flex items-center gap-3">
                                            <input type="text" className="border border-primary px-3 py-2 rounded focus:outline-none" placeholder="Registration Number" value={registrationNumber} onChange={(e) => {
                                                setRegistrationNumber(e.target.value);
                                            }} onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    handleSearch(registrationNumber, null);
                                                }
                                            }} />
                                            <button className="text-white bg-primary px-5 py-2 rounded " onClick={(e) => {
                                                e.preventDefault();

                                                handleSearch(registrationNumber, null)
                                            }}>Search</button>
                                        </div>
                                    ) : <button className="text-white bg-primary px-5 py-2 rounded " onClick={() => {
                                        setShowRegistrationInput(true);
                                        setRegistrationNumber("");
                                        setShowCarModelInput(false);
                                    }}>Search Using Registration Number</button>}

                            </div>
                            <div className="w-full overflow-auto">
                                <table className="border border-black min-w-fit w-full">
                                    <thead>
                                        <tr>
                                            <th className="border border-black px-3 py-3 text-left text-white bg-primary">Sno.</th>
                                            <th className="border border-black px-3 py-3 text-left text-white bg-primary">Registration Number</th>
                                            <th className="border border-black px-3 py-3 text-left text-white bg-primary">Car Model</th>
                                            <th className="border border-black px-3 py-3 text-left text-white bg-primary">Purchased Date</th>
                                            <th className="border border-black px-3 py-3 text-left text-white bg-primary">Total Financed Amount</th>
                                            <th className="border border-black px-3 py-3 text-left text-white bg-primary">EMI Amount</th>
                                            <th className="border border-black px-3 py-3 text-center text-white bg-primary">Action</th>
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
                                                            <td className="px-3 py-2 border border-black whitespace-nowrap">{item.carInfo.purchasedDate}</td>
                                                            <td className="px-3 py-2 border border-black">{item.loanInfo.totalLoanAmount || 0}</td>
                                                            <td className="px-3 py-2 border border-black">{item.loanInfo.emiAmount || 0}</td>
                                                            <td className="px-3 py-2 border border-black">

                                                                <button className="text-accent font-bold mr-5" onClick={(e) => {
                                                                    e.preventDefault();

                                                                    router.replace(`CarDetails?carId=${item.carId}&loanId=${item.loanId}`);
                                                                }}>View</button>

                                                                <button className="text-red-500" onClick={() => {
                                                                    setCarIdForDeletion(item.carId);
                                                                    setCarRegistrationNoForDeletion(item.carInfo.registrationNumber);
                                                                    setShowDeleteConfirm(true);
                                                                }}>Delete</button>
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