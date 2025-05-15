import { LoanInfoType } from "@/interface/CarEntriesTypes";

interface LoanInfoViewerProps {
    loanInfo: LoanInfoType | undefined;
}

export const LoanInfoViewer = ({ loanInfo }: LoanInfoViewerProps) => {
    return (
        <section className="border-b border-gray-500 bg-white p-5">
            <h2 className="text-xl font-bold text-primary mb-5 text-center sm:text-left">Loan Information</h2>
            <div className="flex flex-col gap-3 justify-center px-2 lg:px-10">
                <div className="flex sm:items-center justify-between flex-col sm:flex-row gap-3">
                    <label className="font-bold text-lg">Total Loan Amount:</label>
                    <h2 className="text-md">{loanInfo?.["Total Loan Amount"] || "--"}</h2>
                </div>
                <div className="flex sm:items-center justify-between flex-col sm:flex-row gap-3">
                    <label className="font-bold text-lg">Loan Start Date:</label>
                    <h2 className="text-md">{loanInfo?.["Loan Start Date"] || "--"}</h2>
                </div>
                <div className="flex sm:items-center justify-between flex-col sm:flex-row gap-3">
                    <label className="font-bold text-lg">Loan Tenure:</label>
                    <h2 className="text-md">{loanInfo?.["Loan Tenure"] || "--"} Month</h2>
                </div>
                <div className="flex sm:items-center justify-between flex-col sm:flex-row gap-3">
                    <label className="font-bold text-lg">Interest Rate:</label>
                    <h2 className="text-md">{loanInfo?.["Interest Rate"] || "--"}%</h2>
                </div>
                <div className="flex sm:items-center justify-between flex-col sm:flex-row gap-3">
                    <label className="font-bold text-lg">Total paid Amount:</label>
                    <h2 className="text-md">{loanInfo?.["Total Paid Amount"] || "--"}</h2>
                </div>
                <div className="flex sm:items-center justify-between flex-col sm:flex-row gap-3">
                    <label className="font-bold text-lg">Remaining Balance:</label>
                    <h2 className="text-md">{(loanInfo && (Number(loanInfo["Total Loan Amount"]) - Number(loanInfo["Total Paid Amount"])).toString()) || "--"}</h2>
                </div>
            </div>
        </section>
    )
}