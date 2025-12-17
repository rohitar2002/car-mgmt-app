import { CustomerInfoChangesStatusType, CustomerInfoType } from "@/interface/CarEntriesTypes"

interface Props {
    customerInfo: CustomerInfoType;
    setCustomerInfo: React.Dispatch<React.SetStateAction<CustomerInfoType>>;
    setCustomerInfoChangesStatus?: React.Dispatch<React.SetStateAction<CustomerInfoChangesStatusType>>;
}

export const CustomerDetails = ({ customerInfo, setCustomerInfo, setCustomerInfoChangesStatus }: Props) => {
    return (
        <div className="flex flex-col gap-5 my-5">
            <h2 className="text-xl font-bold text-center underline text-accent">Customer Info Section</h2>
            <div className="flex flex-col justify-center gap-3">
                <label className="font-semibold text-lg">Customer Name</label>
                <input type="text" value={customerInfo.customerName} onChange={(e) => {
                    setCustomerInfo((prev: CustomerInfoType) => ({
                        ...prev,
                        customerName: e.target.value,
                    }))

                    if (setCustomerInfoChangesStatus) {
                        setCustomerInfoChangesStatus((prev: CustomerInfoChangesStatusType) => ({
                            ...prev,
                            customerName: true,
                        }))
                    }
                    // setCustomerInfoError((prev: CustomerInfoType) => ({
                    //     ...prev,
                    //     customerName: "",
                    // }))
                }} placeholder="Enter Customer Name" className="px-3 py-2 border border-primary focus:outline-none rounded" />
                {/* {customerInfoError.customerName && <h2 className="text-lg font-bold text-red-500">{customerInfoError.customerName}</h2>} */}
            </div>

            <div className="flex items-center md:items-start gap-3 flex-col md:flex-row">
                <div className="flex flex-col justify-center gap-3 w-full md:w-1/2">
                    <label className="font-semibold text-lg">Address</label>
                    <input type="text" value={customerInfo.address} onChange={(e) => {
                        setCustomerInfo((prev: CustomerInfoType) => ({
                            ...prev,
                            address: e.target.value,
                        }))

                        if (setCustomerInfoChangesStatus) {
                            setCustomerInfoChangesStatus((prev: CustomerInfoChangesStatusType) => ({
                                ...prev,
                                address: true,
                            }))
                        }

                        // setCustomerInfoError((prev: CustomerInfoType) => ({
                        //     ...prev,
                        //     address: "",
                        // }))
                    }} placeholder="Enter Address" className="px-3 py-2 border border-primary focus:outline-none rounded" />
                    {/* {customerInfoError.address && <h2 className="text-lg font-bold text-red-500">{customerInfoError.address}</h2>} */}
                </div>
                <div className="flex flex-col justify-center gap-3 w-full md:w-1/2">
                    <label className="font-semibold text-lg">Mobile Number</label>
                    <input type="text" value={customerInfo.mobileNumber} onChange={(e) => {
                        setCustomerInfo((prev: CustomerInfoType) => ({
                            ...prev,
                            mobileNumber: e.target.value,
                        }))

                        if (setCustomerInfoChangesStatus) {
                            setCustomerInfoChangesStatus((prev: CustomerInfoChangesStatusType) => ({
                                ...prev,
                                mobileNumber: true,
                            }))
                        }

                        // setCustomerInfoError((prev: CustomerInfoType) => ({
                        //     ...prev,
                        //     mobileNumber: "",
                        // }))
                    }} placeholder="Enter Mobile Number" className="px-3 py-2 border border-primary focus:outline-none rounded" />
                    {/* {customerInfoError.mobileNumber && <h2 className="text-lg font-bold text-red-500">{customerInfoError.mobileNumber}</h2>} */}
                </div>
            </div>

            <div className="flex flex-col justify-center gap-3">
                <label className="font-semibold text-lg">Guardian Name</label>
                <input type="text" value={customerInfo.guardianName} onChange={(e) => {
                    setCustomerInfo((prev: CustomerInfoType) => ({
                        ...prev,
                        guardianName: e.target.value,
                    }))

                    if (setCustomerInfoChangesStatus) {
                        setCustomerInfoChangesStatus((prev: CustomerInfoChangesStatusType) => ({
                            ...prev,
                            guardianName: true,
                        }))
                    }

                    // setCustomerInfoError((prev: CustomerInfoType) => ({
                    //     ...prev,
                    //     guardianName: "",
                    // }))
                }} placeholder="Enter Guardian Name" className="px-3 py-2 border border-primary focus:outline-none rounded" />
                {/* {customerInfoError.guardianName && <h2 className="text-lg font-bold text-red-500">{customerInfoError.guardianName}</h2>} */}
            </div>

            <div className="flex flex-col justify-center gap-3">
                <label className="font-semibold text-lg">Guarantor Name</label>
                <input type="text" value={customerInfo.guarantorName} onChange={(e) => {
                    setCustomerInfo((prev: CustomerInfoType) => ({
                        ...prev,
                        guarantorName: e.target.value,
                    }))

                    if (setCustomerInfoChangesStatus) {
                        setCustomerInfoChangesStatus((prev: CustomerInfoChangesStatusType) => ({
                            ...prev,
                            guarantorName: true,
                        }))
                    }

                    // setCustomerInfoError((prev: CustomerInfoType) => ({
                    //     ...prev,
                    //     guarantorName: "",
                    // }))
                }} placeholder="Enter Guarantor Name" className="px-3 py-2 border border-primary focus:outline-none rounded" />
                {/* {customerInfoError.guarantorName && <h2 className="text-lg font-bold text-red-500">{customerInfoError.guarantorName}</h2>} */}
            </div>

            <div className="flex flex-col justify-center gap-3">
                <label className="font-semibold text-lg">Guarantor Address </label>
                <input type="text" value={customerInfo.guarantorAddress} onChange={(e) => {
                    setCustomerInfo((prev: CustomerInfoType) => ({
                        ...prev,
                        guarantorAddress: e.target.value,
                    }))

                    if (setCustomerInfoChangesStatus) {
                        setCustomerInfoChangesStatus((prev: CustomerInfoChangesStatusType) => ({
                            ...prev,
                            guarantorAddress: true,
                        }))
                    }

                    // setCustomerInfoError((prev: CustomerInfoType) => ({
                    //     ...prev,
                    //     guarantorAddress: "",
                    // }))
                }} placeholder="Enter Guarantor Address" className="px-3 py-2 w-full border border-primary focus:outline-none rounded" />
                {/* {customerInfoError.guarantorAddress && <h2 className="text-lg font-bold text-red-500">{customerInfoError.guarantorAddress}</h2>} */}
            </div>
            <div className="flex flex-col justify-center gap-3">
                <label className="font-semibold text-lg">Guarantor Mobile Number </label>
                <input type="text" value={customerInfo.guarantorMobileNumber} onChange={(e) => {
                    setCustomerInfo((prev: CustomerInfoType) => ({
                        ...prev,
                        guarantorMobileNumber: e.target.value,
                    }))

                    if (setCustomerInfoChangesStatus) {
                        setCustomerInfoChangesStatus((prev: CustomerInfoChangesStatusType) => ({
                            ...prev,
                            guarantorMobileNumber: true,
                        }))
                    }

                    // setCustomerInfoError((prev: CustomerInfoType) => ({
                    //     ...prev,
                    //     guarantorMobileNumber: "",
                    // }))
                }} placeholder="Enter Guarantor Mobile Number" className="px-3 py-2 w-full border border-primary focus:outline-none rounded" />
                {/* {customerInfoError.guarantorMobileNumber && <h2 className="text-lg font-bold text-red-500">{customerInfoError.guarantorMobileNumber}</h2>} */}
            </div>
            <div className="flex flex-col justify-center gap-3">
                <label className="font-semibold text-lg">Guarantor Guardian Name </label>
                <input type="text" value={customerInfo.guarantorGuardianName} onChange={(e) => {
                    setCustomerInfo((prev: CustomerInfoType) => ({
                        ...prev,
                        guarantorGuardianName: e.target.value,
                    }))

                    if (setCustomerInfoChangesStatus) {
                        setCustomerInfoChangesStatus((prev: CustomerInfoChangesStatusType) => ({
                            ...prev,
                            guarantorGuardianName: true,
                        }))
                    }

                    // setCustomerInfoError((prev: CustomerInfoType) => ({
                    //     ...prev,
                    //     guarantorGuardianName: "",
                    // }))
                }} placeholder="Enter Guarantor Guardian Name" className="px-3 py-2 w-full border border-primary focus:outline-none rounded" />
                {/* {customerInfoError.guarantorGuardianName && <h2 className="text-lg font-bold text-red-500">{customerInfoError.guarantorGuardianName}</h2>} */}
            </div>
        </div>
    )
}