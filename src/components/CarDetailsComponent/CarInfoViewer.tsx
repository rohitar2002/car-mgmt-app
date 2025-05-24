import { CarInfoType } from "@/interface/CarEntriesTypes";

interface CarInfoViewerProps {
    carInfo: CarInfoType | undefined;
}

export const CarInfoViewer = ({ carInfo }: CarInfoViewerProps) => {
    return (
        <section className="border-b border-gray-500 bg-white p-5">
            <h2 className="text-xl font-bold text-primary mb-5 text-center sm:text-left">Car Information</h2>
            <div className="flex flex-col gap-3 justify-center  px-2 lg:px-10">
                <div className="flex sm:items-center justify-between flex-col sm:flex-row gap-3" >
                    <label className="font-bold text-md md:text-lg">Registration Number:</label>
                    <h2 className="text-md">{carInfo?.registrationNumber || "--"}</h2>
                </div>
                <div className="flex sm:items-center justify-between flex-col sm:flex-row gap-3">
                    <label className="font-bold text-md md:text-lg">Car Brand:</label>
                    <h2 className="text-md">{carInfo?.brandName || "--"}</h2>
                </div>
                <div className="flex sm:items-center justify-between flex-col sm:flex-row gap-3">
                    <label className="font-bold text-md md:text-lg">Car Model:</label>
                    <h2 className="text-md">{carInfo?.modelNumber || "--"}</h2>
                </div>
                <div className="flex sm:items-center justify-between flex-col sm:flex-row gap-3">
                    <label className="font-bold text-md md:text-lg">Chassis Number:</label>
                    <h2 className="text-md">{carInfo?.chassisNumber || "--"}</h2>
                </div>
                <div className="flex sm:items-center justify-between flex-col sm:flex-row gap-3">
                    <label className="font-bold text-md md:text-lg">Engine Number:</label>
                    <h2 className="text-md">{carInfo?.engineNumber || "--"}</h2>
                </div>
                <div className="flex sm:items-center justify-between flex-col sm:flex-row gap-3">
                    <label className="font-bold text-md md:text-lg">Purchase Date:</label>
                    <h2 className="text-md">{carInfo?.purchasedDate || "--"}</h2>
                </div>
            </div>
        </section>
    )
}