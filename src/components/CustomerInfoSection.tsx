import { CustomerInfoChangesStatusType, CustomerInfoType } from "@/interface/CarEntriesTypes"

interface Props {
    customerInfo: CustomerInfoType;
    setCustomerInfo: React.Dispatch<React.SetStateAction<CustomerInfoType>>;
    setCustomerInfoChangesStatus?: React.Dispatch<React.SetStateAction<CustomerInfoChangesStatusType>>;
}

export const CustomerDetails = ({ customerInfo, setCustomerInfo, setCustomerInfoChangesStatus }: Props) => {
    const handleValueChange = (value: string, field: string) => {
        setCustomerInfo((prev: CustomerInfoType) => ({
            ...prev,
            [field]: value,
        }))

        if (setCustomerInfoChangesStatus) {
            setCustomerInfoChangesStatus((prev: CustomerInfoChangesStatusType) => ({
                ...prev,
                [field]: true,
            }))
        }
    }
    return (
        <div className="flex flex-col gap-5 my-5">
            <h2 className="text-xl font-bold text-center underline text-accent">Customer Info Section</h2>
            <div className="flex flex-col justify-center gap-3">
                <label className="font-semibold text-lg">Customer Name</label>
                <input type="text" value={customerInfo.customerName} onChange={(e) => {
                    handleValueChange(e.target.value, "customerName")
                }} placeholder="Enter Customer Name" className="px-3 py-2 border border-primary focus:outline-none rounded" />
            </div>

            <div className="flex items-center md:items-start gap-3 flex-col md:flex-row">
                <div className="flex flex-col justify-center gap-3 w-full md:w-1/2">
                    <label className="font-semibold text-lg">Address</label>
                    <input type="text" value={customerInfo.address} onChange={(e) => {
                        handleValueChange(e.target.value, "address")
                    }} placeholder="Enter Address" className="px-3 py-2 border border-primary focus:outline-none rounded" />
                </div>
                <div className="flex flex-col justify-center gap-3 w-full md:w-1/2">
                    <label className="font-semibold text-lg">Mobile Number</label>
                    <input type="text" value={customerInfo.mobileNumber} onChange={(e) => {
                        handleValueChange(e.target.value, "mobileNumber")
                    }} placeholder="Enter Mobile Number" className="px-3 py-2 border border-primary focus:outline-none rounded" />
                </div>
            </div>

            <div className="flex flex-col justify-center gap-3">
                <label className="font-semibold text-lg">Guardian Name</label>
                <input type="text" value={customerInfo.guardianName} onChange={(e) => {
                    handleValueChange(e.target.value, "guardianName")
                }} placeholder="Enter Guardian Name" className="px-3 py-2 border border-primary focus:outline-none rounded" />
            </div>

            <div className="flex flex-col justify-center gap-3">
                <label className="font-semibold text-lg">Guarantor Name</label>
                <input type="text" value={customerInfo.guarantorName} onChange={(e) => {
                    handleValueChange(e.target.value, "guarantorName")
                }} placeholder="Enter Guarantor Name" className="px-3 py-2 border border-primary focus:outline-none rounded" />
            </div>

            <div className="flex flex-col justify-center gap-3">
                <label className="font-semibold text-lg">Guarantor Address </label>
                <input type="text" value={customerInfo.guarantorAddress} onChange={(e) => {
                   handleValueChange(e.target.value, "guarantorAddress")
                }} placeholder="Enter Guarantor Address" className="px-3 py-2 w-full border border-primary focus:outline-none rounded" />
            </div>
            <div className="flex flex-col justify-center gap-3">
                <label className="font-semibold text-lg">Guarantor Mobile Number </label>
                <input type="text" value={customerInfo.guarantorMobileNumber} onChange={(e) => {
                    handleValueChange(e.target.value, "guarantorMobileNumber")
                }} placeholder="Enter Guarantor Mobile Number" className="px-3 py-2 w-full border border-primary focus:outline-none rounded" />
            </div>
            <div className="flex flex-col justify-center gap-3">
                <label className="font-semibold text-lg">Guarantor Guardian Name </label>
                <input type="text" value={customerInfo.guarantorGuardianName} onChange={(e) => {
                   handleValueChange(e.target.value, "guarantorGuardianName")
                }} placeholder="Enter Guarantor Guardian Name" className="px-3 py-2 w-full border border-primary focus:outline-none rounded" />
            </div>
        </div>
    )
}