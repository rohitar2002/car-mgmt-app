import { CustomerInfoType } from "@/interface/CarEntriesTypes";

interface PermitHolderViewerProps {
    permitHolder: CustomerInfoType;
}

export const PermitHolderViewer = ({ permitHolder }: PermitHolderViewerProps) => {
    return (
        <div className="flex flex-col gap-3 justify-center  px-2 lg:px-10">
            <div className="flex sm:items-center justify-between flex-col sm:flex-row gap-3" >
                <label className="font-bold text-md md:text-lg">Name:</label>
                <h2 className="text-md">{permitHolder?.permitHolderName || "--"}</h2>
            </div>
            <div className="flex sm:items-center justify-between flex-col sm:flex-row gap-3" >
                <label className="font-bold text-md md:text-lg">Address:</label>
                <h2 className="text-md">{permitHolder?.address || "--"}</h2>
            </div>
            <div className="flex sm:items-center justify-between     flex-col sm:flex-row gap-3">
                <label className="font-bold text-md md:text-lg">Mobile Number(s):</label>
                <h2 className="text-md">{permitHolder.mobileNumber || "--"}</h2>
            </div>
            <div className="flex sm:items-center justify-between flex-col sm:flex-row gap-3">
                <label className="font-bold text-md md:text-lg">Guarantor Name:</label>
                <h2 className="text-md">{permitHolder.guarantorName || "--"}</h2>
            </div>
            <div className="flex sm:items-center justify-between flex-col sm:flex-row gap-3">
                <label className="font-bold text-md md:text-lg">Guarantor Address:</label>
                <h2 className="text-md">{permitHolder.guarantorAddress || "--"}</h2>
            </div>
            <div className="flex sm:items-center justify-between flex-col sm:flex-row gap-3">
                <label className="font-bold text-md md:text-lg">Guarantor Mobile Number(s):</label>
                <h2 className="text-md">{permitHolder.guarantorMobileNumber || "--"}</h2>
            </div>
        </div>
    )
}