import { CarInfoChangesStatusType, CarInfoType } from "@/interface/CarEntriesTypes"

interface Props {
    carInfo: CarInfoType;
    setCarInfo: React.Dispatch<React.SetStateAction<CarInfoType>>;
    setCarInfoChangesStatus?: React.Dispatch<React.SetStateAction<CarInfoChangesStatusType>>;
    registrationNumberError: string;
    setRegistrationNumberError: React.Dispatch<React.SetStateAction<string>>;
}

export const CarDetails = ({ carInfo, setCarInfo, registrationNumberError, setRegistrationNumberError, setCarInfoChangesStatus }: Props) => {
    return (
        <div className="flex flex-col gap-5 my-5">
            <h2 className="text-xl font-bold text-center underline text-accent">Car Info Section</h2>
            <div className="flex flex-col justify-center gap-3">
                <label className="font-semibold text-lg">Registration Number</label>
                <input type="text" value={carInfo.registrationNumber} onChange={(e) => {
                    setCarInfo((prev: CarInfoType) => ({
                        ...prev,
                        registrationNumber: e.target.value,
                    }))

                    if (setCarInfoChangesStatus) {
                        setCarInfoChangesStatus((prev: CarInfoChangesStatusType) => ({
                            ...prev,
                            registrationNumber: true,
                        }))
                    }
                    setRegistrationNumberError("");
                }} placeholder="Enter Registration Number" className="px-3 py-2 border border-primary focus:outline-none rounded" />
                {registrationNumberError && <h2 className="text-lg font-bold text-red-500">{registrationNumberError}</h2>}
            </div>

            <div className="flex items-center md:items-start gap-3 flex-col md:flex-row">
                <div className="flex flex-col justify-center gap-3 w-full md:w-1/2">
                    <label className="font-semibold text-lg">Model Number</label>
                    <input type="text" value={carInfo.modelNumber} onChange={(e) => {
                        setCarInfo((prev: CarInfoType) => ({
                            ...prev,
                            modelNumber: e.target.value,
                        }))

                        if (setCarInfoChangesStatus) {
                            setCarInfoChangesStatus((prev: CarInfoChangesStatusType) => ({
                                ...prev,
                                modelNumber: true,
                            }))
                        }

                        // setCarInfoError((prev: CarInfoErrorType) => ({
                        //     ...prev,
                        //     modelNumberError: "",
                        // }))
                    }} placeholder="Enter Model Number" className="px-3 py-2 border border-primary focus:outline-none rounded" />
                    {/* {carInfoError.modelNumberError && <h2 className="text-lg font-bold text-red-500">{carInfoError.modelNumberError}</h2>} */}
                </div>
                <div className="flex flex-col justify-center gap-3 w-full md:w-1/2">
                    <label className="font-semibold text-lg">Brand Name</label>
                    <input type="text" value={carInfo.brandName} onChange={(e) => {
                        setCarInfo((prev: CarInfoType) => ({
                            ...prev,
                            brandName: e.target.value,
                        }))

                        if (setCarInfoChangesStatus) {
                            setCarInfoChangesStatus((prev: CarInfoChangesStatusType) => ({
                                ...prev,
                                brandName: true,
                            }))
                        }

                        // setCarInfoError((prev: CarInfoErrorType) => ({
                        //     ...prev,
                        //     brandNameError: "",
                        // }))
                    }} placeholder="Enter Brand Name" className="px-3 py-2 border border-primary focus:outline-none rounded" />
                    {/* {carInfoError.brandNameError && <h2 className="text-lg font-bold text-red-500">{carInfoError.brandNameError}</h2>} */}
                </div>
            </div>

            <div className="flex flex-col justify-center gap-3">
                <label className="font-semibold text-lg">Engine Number</label>
                <input type="text" value={carInfo.engineNumber} onChange={(e) => {
                    setCarInfo((prev: CarInfoType) => ({
                        ...prev,
                        engineNumber: e.target.value,
                    }))

                    if (setCarInfoChangesStatus) {
                        setCarInfoChangesStatus((prev: CarInfoChangesStatusType) => ({
                            ...prev,
                            engineNumber: true,
                        }))
                    }

                    // setCarInfoError((prev: CarInfoErrorType) => ({
                    //     ...prev,
                    //     engineNumberError: "",
                    // }))
                }} placeholder="Enter Engine Number" className="px-3 py-2 border border-primary focus:outline-none rounded" />
                {/* {carInfoError.engineNumberError && <h2 className="text-lg font-bold text-red-500">{carInfoError.engineNumberError}</h2>} */}
            </div>

            <div className="flex flex-col justify-center gap-3">
                <label className="font-semibold text-lg">Chassis Number</label>
                <input type="text" value={carInfo.chassisNumber} onChange={(e) => {
                    setCarInfo((prev: CarInfoType) => ({
                        ...prev,
                        chassisNumber: e.target.value,
                    }))

                    if (setCarInfoChangesStatus) {
                        setCarInfoChangesStatus((prev: CarInfoChangesStatusType) => ({
                            ...prev,
                            chassisNumber: true,
                        }))
                    }

                    // setCarInfoError((prev: CarInfoErrorType) => ({
                    //     ...prev,
                    //     chassisNumberError: "",
                    // }))
                }} placeholder="Enter Chassis Number" className="px-3 py-2 border border-primary focus:outline-none rounded" />
                {/* {carInfoError.chassisNumberError && <h2 className="text-lg font-bold text-red-500">{carInfoError.chassisNumberError}</h2>} */}
            </div>

            <div className="flex flex-col justify-center gap-3">
                <label className="font-semibold text-lg">Purchased Date </label>
                <input type="date" value={carInfo.purchasedDate} onChange={(e) => {
                    setCarInfo((prev: CarInfoType) => ({
                        ...prev,
                        purchasedDate: e.target.value,
                    }))

                    if (setCarInfoChangesStatus) {
                        setCarInfoChangesStatus((prev: CarInfoChangesStatusType) => ({
                            ...prev,
                            purchasedDate: true,
                        }))
                    }

                    // setCarInfoError((prev: CarInfoErrorType) => ({
                    //     ...prev,
                    //     purchasedDateError: "",
                    // }))
                }} className="px-3 py-2 w-full border border-primary focus:outline-none rounded" />
                {/* {carInfoError.purchasedDateError && <h2 className="text-lg font-bold text-red-500">{carInfoError.purchasedDateError}</h2>} */}
            </div>
        </div>
    )
}