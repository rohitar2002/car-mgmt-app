import { CarInfoType, CarDetailsType, LoanInfoType, CarInfoErrorType, LoanInfoErrorType, CarDetailsWithIdType, CarInfoChangesStatusType, LoanInfoChangesStatusType } from "@/interface/CarEntriesTypes";
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
        width: "40%",
        height: "100%",
        border: "1px solid #ccc",
        borderRadius: "8px",
        background: "#ffffff",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        overflow: "auto",
    },
};

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
    const [loanInfo, setLoanInfo] = useState<LoanInfoType>({
        "Total Loan Amount": existingDetails?.loanInfo["Total Loan Amount"] || "",
        "Loan Start Date": existingDetails?.loanInfo["Loan Start Date"] || "",
        "Loan Tenure": existingDetails?.loanInfo["Loan Tenure"] || "",
        "EMI Amount": existingDetails?.loanInfo["EMI Amount"] || "",
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

    const [loanInfoError, setLoanInfoError] = useState<LoanInfoErrorType>({
        "Total_Loan_Amount_Error": "",
        "Loan_Start_Date_Error": "",
        "Loan_Tenure_Error": "",
        "EMI_Amount_Error": "",
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

    const [loanInfoChangesStatus, setLoanInfoChangesStatus] = useState<LoanInfoChangesStatusType>({
        "Total Loan Amount": false,
        "Loan Start Date": false,
        "Loan Tenure": false,
        "EMI Amount": false,
        "Total Paid Amount": false,
        "Interest Rate": false,
    })
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isCarInfoSection, setIsCarInfoSection] = useState<boolean>(true);
    const firebaseContext = useFirebaseContext();

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

        setLoanInfo({
            "Total Loan Amount": "",
            "Loan Start Date": "",
            "Loan Tenure": "",
            "EMI Amount": "",
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

        const queryResult = await firebaseContext?.getDataWithQuery("CarDetails", "Registration Number", "==", carInfo["Registration Number"]);
        if (!queryResult.empty) {
            const documentData = queryResult.docs[0].data();

            if (!documentData.isDeleted) {
                toast.error("Registration Number Already Exists!");
                setIsLoading(false);

                return;
            }
            else {
                try {
                    const loanQuery = await firebaseContext?.getDataWithQuery("LoanDetails", "Car Id", "==", queryResult.docs[0].id);

                    const emiQuery = await firebaseContext?.getDataWithQuery("EMIDetails", "Loan Id", "==", loanQuery.docs[0].id);

                    await deleteDoc(queryResult.docs[0].ref);
                    await deleteDoc(loanQuery.docs[0].ref);
                    await deleteDoc(emiQuery.docs[0].ref);

                    const usersQuery = await firebaseContext?.getDataWithQuery("Users", "email", "==", firebaseContext?.userDetails?.email);
                    const userData = usersQuery.docs[0].data();

                    const carIds = userData["Cars Ids"];
                    const updatedCarIds = carIds.filter((item: string) => item !== queryResult.docs[0].id);

                    await updateDoc(usersQuery.docs[0].ref, {
                        "Cars Ids": updatedCarIds,
                    })

                } catch (error) {
                    toast.error("Something Went wrong. Try Again after Some time.");
                }
            }
        }

        const newCarRecord: CarDetailsType = {
            carInfo: {
                ...carInfo,
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

                getCarDetails && getCarDetails();
            } catch (error: any) {
                toast.error(error.message);
            }
        }
        setIsLoading(false);
    }

    const handleNextPhase = () => {
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

            const existingLoanInfo = {
                "Total Loan Amount": existingDetails?.loanInfo["Total Loan Amount"] || "",
                "Loan Start Date": existingDetails?.loanInfo["Loan Start Date"] || "",
                "Loan Tenure": existingDetails?.loanInfo["Loan Tenure"] || "",
                "EMI Amount": existingDetails?.loanInfo["EMI Amount"] || "",
                "Total Paid Amount": existingDetails?.loanInfo["Total Paid Amount"] || "",
                "Interest Rate": existingDetails?.loanInfo["Interest Rate"] || "",
            }

            setLoanInfo(existingLoanInfo);
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
                                <CarDetails carInfo={carInfo} setCarInfo={setCarInfo} carInfoError={carInfoError} setCarInfoError={setCarInfoError} setCarInfoChangesStatus={setCarInfoChangesStatus} />

                                <div className="flex items-center justify-end py-5">
                                    <button className="text-white bg-primary px-10 py-2 rounded text-lg" onClick={() => {
                                        handleNextPhase();
                                    }}>Next</button>
                                </div>
                            </>) :
                                <>
                                    <LoanDetails loanInfo={loanInfo} setLoanInfo={setLoanInfo} loanInfoError={loanInfoError} setLoanInfoError={setLoanInfoError} setLoanInfoChangesStatus={setLoanInfoChangesStatus} />

                                    <div className="flex items-center justify-end py-5 gap-5">
                                        <button className="text-white bg-primary px-10 py-2 rounded text-lg" onClick={() => {
                                            setIsCarInfoSection(true);
                                        }}>Previous</button>

                                        {existingDetails ? (<button type="button" className="text-white bg-primary px-10 py-2 rounded text-lg" onClick={(e) => {
                                            e.preventDefault();
                                            handleUpdate();
                                        }}>Update</button>) :

                                            (<button type="button" className="text-white bg-primary px-10 py-2 rounded text-lg" onClick={(e) => {
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