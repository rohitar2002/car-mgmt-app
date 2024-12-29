import { CarInfoChangesStatusType, CarInfoErrorType, CarInfoType } from "@/interface/CarEntriesTypes"

interface Props {
    carInfo: CarInfoType;
    setCarInfo: React.Dispatch<React.SetStateAction<CarInfoType>>;
    setCarInfoChangesStatus?: React.Dispatch<React.SetStateAction<CarInfoChangesStatusType>>;
    carInfoError: CarInfoErrorType;
    setCarInfoError: React.Dispatch<React.SetStateAction<CarInfoErrorType>>;
}

export const CarDetails = ({ carInfo, setCarInfo, carInfoError, setCarInfoError, setCarInfoChangesStatus }: Props) => {
    return (
        <div className="flex flex-col gap-5 my-5">
            <h2 className="text-xl font-bold text-center underline text-accent">Car Info Section</h2>
            <div className="flex flex-col justify-center gap-3">
                <label className="font-semibold text-lg">Registration Number</label>
                <input type="text" value={carInfo["Registration Number"]} onChange={(e) => {
                    setCarInfo((prev: CarInfoType) => ({
                        ...prev,
                        "Registration Number": e.target.value,
                    }))

                    if (setCarInfoChangesStatus) {
                        setCarInfoChangesStatus((prev: CarInfoChangesStatusType) => ({
                            ...prev,
                            "Registration Number": true,
                        }))
                    }
                    setCarInfoError((prev: CarInfoErrorType) => ({
                        ...prev,
                        Registration_Number_Error: "",
                    }))
                }} placeholder="Enter Registration Number" className="px-3 py-2 border border-primary focus:outline-none rounded" />
                {carInfoError.Registration_Number_Error && <h2 className="text-lg font-bold text-red-500">{carInfoError.Registration_Number_Error}</h2>}
            </div>

            <div className="flex items-center md:items-start gap-3 flex-col md:flex-row">
                <div className="flex flex-col justify-center gap-3 w-full md:w-1/2">
                    <label className="font-semibold text-lg">Model Number</label>
                    <input type="text" value={carInfo["Model Number"]} onChange={(e) => {
                        setCarInfo((prev: CarInfoType) => ({
                            ...prev,
                            "Model Number": e.target.value,
                        }))

                        if (setCarInfoChangesStatus) {
                            setCarInfoChangesStatus((prev: CarInfoChangesStatusType) => ({
                                ...prev,
                                "Model Number": true,
                            }))
                        }

                        setCarInfoError((prev: CarInfoErrorType) => ({
                            ...prev,
                            Model_Number_Error: "",
                        }))
                    }} placeholder="Enter Model Number" className="px-3 py-2 border border-primary focus:outline-none rounded" />
                    {carInfoError.Model_Number_Error && <h2 className="text-lg font-bold text-red-500">{carInfoError.Model_Number_Error}</h2>}
                </div>
                <div className="flex flex-col justify-center gap-3 w-full md:w-1/2">
                    <label className="font-semibold text-lg">Brand Name</label>
                    <input type="text" value={carInfo["Brand Name"]} onChange={(e) => {
                        setCarInfo((prev: CarInfoType) => ({
                            ...prev,
                            "Brand Name": e.target.value,
                        }))

                        if (setCarInfoChangesStatus) {
                            setCarInfoChangesStatus((prev: CarInfoChangesStatusType) => ({
                                ...prev,
                                "Brand Name": true,
                            }))
                        }

                        setCarInfoError((prev: CarInfoErrorType) => ({
                            ...prev,
                            Brand_Name_Error: "",
                        }))
                    }} placeholder="Enter Brand Name" className="px-3 py-2 border border-primary focus:outline-none rounded" />
                    {carInfoError.Brand_Name_Error && <h2 className="text-lg font-bold text-red-500">{carInfoError.Brand_Name_Error}</h2>}
                </div>
            </div>

            <div className="flex flex-col justify-center gap-3">
                <label className="font-semibold text-lg">Engine Number</label>
                <input type="text" value={carInfo["Engine Number"]} onChange={(e) => {
                    setCarInfo((prev: CarInfoType) => ({
                        ...prev,
                        "Engine Number": e.target.value,
                    }))

                    if (setCarInfoChangesStatus) {
                        setCarInfoChangesStatus((prev: CarInfoChangesStatusType) => ({
                            ...prev,
                            "Engine Number": true,
                        }))
                    }

                    setCarInfoError((prev: CarInfoErrorType) => ({
                        ...prev,
                        Engine_Number_Error: "",
                    }))
                }} placeholder="Enter Engine Number" className="px-3 py-2 border border-primary focus:outline-none rounded" />
                {carInfoError.Engine_Number_Error && <h2 className="text-lg font-bold text-red-500">{carInfoError.Engine_Number_Error}</h2>}
            </div>

            <div className="flex flex-col justify-center gap-3">
                <label className="font-semibold text-lg">Chassis Number</label>
                <input type="text" value={carInfo["Chassis Number"]} onChange={(e) => {
                    setCarInfo((prev: CarInfoType) => ({
                        ...prev,
                        "Chassis Number": e.target.value,
                    }))

                    if (setCarInfoChangesStatus) {
                        setCarInfoChangesStatus((prev: CarInfoChangesStatusType) => ({
                            ...prev,
                            "Chassis Number": true,
                        }))
                    }

                    setCarInfoError((prev: CarInfoErrorType) => ({
                        ...prev,
                        Chassis_Number_Error: "",
                    }))
                }} placeholder="Enter Chassis Number" className="px-3 py-2 border border-primary focus:outline-none rounded" />
                {carInfoError.Chassis_Number_Error && <h2 className="text-lg font-bold text-red-500">{carInfoError.Chassis_Number_Error}</h2>}
            </div>

            <div className="flex flex-col justify-center gap-3">
                <label className="font-semibold text-lg">Purchased Date </label>
                <input type="date" value={carInfo["Purchased Date"]} onChange={(e) => {
                    setCarInfo((prev: CarInfoType) => ({
                        ...prev,
                        "Purchased Date": e.target.value,
                    }))

                    if (setCarInfoChangesStatus) {
                        setCarInfoChangesStatus((prev: CarInfoChangesStatusType) => ({
                            ...prev,
                            "Purchased Date": true,
                        }))
                    }

                    setCarInfoError((prev: CarInfoErrorType) => ({
                        ...prev,
                        Purchased_Date_Error: "",
                    }))
                }} className="px-3 py-2 border border-primary focus:outline-none rounded" />
                {carInfoError.Purchased_Date_Error && <h2 className="text-lg font-bold text-red-500">{carInfoError.Purchased_Date_Error}</h2>}
            </div>
        </div>
    )
}