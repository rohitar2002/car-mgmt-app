import { dateToString } from "@/Helper/utils";
import { CarInfoChangesStatusType, CarInfoType } from "@/interface/CarEntriesTypes"
import { DocumentData } from "firebase/firestore";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface Props {
    carInfo: CarInfoType;
    setCarInfo: React.Dispatch<React.SetStateAction<CarInfoType>>;
    setCarInfoChangesStatus?: React.Dispatch<React.SetStateAction<CarInfoChangesStatusType>>;
    registrationNumberError: string;
    setRegistrationNumberError: React.Dispatch<React.SetStateAction<string>>;
    handleOnBlurRegistrationNumber: () => Promise<boolean | DocumentData>;
}

export const CarDetails = ({ carInfo, setCarInfo, handleOnBlurRegistrationNumber, registrationNumberError, setRegistrationNumberError, setCarInfoChangesStatus }: Props) => {
    const handleValueChange = (value: string, field: string) => {
        setCarInfo((prev: CarInfoType) => ({
            ...prev,
            [field]: value,
        }))

        if (setCarInfoChangesStatus) {
            setCarInfoChangesStatus((prev: CarInfoChangesStatusType) => ({
                ...prev,
                [field]: true,
            }))
        }
    }

    return (
        <div className="flex flex-col gap-5 my-5">
            <h2 className="text-xl font-bold text-center underline text-accent">Car Info Section</h2>
            <div className="flex flex-col justify-center gap-3">
                <label className="font-semibold text-lg">Registration Number</label>
                <input type="text" value={carInfo.registrationNumber} onChange={(e) => {
                    handleValueChange(e.target.value.toUpperCase(), "registrationNumber");
                    setRegistrationNumberError("");
                }}
                    onBlur={handleOnBlurRegistrationNumber}
                    placeholder="Enter Registration Number" className="px-3 py-2 border border-primary focus:outline-none rounded" />
                {registrationNumberError && <h2 className="text-lg font-bold text-red-500">{registrationNumberError}</h2>}
            </div>

            <div className="flex items-center md:items-start gap-3 flex-col md:flex-row">
                <div className="flex flex-col justify-center gap-3 w-full md:w-1/2">
                    <label className="font-semibold text-lg">Model Number</label>
                    <input type="text" value={carInfo.modelNumber} onChange={(e) => {
                        handleValueChange(e.target.value, "modelNumber");
                    }} placeholder="Enter Model Number" className="px-3 py-2 border border-primary focus:outline-none rounded" />
                </div>
                <div className="flex flex-col justify-center gap-3 w-full md:w-1/2">
                    <label className="font-semibold text-lg">Brand Name</label>
                    <input type="text" value={carInfo.brandName} onChange={(e) => {
                        handleValueChange(e.target.value, "brandName");
                    }} placeholder="Enter Brand Name" className="px-3 py-2 border border-primary focus:outline-none rounded" />
                </div>
            </div>

            <div className="flex flex-col justify-center gap-3">
                <label className="font-semibold text-lg">Chassis Number</label>
                <input type="text" value={carInfo.chassisNumber} onChange={(e) => {
                    handleValueChange(e.target.value, "chassisNumber");
                }} placeholder="Enter Chassis Number" className="px-3 py-2 border border-primary focus:outline-none rounded" />
            </div>

            <div className="flex flex-col justify-center gap-3">
                <label className="font-semibold text-lg">Engine Number</label>
                <input type="text" value={carInfo.engineNumber} onChange={(e) => {
                    handleValueChange(e.target.value, "engineNumber");
                }} placeholder="Enter Engine Number" className="px-3 py-2 border border-primary focus:outline-none rounded" />
            </div>

            <div className="flex flex-col justify-center gap-3">
                <label className="font-semibold text-lg">Purchased Date </label>
                <DatePicker
                    selected={carInfo.purchasedDate.trim() ? new Date(carInfo.purchasedDate) : null}
                    onChange={(date: Date | null) => {
                        handleValueChange(date ? dateToString(date) : "", "purchasedDate")
                    }}
                    dateFormat="dd-MM-yyyy"
                    placeholderText="dd-MM-yyyy"
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    scrollableMonthYearDropdown
                    className="px-3 py-2 w-full border border-primary focus:outline-none rounded"
                />
            </div>
        </div>
    )
}