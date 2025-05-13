import { CustomerInfoChangesStatusType, CustomerInfoType } from "@/interface/CarEntriesTypes"

interface Props {
    customerInfo: CustomerInfoType;
    setCustomerInfo: React.Dispatch<React.SetStateAction<CustomerInfoType>>;
    setCustomerInfoChangesStatus?: React.Dispatch<React.SetStateAction<CustomerInfoChangesStatusType>>;
    customerInfoError: CustomerInfoType;
    setCustomerInfoError: React.Dispatch<React.SetStateAction<CustomerInfoType>>;
}

export const CustomerDetails = ({ customerInfo, setCustomerInfo, customerInfoError, setCustomerInfoError, setCustomerInfoChangesStatus }: Props) => {
    return (
        <div className="flex flex-col gap-5 my-5">
            <h2 className="text-xl font-bold text-center underline text-accent">Customer Info Section</h2>
            <div className="flex flex-col justify-center gap-3">
                <label className="font-semibold text-lg">Customer Name</label>
                <input type="text" value={customerInfo["Customer Name"]} onChange={(e) => {
                    setCustomerInfo((prev: CustomerInfoType) => ({
                        ...prev,
                        "Customer Name": e.target.value,
                    }))

                    if (setCustomerInfoChangesStatus) {
                        setCustomerInfoChangesStatus((prev: CustomerInfoChangesStatusType) => ({
                            ...prev,
                            "Customer Name": true,
                        }))
                    }
                    setCustomerInfoError((prev: CustomerInfoType) => ({
                        ...prev,
                        "Customer Name": "",
                    }))
                }} placeholder="Enter Customer Name" className="px-3 py-2 border border-primary focus:outline-none rounded" />
                {customerInfoError["Customer Name"] && <h2 className="text-lg font-bold text-red-500">{customerInfoError["Customer Name"]}</h2>}
            </div>

            <div className="flex items-center md:items-start gap-3 flex-col md:flex-row">
                <div className="flex flex-col justify-center gap-3 w-full md:w-1/2">
                    <label className="font-semibold text-lg">Address</label>
                    <input type="text" value={customerInfo["Address"]} onChange={(e) => {
                        setCustomerInfo((prev: CustomerInfoType) => ({
                            ...prev,
                            "Address": e.target.value,
                        }))

                        if (setCustomerInfoChangesStatus) {
                            setCustomerInfoChangesStatus((prev: CustomerInfoChangesStatusType) => ({
                                ...prev,
                                "Address": true,
                            }))
                        }

                        setCustomerInfoError((prev: CustomerInfoType) => ({
                            ...prev,
                            Address: "",
                        }))
                    }} placeholder="Enter Address" className="px-3 py-2 border border-primary focus:outline-none rounded" />
                    {customerInfoError["Address"] && <h2 className="text-lg font-bold text-red-500">{customerInfoError["Address"]}</h2>}
                </div>
                <div className="flex flex-col justify-center gap-3 w-full md:w-1/2">
                    <label className="font-semibold text-lg">Mobile Number</label>
                    <input type="text" value={customerInfo["Mobile Number"]} onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "");
                        setCustomerInfo((prev: CustomerInfoType) => ({
                            ...prev,
                            "Mobile Number": value,
                        }))

                        if (setCustomerInfoChangesStatus) {
                            setCustomerInfoChangesStatus((prev: CustomerInfoChangesStatusType) => ({
                                ...prev,
                                "Mobile Number": true,
                            }))
                        }

                        setCustomerInfoError((prev: CustomerInfoType) => ({
                            ...prev,
                            "Mobile Number": "",
                        }))
                    }} placeholder="Enter Mobile Number" className="px-3 py-2 border border-primary focus:outline-none rounded" />
                    {customerInfoError["Mobile Number"] && <h2 className="text-lg font-bold text-red-500">{customerInfoError["Mobile Number"]}</h2>}
                </div>
            </div>

            <div className="flex flex-col justify-center gap-3">
                <label className="font-semibold text-lg">Guardian Name</label>
                <input type="text" value={customerInfo["Guardian name"]} onChange={(e) => {
                    setCustomerInfo((prev: CustomerInfoType) => ({
                        ...prev,
                        "Guardian name": e.target.value,
                    }))

                    if (setCustomerInfoChangesStatus) {
                        setCustomerInfoChangesStatus((prev: CustomerInfoChangesStatusType) => ({
                            ...prev,
                            "Guardian name": true,
                        }))
                    }

                    setCustomerInfoError((prev: CustomerInfoType) => ({
                        ...prev,
                        "Guardian name": "",
                    }))
                }} placeholder="Enter Guardian Name" className="px-3 py-2 border border-primary focus:outline-none rounded" />
                {customerInfoError["Guardian name"] && <h2 className="text-lg font-bold text-red-500">{customerInfoError["Guardian name"]}</h2>}
            </div>

            <div className="flex flex-col justify-center gap-3">
                <label className="font-semibold text-lg">Guarantor Name</label>
                <input type="text" value={customerInfo["Guarantor Name"]} onChange={(e) => {
                    setCustomerInfo((prev: CustomerInfoType) => ({
                        ...prev,
                        "Guarantor Name": e.target.value,
                    }))

                    if (setCustomerInfoChangesStatus) {
                        setCustomerInfoChangesStatus((prev: CustomerInfoChangesStatusType) => ({
                            ...prev,
                            "Guarantor Name": true,
                        }))
                    }

                    setCustomerInfoError((prev: CustomerInfoType) => ({
                        ...prev,
                        "Guarantor Name": "",
                    }))
                }} placeholder="Enter Guarantor Name" className="px-3 py-2 border border-primary focus:outline-none rounded" />
                {customerInfoError["Guarantor Name"] && <h2 className="text-lg font-bold text-red-500">{customerInfoError["Guarantor Name"]}</h2>}
            </div>

            <div className="flex flex-col justify-center gap-3">
                <label className="font-semibold text-lg">Guarantor Address </label>
                <input type="text" value={customerInfo["Guarantor Address"]} onChange={(e) => {
                    setCustomerInfo((prev: CustomerInfoType) => ({
                        ...prev,
                        "Guarantor Address": e.target.value,
                    }))

                    if (setCustomerInfoChangesStatus) {
                        setCustomerInfoChangesStatus((prev: CustomerInfoChangesStatusType) => ({
                            ...prev,
                            "Guarantor Address": true,
                        }))
                    }

                    setCustomerInfoError((prev: CustomerInfoType) => ({
                        ...prev,
                        "Guarantor Address": "",
                    }))
                }} placeholder="Enter Guarantor Address" className="px-3 py-2 w-full border border-primary focus:outline-none rounded" />
                {customerInfoError["Guarantor Address"] && <h2 className="text-lg font-bold text-red-500">{customerInfoError["Guarantor Address"]}</h2>}
            </div>
            <div className="flex flex-col justify-center gap-3">
                <label className="font-semibold text-lg">Guarantor Mobile Number </label>
                <input type="text" value={customerInfo["Guarantor Mobile Number"]} onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    setCustomerInfo((prev: CustomerInfoType) => ({
                        ...prev,
                        "Guarantor Mobile Number": value,
                    }))

                    if (setCustomerInfoChangesStatus) {
                        setCustomerInfoChangesStatus((prev: CustomerInfoChangesStatusType) => ({
                            ...prev,
                            "Guarantor Mobile Number": true,
                        }))
                    }

                    setCustomerInfoError((prev: CustomerInfoType) => ({
                        ...prev,
                        "Guarantor Mobile Number": "",
                    }))
                }} placeholder="Enter Guarantor Mobile Number" className="px-3 py-2 w-full border border-primary focus:outline-none rounded" />
                {customerInfoError["Guarantor Mobile Number"] && <h2 className="text-lg font-bold text-red-500">{customerInfoError["Guarantor Mobile Number"]}</h2>}
            </div>
            <div className="flex flex-col justify-center gap-3">
                <label className="font-semibold text-lg">Guarantor Guardian Name </label>
                <input type="text" value={customerInfo["Guarantor Guardian Name"]} onChange={(e) => {
                    setCustomerInfo((prev: CustomerInfoType) => ({
                        ...prev,
                        "Guarantor Guardian Name": e.target.value,
                    }))

                    if (setCustomerInfoChangesStatus) {
                        setCustomerInfoChangesStatus((prev: CustomerInfoChangesStatusType) => ({
                            ...prev,
                            "Guarantor Guardian Name": true,
                        }))
                    }

                    setCustomerInfoError((prev: CustomerInfoType) => ({
                        ...prev,
                        "Guarantor Guardian Name": "",
                    }))
                }} placeholder="Enter Guarantor Guardian Name" className="px-3 py-2 w-full border border-primary focus:outline-none rounded" />
                {customerInfoError["Guarantor Guardian Name"] && <h2 className="text-lg font-bold text-red-500">{customerInfoError["Guarantor Guardian Name"]}</h2>}
            </div>
        </div>
    )
}