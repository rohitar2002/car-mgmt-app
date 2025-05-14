import { CarInfoType, CarDetailsType, LoanInfoType, CarInfoErrorType, LoanInfoErrorType, CarDetailsWithIdType, CarInfoChangesStatusType, LoanInfoChangesStatusType, CustomerInfoType, CustomerInfoChangesStatusType } from "@/interface/CarEntriesTypes";
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
        "Registration Number": existingDetails?.carInfo["Registration Number"] || "",
        "Model Number": existingDetails?.carInfo["Model Number"] || "",
        "Brand Name": existingDetails?.carInfo["Brand Name"] || "",
        "Engine Number": existingDetails?.carInfo["Engine Number"] || "",
        "Chassis Number": existingDetails?.carInfo["Chassis Number"] || "",
        "Purchased Date": existingDetails?.carInfo["Purchased Date"] || "",
    })
    const [customerInfo, setCustomerInfo] = useState<CustomerInfoType>({
        "Customer Name": existingDetails?.customerInfo?.["Customer Name"] || "",
        "Address": existingDetails?.customerInfo?.["Address"] || "",
        "Mobile Number": existingDetails?.customerInfo?.["Mobile Number"] || "",
        "Guardian name": existingDetails?.customerInfo?.["Guardian name"] || "",
        "Guarantor Name": existingDetails?.customerInfo?.["Guarantor Name"] || "",
        "Guarantor Address": existingDetails?.customerInfo?.["Guarantor Address"] || "",
        "Guarantor Mobile Number": existingDetails?.customerInfo?.["Guarantor Mobile Number"] || "",
        "Guarantor Guardian Name": existingDetails?.customerInfo?.["Guarantor Guardian Name"] || "",
    })

    const [loanInfo, setLoanInfo] = useState<LoanInfoType>({
        "Total Loan Amount": existingDetails?.loanInfo["Total Loan Amount"] || "",
        "Loan Start Date": existingDetails?.loanInfo["Loan Start Date"] || "",
        "Loan Tenure": existingDetails?.loanInfo["Loan Tenure"] || "",
        "EMI Amount": existingDetails?.loanInfo["EMI Amount"] || "",
        "First EMI Date": existingDetails?.loanInfo["First EMI Date"] || "",
        "Due Amount": existingDetails?.loanInfo["Due Amount"] || "",
        "Additional Charges": existingDetails?.loanInfo["Additional Charges"] || "",
        "Dasti Amount": existingDetails?.loanInfo["Dasti Amount"] || "",
        "Total Paid Amount": existingDetails?.loanInfo["Total Paid Amount"] || "",
        "Interest Rate": existingDetails?.loanInfo["Interest Rate"] || "",
    })

    const [carInfoError, setCarInfoError] = useState<CarInfoErrorType>({
        "Registration_Number_Error": "",
        "Model_Number_Error": "",
        "Brand_Name_Error": "",
        "Engine_Number_Error": "",
        "Chassis_Number_Error": "",
        "Purchased_Date_Error": "",
    })
    const [customerInfoError, setCustomerInfoError] = useState<CustomerInfoType>({
        "Customer Name": "",
        "Address": "",
        "Mobile Number": "",
        "Guardian name": "",
        "Guarantor Name": "",
        "Guarantor Address": "",
        "Guarantor Mobile Number": "",
        "Guarantor Guardian Name": "",
    })

    const [loanInfoError, setLoanInfoError] = useState<LoanInfoErrorType>({
        "Total_Loan_Amount_Error": "",
        "Loan_Start_Date_Error": "",
        "Loan_Tenure_Error": "",
        "EMI_Amount_Error": "",
        "First_EMI Date_Error": "",
        "Due_Amount_Error": "",
        "Additional_Charges_Error": "",
        "Dasti_Amount_Error": "",
        "Total_Paid_Amount_Error": "",
        "Interest_Rate_Error": "",
    })

    const [carInfoChangesStatus, setCarInfoChangesStatus] = useState<CarInfoChangesStatusType>({
        "Registration Number": false,
        "Model Number": false,
        "Brand Name": false,
        "Engine Number": false,
        "Chassis Number": false,
        "Purchased Date": false,
    })
    const [customerInfoChangesStatus, setCustomerInfoChangesStatus] = useState<CustomerInfoChangesStatusType>({
        "Customer Name": false,
        "Address": false,
        "Mobile Number": false,
        "Guardian name": false,
        "Guarantor Name": false,
        "Guarantor Address": false,
        "Guarantor Mobile Number": false,
        "Guarantor Guardian Name": false,
    })

    const [loanInfoChangesStatus, setLoanInfoChangesStatus] = useState<LoanInfoChangesStatusType>({
        "Total Loan Amount": false,
        "Loan Start Date": false,
        "Loan Tenure": false,
        "EMI Amount": false,
        "First EMI Date": false,
        "Due Amount": false,
        "Additional Charges": false,
        "Dasti Amount": false,
        "Total Paid Amount": false,
        "Interest Rate": false,
    })
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [modalWidth, setModalWidth] = useState<string>("50%");
    const [isCarInfoSection, setIsCarInfoSection] = useState<boolean>(true);
    const [isCustomerInfoSection, setIsCustomerInfoSection] = useState<boolean>(true);
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
            "Registration Number": "",
            "Model Number": "",
            "Brand Name": "",
            "Engine Number": "",
            "Chassis Number": "",
            "Purchased Date": "",
        })
        setCustomerInfo({
            "Customer Name": "",
            "Address": "",
            "Mobile Number": "",
            "Guardian name": "",
            "Guarantor Name": "",
            "Guarantor Address": "",
            "Guarantor Mobile Number": "",
            "Guarantor Guardian Name": "",
        })
        setCustomerInfoError({
            "Customer Name": "",
            "Address": "",
            "Mobile Number": "",
            "Guardian name": "",
            "Guarantor Name": "",
            "Guarantor Address": "",
            "Guarantor Mobile Number": "",
            "Guarantor Guardian Name": "",
        })
        setLoanInfo({
            "Total Loan Amount": "",
            "Loan Start Date": "",
            "Loan Tenure": "",
            "EMI Amount": "",
            "First EMI Date": "",
            "Due Amount": "",
            "Additional Charges": "",
            "Dasti Amount": "",
            "Total Paid Amount": "",
            "Interest Rate": "",
        })

        setCarInfoError({
            "Registration_Number_Error": "",
            "Model_Number_Error": "",
            "Brand_Name_Error": "",
            "Engine_Number_Error": "",
            "Chassis_Number_Error": "",
            "Purchased_Date_Error": "",
        })

        setLoanInfoError({
            "Total_Loan_Amount_Error": "",
            "Loan_Start_Date_Error": "",
            "Loan_Tenure_Error": "",
            "EMI_Amount_Error": "",
            "First_EMI Date_Error": "",
            "Due_Amount_Error": "",
            "Additional_Charges_Error": "",
            "Dasti_Amount_Error": "",
            "Total_Paid_Amount_Error": "",
            "Interest_Rate_Error": "",
        })
    }
    const handleSubmit = async () => {

        if (loanInfo["Total Loan Amount"].trim() === "") {
            setLoanInfoError((prev: LoanInfoErrorType) => ({
                ...prev,
                Total_Loan_Amount_Error: "This Field is Required.",
            }))
            return;
        }
        if (loanInfo["Loan Tenure"].trim() === "") {
            setLoanInfoError((prev: LoanInfoErrorType) => ({
                ...prev,
                Loan_Tenure_Error: "This Field is Required.",
            }))
            return;
        }
        else if (Number(loanInfo["Loan Tenure"].trim()) < 0) {
            setLoanInfoError((prev: LoanInfoErrorType) => ({
                ...prev,
                Loan_Tenure_Error: "Loan Tenure must be Greater then 0.",
            }))
            return;
        }
        if (loanInfo["Interest Rate"].trim() === "") {
            setLoanInfoError((prev: LoanInfoErrorType) => ({
                ...prev,
                Interest_Rate_Error: "This Field is Required.",
            }))
            return;
        }

        if (loanInfo["Loan Start Date"].trim() === "") {
            setLoanInfoError((prev: LoanInfoErrorType) => ({
                ...prev,
                Loan_Start_Date_Error: "This Field is Required.",
            }))
            return;
        }
        if (loanInfo["EMI Amount"].trim() === "") {
            setLoanInfoError((prev: LoanInfoErrorType) => ({
                ...prev,
                EMI_Amount_Error: "This Field is Required.",
            }))
            return;
        }
        if (loanInfo["First EMI Date"].trim() === "") {
            setLoanInfoError((prev: LoanInfoErrorType) => ({
                ...prev,
                "First_EMI Date_Error": "This Field is Required.",
            }))
            return;
        }
        if (loanInfo["Due Amount"].trim() === "") {
            setLoanInfoError((prev: LoanInfoErrorType) => ({
                ...prev,
                Due_Amount_Error: "This Field is Required.",
            }))
            return;
        }
        if (loanInfo["Additional Charges"].trim() === "") {
            setLoanInfoError((prev: LoanInfoErrorType) => ({
                ...prev,
                Additional_Charges_Error: "This Field is Required.",
            }))
            return;
        }
        if (loanInfo["Dasti Amount"].trim() === "") {
            setLoanInfoError((prev: LoanInfoErrorType) => ({
                ...prev,
                Dasti_Amount_Error: "This Field is Required.",
            }))
            return;
        }

        if (loanInfo["Total Paid Amount"].trim() === "") {
            setLoanInfoError((prev: LoanInfoErrorType) => ({
                ...prev,
                Total_Paid_Amount_Error: "This Field is Required.",
            }))
            return;
        }

        setIsLoading(true);

        const queryResult = await firebaseContext?.getDataWithQuery("CarDetails", "Registration Number", "==", carInfo["Registration Number"]);
        if (queryResult && !queryResult.empty) {
            const documentData = queryResult.docs[0].data();

            if (!documentData.isDeleted) {
                toast.error("Registration Number Already Exists!");
                setIsLoading(false);

                return;
            }
            else {
                try {
                    // const customerQuery = await firebaseContext?.getDataWithQuery("CustomerDetails", "Car Id", "==", queryResult.docs[0].id);
                    const loanQuery = await firebaseContext?.getDataWithQuery("LoanDetails", "Car Id", "==", queryResult.docs[0].id);

                    const emiQuery = await firebaseContext?.getDataWithQuery("EMIDetails", "Loan Id", "==", loanQuery?.docs[0].id);

                    if (queryResult) {
                        await deleteDoc(queryResult.docs[0].ref);

                        if (loanQuery) {
                            await deleteDoc(loanQuery.docs[0].ref);
                        }

                        if (emiQuery) {
                            await deleteDoc(emiQuery.docs[0].ref);
                        }

                        const usersQuery = await firebaseContext?.getDataWithQuery("Users", "email", "==", firebaseContext?.userDetails?.email);

                        if (usersQuery) {
                            const userData = usersQuery.docs[0].data();

                            const carIds = userData["Cars Ids"];
                            const updatedCarIds = carIds.filter((item: string) => item !== queryResult.docs[0].id);

                            await updateDoc(usersQuery.docs[0].ref, {
                                "Cars Ids": updatedCarIds,
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

        if (loanInfo["Total Loan Amount"].trim() === "") {
            setLoanInfoError((prev: LoanInfoErrorType) => ({
                ...prev,
                Total_Loan_Amount_Error: "This Field is Required.",
            }))
            return;
        }
        if (loanInfo["Loan Tenure"].trim() === "") {
            setLoanInfoError((prev: LoanInfoErrorType) => ({
                ...prev,
                Loan_Tenure_Error: "This Field is Required.",
            }))
            return;
        }
        else if (Number(loanInfo["Loan Tenure"].trim()) < 0) {
            setLoanInfoError((prev: LoanInfoErrorType) => ({
                ...prev,
                Loan_Tenure_Error: "Loan Tenure must be Greater then 0.",
            }))
            return;
        }
        if (loanInfo["Interest Rate"].trim() === "") {
            setLoanInfoError((prev: LoanInfoErrorType) => ({
                ...prev,
                Interest_Rate_Error: "This Field is Required.",
            }))
            return;
        }
        else if (Number(loanInfo["Interest Rate"]) > 100) {
            setLoanInfoError((prev: LoanInfoErrorType) => ({
                ...prev,
                Interest_Rate_Error: "Interest Rate must 0 to 100.",
            }))
            return;
        }

        if (loanInfo["Loan Start Date"].trim() === "") {
            setLoanInfoError((prev: LoanInfoErrorType) => ({
                ...prev,
                Loan_Start_Date_Error: "This Field is Required.",
            }))
            return;
        }
        if (loanInfo["EMI Amount"].trim() === "") {
            setLoanInfoError((prev: LoanInfoErrorType) => ({
                ...prev,
                EMI_Amount_Error: "This Field is Required.",
            }))
            return;
        }
        if (loanInfo["Total Paid Amount"].trim() === "") {
            setLoanInfoError((prev: LoanInfoErrorType) => ({
                ...prev,
                Total_Paid_Amount_Error: "This Field is Required.",
            }))
            return;
        }

        setIsLoading(true);

        const updatedCarInfo: Partial<CarInfoType> = {};
        const updatedLoanInfo: Partial<LoanInfoType> = {};

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
            if (carInfo["Registration Number"].trim() === "") {

                setCarInfoError((prev: CarInfoErrorType) => ({
                    ...prev,
                    Registration_Number_Error: "This Field is Required",
                }))

                return;
            }
            if (carInfo["Model Number"].trim() === "") {
                setCarInfoError((prev: CarInfoErrorType) => ({
                    ...prev,
                    Model_Number_Error: "This Field is Required",
                }))

                return;
            }
            if (carInfo["Brand Name"].trim() === "") {
                setCarInfoError((prev: CarInfoErrorType) => ({
                    ...prev,
                    Brand_Name_Error: "This Field is Required",
                }))

                return;
            }
            if (carInfo["Engine Number"].trim() === "") {
                setCarInfoError((prev: CarInfoErrorType) => ({
                    ...prev,
                    Engine_Number_Error: "This Field is Required",
                }))

                return;
            }
            if (carInfo["Chassis Number"].trim() === "") {
                setCarInfoError((prev: CarInfoErrorType) => ({
                    ...prev,
                    Chassis_Number_Error: "This Field is Required",
                }))

                return;
            }
            if (carInfo["Purchased Date"].trim() === "") {
                setCarInfoError((prev: CarInfoErrorType) => ({
                    ...prev,
                    Purchased_Date_Error: "This Field is Required",
                }))

                return;
            }

            setIsCarInfoSection(false);
            setIsCustomerInfoSection(true);
        }
        else {
            if (customerInfo["Customer Name"].trim() === "") {
                setCustomerInfoError((prev: CustomerInfoType) => ({
                    ...prev,
                    "Customer Name": "This Field is Required",
                }))
                return;
            }
            if (customerInfo["Address"].trim() === "") {
                setCustomerInfoError((prev: CustomerInfoType) => ({
                    ...prev,
                    "Address": "This Field is Required",
                }))
                return;
            }
            if (customerInfo["Mobile Number"].trim() === "") {
                setCustomerInfoError((prev: CustomerInfoType) => ({
                    ...prev,
                    "Mobile Number": "This Field is Required",
                }))
                return;
            }
            if (customerInfo["Guardian name"].trim() === "") {
                setCustomerInfoError((prev: CustomerInfoType) => ({
                    ...prev,
                    "Guardian name": "This Field is Required",
                }))
                return;
            }
            if (customerInfo["Guarantor Name"].trim() === "") {
                setCustomerInfoError((prev: CustomerInfoType) => ({
                    ...prev,
                    "Guarantor Name": "This Field is Required",
                }))
                return;
            }
            if (customerInfo["Guarantor Address"].trim() === "") {
                setCustomerInfoError((prev: CustomerInfoType) => ({
                    ...prev,
                    "Guarantor Address": "This Field is Required",
                }))
                return;
            }
            if (customerInfo["Guarantor Mobile Number"].trim() === "") {
                setCustomerInfoError((prev: CustomerInfoType) => ({
                    ...prev,
                    "Guarantor Mobile Number": "This Field is Required",
                }))
                return;
            }
            if (customerInfo["Guarantor Guardian Name"].trim() === "") {
                setCustomerInfoError((prev: CustomerInfoType) => ({
                    ...prev,
                    "Guarantor Guardian Name": "This Field is Required",
                }))
                return;
            }

            setIsCustomerInfoSection(false);
        }
    }

    useEffect(() => {
        if (isShowPopup && existingDetails) {
            const existingCarInfo = {
                "Registration Number": existingDetails?.carInfo["Registration Number"] || "",
                "Model Number": existingDetails?.carInfo["Model Number"] || "",
                "Brand Name": existingDetails?.carInfo["Brand Name"] || "",
                "Engine Number": existingDetails?.carInfo["Engine Number"] || "",
                "Chassis Number": existingDetails?.carInfo["Chassis Number"] || "",
                "Purchased Date": existingDetails?.carInfo["Purchased Date"] || "",
            }

            setCarInfo(existingCarInfo);
            const existingCustomerDetails = {
                "Customer Name": existingDetails?.customerInfo?.["Customer Name"] || "",
                "Address": existingDetails?.customerInfo?.["Address"] || "",
                "Mobile Number": existingDetails?.customerInfo?.["Mobile Number"] || "",
                "Guardian name": existingDetails?.customerInfo?.["Guardian name"] || "",
                "Guarantor Name": existingDetails?.customerInfo?.["Guarantor Name"] || "",
                "Guarantor Address": existingDetails?.customerInfo?.["Guarantor Address"] || "",
                "Guarantor Mobile Number": existingDetails?.customerInfo?.["Guarantor Mobile Number"] || "",
                "Guarantor Guardian Name": existingDetails?.customerInfo?.["Guarantor Guardian Name"] || "",
            }

            setCustomerInfo(existingCustomerDetails);
            const existingLoanInfo = {
                "Total Loan Amount": existingDetails?.loanInfo["Total Loan Amount"] || "",
                "Loan Start Date": existingDetails?.loanInfo["Loan Start Date"] || "",
                "Loan Tenure": existingDetails?.loanInfo["Loan Tenure"] || "",
                "EMI Amount": existingDetails?.loanInfo["EMI Amount"] || "",
                "First EMI Date": existingDetails?.loanInfo["First EMI Date"] || "",
                "Due Amount": existingDetails?.loanInfo["Due Amount"] || "",
                "Additional Charges": existingDetails?.loanInfo["Additional Charges"] || "",
                "Dasti Amount": existingDetails?.loanInfo["Dasti Amount"] || "",
                "Total Paid Amount": existingDetails?.loanInfo["Total Paid Amount"] || "",
                "Interest Rate": existingDetails?.loanInfo["Interest Rate"] || "",
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

    useEffect(() => {
        console.log("Customer Info Changes Status Status: ", customerInfoChangesStatus);

    }, [])

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
                                <CarDetails carInfo={carInfo} setCarInfo={setCarInfo} carInfoError={carInfoError} setCarInfoError={setCarInfoError} setCarInfoChangesStatus={setCarInfoChangesStatus} />

                                <div className="flex items-center md:justify-end py-5">
                                    <button className="text-white bg-primary px-10 py-2 rounded text-lg w-full md:w-auto" onClick={() => {
                                        handleNextPhase();
                                    }}>Next</button>
                                </div>
                            </>) : isCustomerInfoSection ? (
                                <>
                                    <CustomerDetails customerInfo={customerInfo} setCustomerInfo={setCustomerInfo} customerInfoError={customerInfoError} setCustomerInfoError={setCustomerInfoError} setCustomerInfoChangesStatus={setCustomerInfoChangesStatus} />

                                    <div className="flex items-center justify-center md:justify-end py-5 gap-5 flex-col md:flex-row">
                                        <button className="text-white bg-primary px-10 py-2 rounded text-lg w-full md:w-auto" onClick={() => {
                                            setIsCarInfoSection(true);
                                        }}>Previous</button>

                                        <button className="text-white bg-primary px-10 py-2 rounded text-lg w-full md:w-auto" onClick={() => {
                                            handleNextPhase();
                                        }}>Next</button>
                                    </div>
                                </>
                            ) :
                                <>
                                    <LoanDetails loanInfo={loanInfo} setLoanInfo={setLoanInfo} loanInfoError={loanInfoError} setLoanInfoError={setLoanInfoError} setLoanInfoChangesStatus={setLoanInfoChangesStatus} />

                                    <div className="flex items-center justify-center md:justify-end py-5 gap-5 flex-col md:flex-row">
                                        <button className="text-white bg-primary px-10 py-2 rounded text-lg w-full md:w-auto" onClick={() => {
                                            setIsCustomerInfoSection(true);
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