import { CustomerInfoType } from "@/interface/CarEntriesTypes"

interface CustomerInfoViewerProps {
    customerInfo: CustomerInfoType | undefined;
}

export const CustomerInfoViewer = ({ customerInfo }: CustomerInfoViewerProps) => {
    return (
        <section className="border-b border-gray-500 bg-white p-5">
            <h2 className="text-xl font-bold text-primary mb-5 text-center sm:text-left">Customer Information</h2>
            <div className="flex flex-col gap-3 justify-center px-2 lg:px-10">
                <div className="flex sm:items-center justify-between flex-col sm:flex-row gap-3">
                    <label className="font-bold text-lg">Name:</label>
                    <h2 className="text-md">{customerInfo?.customerName || "--"}</h2>
                </div>
                <div className="flex sm:items-center justify-between flex-col sm:flex-row gap-3">
                    <label className="font-bold text-lg">Address:</label>
                    <h2 className="text-md">{customerInfo?.address || "--"}</h2>
                </div>
                <div className="flex sm:items-center justify-between flex-col sm:flex-row gap-3">
                    <label className="font-bold text-lg">Mobile No.:</label>
                    <h2 className="text-md">{customerInfo?.mobileNumber || "--"}</h2>
                </div>
                <div className="flex sm:items-center justify-between flex-col sm:flex-row gap-3">
                    <label className="font-bold text-lg">Guardian Name:</label>
                    <h2 className="text-md">{customerInfo?.guardianName || "--"}</h2>
                </div>
                <div className="flex sm:items-center justify-between flex-col sm:flex-row gap-3">
                    <label className="font-bold text-lg">Guarantor Name:</label>
                    <h2 className="text-md">{customerInfo?.guarantorName || "--"}</h2>
                </div>

                <div className="flex sm:items-center justify-between flex-col sm:flex-row gap-3">
                    <label className="font-bold text-lg">Guarantor Address :</label>
                    <h2 className="text-md">{customerInfo?.guarantorAddress || "--"}</h2>
                </div>

                <div className="flex sm:items-center justify-between flex-col sm:flex-row gap-3">
                    <label className="font-bold text-lg">Guarantor Mobile No. :</label>
                    <h2 className="text-md">{customerInfo?.guarantorMobileNumber || "--"}</h2>
                </div>

                <div className="flex sm:items-center justify-between flex-col sm:flex-row gap-3">
                    <label className="font-bold text-lg">Guarantor Guardian Name :</label>
                    <h2 className="text-md">{customerInfo?.guarantorGuardianName || "--"}</h2>
                </div>
            </div>
        </section>
    )
}