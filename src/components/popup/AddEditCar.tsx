import { CarInfoType, CarDetailsType, LoanInfoType, CarDetailsWithIdType, CarInfoChangesStatusType, LoanInfoChangesStatusType, CustomerInfoType, CustomerInfoChangesStatusType } from "@/interface/CarEntriesTypes";
import { useEffect, useState } from "react";
import { MdClose } from "react-icons/md";
import Modal from "react-modal"
import { CarDetails } from "../CarInfoSection";
import { LoanDetails } from "../LoanInfoSection";
import { useFirebaseContext } from "@/context/firebaseContext";
import { toast } from "react-toastify";
import Loader from "../Loader/RotatingLines";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { firestore } from "@/firebase/firebase.config";
import { isMobile, isTablet } from "react-device-detect";
import { CustomerDetails } from "../CustomerInfoSection";

Modal.setAppElement("#documentBody");

interface Props {
    title: string;
    existingDetails?: CarDetailsWithIdType;
    getCarDetails?: () => Promise<void>;
    isShowPopup: boolean;
    closePopup: () => void;
}
const AddEditCarDetails = ({ title, existingDetails, isShowPopup, closePopup, getCarDetails }: Props) => {
    const [carInfo, setCarInfo] = useState<CarInfoType>({
        registrationNumber: existingDetails?.carInfo.registrationNumber || "",
        modelNumber: existingDetails?.carInfo.modelNumber || "",
        brandName: existingDetails?.carInfo.brandName || "",
        engineNumber: existingDetails?.carInfo.engineNumber || "",
        chassisNumber: existingDetails?.carInfo.chassisNumber || "",
        purchasedDate: existingDetails?.carInfo.purchasedDate || "",
    })
    const [customerInfo, setCustomerInfo] = useState<CustomerInfoType>({
        customerName: existingDetails?.customerInfo.customerName || "",
        address: existingDetails?.customerInfo.address || "",
        mobileNumber: existingDetails?.customerInfo.mobileNumber || "",
        guardianName: existingDetails?.customerInfo.guardianName || "",
        guarantorName: existingDetails?.customerInfo.guarantorName || "",
        guarantorAddress: existingDetails?.customerInfo.guarantorAddress || "",
        guarantorMobileNumber: existingDetails?.customerInfo.guarantorMobileNumber || "",
        guarantorGuardianName: existingDetails?.customerInfo.guarantorGuardianName || "",
    })

    const [loanInfo, setLoanInfo] = useState<LoanInfoType>({
        totalSaleAmount: existingDetails?.loanInfo.totalSaleAmount || "",
        totalLoanAmount: existingDetails?.loanInfo.totalLoanAmount || "",
        loanStartDate: existingDetails?.loanInfo.loanStartDate || "",
        loanTenure: existingDetails?.loanInfo.loanTenure || "",
        emiAmount: existingDetails?.loanInfo.emiAmount || "",
        firstEmiDate: existingDetails?.loanInfo.firstEmiDate || "",
        dueAmount: existingDetails?.loanInfo.dueAmount || "",
        additionalCharges: existingDetails?.loanInfo.additionalCharges || "",
        dastiAmount: existingDetails?.loanInfo.dastiAmount || "",
        downPayment: existingDetails?.loanInfo.downPayment || "",
        interestRate: existingDetails?.loanInfo.interestRate || "",
    })
    const [registrationNumberError, setRegistrationNumberError] = useState<string>("")
    // const [carInfoError, setCarInfoError] = useState<CarInfoErrorType>({
    //     registrationNumberError: "",
    //     modelNumberError: "",
    //     brandNameError: "",
    //     engineNumberError: "",
    //     chassisNumberError: "",
    //     purchasedDateError: "",
    // })
    // const [customerInfoError, setCustomerInfoError] = useState<CustomerInfoType>({
    //     customerName: "",
    //     address: "",
    //     mobileNumber: "",
    //     guardianName: "",
    //     guarantorName: "",
    //     guarantorAddress: "",
    //     guarantorMobileNumber: "",
    //     guarantorGuardianName: "",
    // })

    // const [loanInfoError, setLoanInfoError] = useState<LoanInfoErrorType>({
    //     totalSaleAmountError: "",
    //     totalLoanAmountError: "",
    //     loanStartDateError: "",
    //     loanTenureError: "",
    //     emiAmountError: "",
    //     firstEmiDateError: "",
    //     dueAmountError: "",
    //     additionalChargesError: "",
    //     dastiAmountError: "",
    //     downPaymentError: "",
    //     interestRateError: "",
    // })

    const [carInfoChangesStatus, setCarInfoChangesStatus] = useState<CarInfoChangesStatusType>({
        registrationNumber: false,
        modelNumber: false,
        brandName: false,
        engineNumber: false,
        chassisNumber: false,
        purchasedDate: false,
    })
    const [customerInfoChangesStatus, setCustomerInfoChangesStatus] = useState<CustomerInfoChangesStatusType>({
        customerName: false,
        address: false,
        mobileNumber: false,
        guardianName: false,
        guarantorName: false,
        guarantorAddress: false,
        guarantorMobileNumber: false,
        guarantorGuardianName: false,
    })

    const [loanInfoChangesStatus, setLoanInfoChangesStatus] = useState<LoanInfoChangesStatusType>({
        totalSaleAmount: false,
        totalLoanAmount: false,
        loanStartDate: false,
        loanTenure: false,
        emiAmount: false,
        firstEmiDate: false,
        dueAmount: false,
        additionalCharges: false,
        dastiAmount: false,
        downPayment: false,
        interestRate: false,
    })
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [modalWidth, setModalWidth] = useState<string>("50%");
    const [isCarInfoSection, setIsCarInfoSection] = useState<boolean>(true);
    const [isLoanInfoSection, setIsLoanInfoSection] = useState<boolean>(true);
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
            height: "100%",
            border: "1px solid #ccc",
            borderRadius: "8px",
            background: "#ffffff",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            overflow: "auto",
        },
    };

    const clearState = () => {
        setIsCarInfoSection(true);
        setCarInfo({
            registrationNumber: "",
            modelNumber: "",
            brandName: "",
            engineNumber: "",
            chassisNumber: "",
            purchasedDate: "",
        })
        setLoanInfo({
            totalSaleAmount: "",
            totalLoanAmount: "",
            loanStartDate: "",
            loanTenure: "",
            emiAmount: "",
            firstEmiDate: "",
            dueAmount: "",
            additionalCharges: "",
            dastiAmount: "",
            downPayment: "",
            interestRate: "",
        })
        setCustomerInfo({
            customerName: "",
            address: "",
            mobileNumber: "",
            guardianName: "",
            guarantorName: "",
            guarantorAddress: "",
            guarantorMobileNumber: "",
            guarantorGuardianName: "",
        })
        setRegistrationNumberError("");
        // setCarInfoError({
        //     registrationNumberError: "",
        //     modelNumberError: "",
        //     brandNameError: "",
        //     engineNumberError: "",
        //     chassisNumberError: "",
        //     purchasedDateError: "",
        // })

        // setLoanInfoError({
        //     totalSaleAmountError: "",
        //     totalLoanAmountError: "",
        //     loanStartDateError: "",
        //     loanTenureError: "",
        //     emiAmountError: "",
        //     firstEmiDateError: "",
        //     dueAmountError: "",
        //     additionalChargesError: "",
        //     dastiAmountError: "",
        //     downPaymentError: "",
        //     interestRateError: "",
        // })
        // setCustomerInfoError({
        //     customerName: "",
        //     address: "",
        //     mobileNumber: "",
        //     guardianName: "",
        //     guarantorName: "",
        //     guarantorAddress: "",
        //     guarantorMobileNumber: "",
        //     guarantorGuardianName: "",
        // })

    }

    // const isCustomerInfoValid = () => {
    //     if (customerInfo.customerName.trim() === "") {
    //         setCustomerInfoError((prev: CustomerInfoType) => ({
    //             ...prev,
    //             customerName: "This Field is Required",
    //         }))
    //         return false;
    //     }
    //     if (customerInfo.address.trim() === "") {
    //         setCustomerInfoError((prev: CustomerInfoType) => ({
    //             ...prev,
    //             address: "This Field is Required",
    //         }))
    //         return false;
    //     }
    //     if (customerInfo.mobileNumber.trim() === "") {
    //         setCustomerInfoError((prev: CustomerInfoType) => ({
    //             ...prev,
    //             mobileNumber: "This Field is Required",
    //         }))
    //         return false;
    //     }
    //     if (customerInfo.guardianName.trim() === "") {
    //         setCustomerInfoError((prev: CustomerInfoType) => ({
    //             ...prev,
    //             guardianName: "This Field is Required",
    //         }))
    //         return false;
    //     }
    //     if (customerInfo.guarantorName.trim() === "") {
    //         setCustomerInfoError((prev: CustomerInfoType) => ({
    //             ...prev,
    //             guarantorName: "This Field is Required",
    //         }))
    //         return false;
    //     }
    //     if (customerInfo.guarantorAddress.trim() === "") {
    //         setCustomerInfoError((prev: CustomerInfoType) => ({
    //             ...prev,
    //             guarantorAddress: "This Field is Required",
    //         }))
    //         return false;
    //     }
    //     if (customerInfo.guarantorMobileNumber.trim() === "") {
    //         setCustomerInfoError((prev: CustomerInfoType) => ({
    //             ...prev,
    //             guarantorMobileNumber: "This Field is Required",
    //         }))
    //         return false;
    //     }
    //     if (customerInfo.guarantorGuardianName.trim() === "") {
    //         setCustomerInfoError((prev: CustomerInfoType) => ({
    //             ...prev,
    //             guarantorGuardianName: "This Field is Required",
    //         }))
    //         return false;
    //     }

    //     return true;
    // }
    const handleSubmit = async () => {
        // const isValidCustomerInfo = isCustomerInfoValid();
        // if (!isValidCustomerInfo) return;

        setIsLoading(true);

        const queryResult = await firebaseContext?.getDataWithQuery("CarDetails", "registrationNumber", "==", carInfo.registrationNumber);
        if (queryResult && !queryResult.empty) {
            const documentData = queryResult.docs[0].data();

            if (!documentData.isDeleted) {
                toast.error("Registration Number Already Exists!");
                setIsLoading(false);

                return;
            }
            else {
                try {
                    const loanQuery = await firebaseContext?.getDataWithQuery("LoanDetails", "carId", "==", queryResult.docs[0].id);
                    const emiQuery = await firebaseContext?.getDataWithQuery("EMIDetails", "loanId", "==", loanQuery?.docs[0].id);
                    const customerQuery = await firebaseContext?.getDataWithQuery("CustomerDetails", "carId", "==", queryResult.docs[0].id);

                    if (queryResult) {
                        await deleteDoc(queryResult.docs[0].ref);

                        if (loanQuery) {
                            await deleteDoc(loanQuery.docs[0].ref);
                        }

                        if (emiQuery) {
                            await deleteDoc(emiQuery.docs[0].ref);
                        }
                        if (customerQuery) {
                            await deleteDoc(customerQuery.docs[0].ref);
                        }

                        const usersQuery = await firebaseContext?.getDataWithQuery("Users", "email", "==", firebaseContext?.userDetails?.email);

                        if (usersQuery) {
                            const userData = usersQuery.docs[0].data();

                            const carIds = userData.registeredCars;
                            const updatedCarIds = carIds.filter((item: string) => item !== queryResult.docs[0].id);

                            await updateDoc(usersQuery.docs[0].ref, {
                                registeredCars: updatedCarIds,
                            })
                        }

                    }
                } catch (error) {
                    console.error(error);

                    toast.error("Something Went wrong. Try Again after Some time.");
                }
            }
        }

        const newCarRecord: CarDetailsType = {
            carInfo: {
                ...carInfo,
            },
            customerInfo: {
                ...customerInfo,
            },
            loanInfo: {
                ...loanInfo,
            },
        }

        const addRecordResult = await firebaseContext?.addCarRecord(newCarRecord);

        if (typeof addRecordResult == "string") {
            toast.error(addRecordResult);
        }
        else {
            toast.success("New Car Added Successfully.");
            clearState();
            closePopup();
        }

        setIsLoading(false);
    }
    const handleUpdate = async () => {
        // const isValidCustomerInfo = isCustomerInfoValid();
        // if (!isValidCustomerInfo) return;

        setIsLoading(true);

        const updatedCarInfo: Partial<CarInfoType> = {};
        const updatedLoanInfo: Partial<LoanInfoType> = {};
        const updatedCustomerInfo: Partial<CustomerInfoType> = {};

        for (const key in carInfoChangesStatus) {
            if (carInfoChangesStatus[key as keyof typeof carInfoChangesStatus]) {
                updatedCarInfo[key as keyof CarInfoType] = carInfo[key as keyof CarInfoType];
            }
        }

        for (const key in loanInfoChangesStatus) {
            if (loanInfoChangesStatus[key as keyof typeof loanInfoChangesStatus]) {
                updatedLoanInfo[key as keyof LoanInfoChangesStatusType] = loanInfo[key as keyof LoanInfoChangesStatusType];
            }
        }

        for (const key in customerInfoChangesStatus) {
            if (customerInfoChangesStatus[key as keyof typeof customerInfoChangesStatus]) {
                updatedCustomerInfo[key as keyof CustomerInfoType] = customerInfo[key as keyof CustomerInfoType];
            }
        }

        if (existingDetails) {
            try {

                if (Object.keys(updatedCarInfo).length) {
                    const carDocRef = doc(firestore, "CarDetails", existingDetails.carId)
                    await updateDoc(carDocRef, updatedCarInfo)
                }

                if (Object.keys(updatedLoanInfo).length) {
                    const carDocRef = doc(firestore, "LoanDetails", existingDetails.loanId)
                    await updateDoc(carDocRef, updatedLoanInfo)
                }
                if (Object.keys(updatedCustomerInfo).length) {
                    const carDocRef = doc(firestore, "CustomerDetails", existingDetails.customerId)
                    await updateDoc(carDocRef, updatedCustomerInfo)
                }

                toast.success("Car Details Updated Successfully.");
                clearState();
                closePopup();

                if (getCarDetails) {
                    getCarDetails();
                }
            } catch (error: unknown) {
                if (error instanceof Error) {
                    toast.error(error.message);
                } else {
                    toast.error("Something Went Wrong!");
                }
            }
        }
        setIsLoading(false);
    }

    const handleNextPhase = () => {
        if (isCarInfoSection) {
            if (carInfo.registrationNumber.trim() === "") {
                setRegistrationNumberError("This Field is Required");
                // setCarInfoError((prev: CarInfoErrorType) => ({
                //     ...prev,
                //     registrationNumberError: "This Field is Required",
                // }))

                return;
            }
            // if (carInfo.modelNumber.trim() === "") {
            //     setCarInfoError((prev: CarInfoErrorType) => ({
            //         ...prev,
            //         modelNumberError: "This Field is Required",
            //     }))

            //     return;
            // }
            // if (carInfo.brandName.trim() === "") {
            //     setCarInfoError((prev: CarInfoErrorType) => ({
            //         ...prev,
            //         brandNameError: "This Field is Required",
            //     }))

            //     return;
            // }
            // if (carInfo.engineNumber.trim() === "") {
            //     setCarInfoError((prev: CarInfoErrorType) => ({
            //         ...prev,
            //         engineNumberError: "This Field is Required",
            //     }))

            //     return;
            // }
            // if (carInfo.chassisNumber.trim() === "") {
            //     setCarInfoError((prev: CarInfoErrorType) => ({
            //         ...prev,
            //         chassisNumberError: "This Field is Required",
            //     }))

            //     return;
            // }
            // if (carInfo.purchasedDate.trim() === "") {
            //     setCarInfoError((prev: CarInfoErrorType) => ({
            //         ...prev,
            //         purchasedDateError: "This Field is Required",
            //     }))

            //     return;
            // }

            setIsCarInfoSection(false);
            setIsLoanInfoSection(true);
        }
        else {
            // if (loanInfo.totalSaleAmount.trim() === "") {
            //     setLoanInfoError((prev: LoanInfoErrorType) => ({
            //         ...prev,
            //         totalSaleAmountError: "This Field is Required.",
            //     }))
            //     return;
            // }
            // if (loanInfo.totalLoanAmount.trim() === "") {
            //     setLoanInfoError((prev: LoanInfoErrorType) => ({
            //         ...prev,
            //         totalLoanAmountError: "This Field is Required.",
            //     }))
            //     return;
            // }
            // if (loanInfo.loanTenure.trim() === "") {
            //     setLoanInfoError((prev: LoanInfoErrorType) => ({
            //         ...prev,
            //         loanTenureError: "This Field is Required.",
            //     }))
            //     return;
            // }
            // else if (Number(loanInfo.loanTenure.trim()) < 0) {
            //     setLoanInfoError((prev: LoanInfoErrorType) => ({
            //         ...prev,
            //         loanTenureError: "Loan Tenure must be Greater then 0.",
            //     }))
            //     return;
            // }
            // if (loanInfo.interestRate.trim() === "") {
            //     setLoanInfoError((prev: LoanInfoErrorType) => ({
            //         ...prev,
            //         interestRateError: "This Field is Required.",
            //     }))
            //     return;
            // }

            // if (loanInfo.loanStartDate.trim() === "") {
            //     setLoanInfoError((prev: LoanInfoErrorType) => ({
            //         ...prev,
            //         loanStartDateError: "This Field is Required.",
            //     }))
            //     return;
            // }
            // if (loanInfo.emiAmount.trim() === "") {
            //     setLoanInfoError((prev: LoanInfoErrorType) => ({
            //         ...prev,
            //         emiAmountError: "This Field is Required.",
            //     }))
            //     return;
            // }
            // if (loanInfo.firstEmiDate.trim() === "") {
            //     setLoanInfoError((prev: LoanInfoErrorType) => ({
            //         ...prev,
            //         firstEmiDateError: "This Field is Required.",
            //     }))
            //     return;
            // }
            // if (loanInfo.dueAmount.trim() === "") {
            //     setLoanInfoError((prev: LoanInfoErrorType) => ({
            //         ...prev,
            //         dueAmountError: "This Field is Required.",
            //     }))
            //     return;
            // }
            // if (loanInfo.additionalCharges.trim() === "") {
            //     setLoanInfoError((prev: LoanInfoErrorType) => ({
            //         ...prev,
            //         additionalChargesError: "This Field is Required.",
            //     }))
            //     return;
            // }
            // if (loanInfo.dastiAmount.trim() === "") {
            //     setLoanInfoError((prev: LoanInfoErrorType) => ({
            //         ...prev,
            //         dastiAmountError: "This Field is Required.",
            //     }))
            //     return;
            // }

            // if (loanInfo.downPayment.trim() === "") {
            //     setLoanInfoError((prev: LoanInfoErrorType) => ({
            //         ...prev,
            //         downPaymentError: "This Field is Required.",
            //     }))
            //     return;
            // }

            setIsLoanInfoSection(false);
        }
    }

    useEffect(() => {
        if (isShowPopup && existingDetails) {
            const existingCarInfo = {
                registrationNumber: existingDetails?.carInfo.registrationNumber || "",
                modelNumber: existingDetails?.carInfo.modelNumber || "",
                brandName: existingDetails?.carInfo.brandName || "",
                engineNumber: existingDetails?.carInfo.engineNumber || "",
                chassisNumber: existingDetails?.carInfo.chassisNumber || "",
                purchasedDate: existingDetails?.carInfo.purchasedDate || "",
            }

            setCarInfo(existingCarInfo);
            const existingCustomerDetails = {
                customerName: existingDetails?.customerInfo.customerName || "",
                address: existingDetails?.customerInfo.address || "",
                mobileNumber: existingDetails?.customerInfo.mobileNumber || "",
                guardianName: existingDetails?.customerInfo.guardianName || "",
                guarantorName: existingDetails?.customerInfo.guarantorName || "",
                guarantorAddress: existingDetails?.customerInfo.guarantorAddress || "",
                guarantorMobileNumber: existingDetails?.customerInfo.guarantorMobileNumber || "",
                guarantorGuardianName: existingDetails?.customerInfo.guarantorGuardianName || "",
            }

            setCustomerInfo(existingCustomerDetails);
            const existingLoanInfo = {
                totalSaleAmount: existingDetails?.loanInfo.totalSaleAmount || "",
                totalLoanAmount: existingDetails?.loanInfo.totalLoanAmount || "",
                loanStartDate: existingDetails?.loanInfo.loanStartDate || "",
                loanTenure: existingDetails?.loanInfo.loanTenure || "",
                emiAmount: existingDetails?.loanInfo.emiAmount || "",
                firstEmiDate: existingDetails?.loanInfo.firstEmiDate || "",
                dueAmount: existingDetails?.loanInfo.dueAmount || "",
                additionalCharges: existingDetails?.loanInfo.additionalCharges || "",
                dastiAmount: existingDetails?.loanInfo.dastiAmount || "",
                downPayment: existingDetails?.loanInfo.downPayment || "",
                interestRate: existingDetails?.loanInfo.interestRate || "",
            }

            setLoanInfo(existingLoanInfo);
        }
    }, [isShowPopup])

    useEffect(() => {
        const handleScreenSize = () => {
            if (window.innerWidth >= 1000) {
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
            <div className="">
                <Modal isOpen={isShowPopup} style={customStyles}>
                    {isLoading && <Loader />}
                    <div className="flex flex-col gap-3 overflow-auto">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold text-primary">{title}</h2>
                            <MdClose className="text-2xl font-bold text-red-500 cursor-pointer" onClick={() => {
                                clearState();
                                closePopup();
                            }} />
                        </div>

                        <form className="w-full" onSubmit={(e) => e.preventDefault()}>
                            {isCarInfoSection ? (<>
                                <CarDetails carInfo={carInfo} setCarInfo={setCarInfo} registrationNumberError ={registrationNumberError} setRegistrationNumberError={setRegistrationNumberError} setCarInfoChangesStatus={setCarInfoChangesStatus} />

                                <div className="flex items-center md:justify-end py-5">
                                    <button className="text-white bg-primary px-10 py-2 rounded text-lg w-full md:w-auto" onClick={() => {
                                        handleNextPhase();
                                    }}>Next</button>
                                </div>
                            </>) : isLoanInfoSection ? (
                                <>
                                    <LoanDetails loanInfo={loanInfo} setLoanInfo={setLoanInfo} setLoanInfoChangesStatus={setLoanInfoChangesStatus} />

                                    <div className="flex items-center justify-center md:justify-end py-5 gap-5 flex-col md:flex-row">
                                        <button className="text-white bg-primary px-10 py-2 rounded text-lg w-full md:w-auto" onClick={() => {
                                            setIsCarInfoSection(true);
                                            setIsLoanInfoSection(false);
                                        }}>Previous</button>

                                        <button className="text-white bg-primary px-10 py-2 rounded text-lg w-full md:w-auto" onClick={() => {
                                            handleNextPhase();
                                        }}>Next</button>
                                    </div>
                                </>
                            ) :
                                <>
                                    <CustomerDetails customerInfo={customerInfo} setCustomerInfo={setCustomerInfo} setCustomerInfoChangesStatus={setCustomerInfoChangesStatus} />

                                    <div className="flex items-center justify-center md:justify-end py-5 gap-5 flex-col md:flex-row">
                                        <button className="text-white bg-primary px-10 py-2 rounded text-lg w-full md:w-auto" onClick={() => {
                                            setIsLoanInfoSection(true);
                                        }}>Previous</button>

                                        {existingDetails ? (<button type="button" className="text-white bg-primary px-10 py-2 rounded text-lg w-full md:w-auto" onClick={(e) => {
                                            e.preventDefault();
                                            handleUpdate();
                                        }}>Update</button>) :

                                            (<button type="button" className="text-white bg-primary px-10 py-2 rounded text-lg w-full md:w-auto" onClick={(e) => {
                                                e.preventDefault();
                                                handleSubmit();
                                            }}>Submit</button>)}
                                    </div>
                                </>
                            }
                        </form>

                    </div>
                </Modal>
            </div>
        </>
    )
}

export default AddEditCarDetails;