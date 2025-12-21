'use client'

import { LoanInfoType } from "@/interface/CarEntriesTypes";
import { useState } from "react";

interface LoanInfoViewerProps {
    loanInfo: LoanInfoType | undefined;
}

export const LoanInfoViewer = ({ loanInfo }: LoanInfoViewerProps) => {
    const [isExpended, setIsExpanded] = useState<boolean>(false);

    const handleDateDisplay = (dateString: string | undefined) => {
        if (dateString && dateString.trim() !== "") {
            const date = new Date(dateString);
            return (date.toLocaleDateString()).replace(/\//g, '-');
        }
        return dateString;
    }
    return (
        <section className="border-b border-gray-500 bg-white p-5">
            <h2 className="text-xl font-bold text-primary mb-5 text-center sm:text-left">Loan Information</h2>
            <div className="flex flex-col gap-3 justify-center px-2 lg:px-10">
                <div className="flex sm:items-center justify-between flex-col sm:flex-row gap-3">
                    <label className="font-bold text-lg">Total Sale Amount:</label>
                    <h2 className="text-md">{loanInfo?.totalSaleAmount ? "₹" + loanInfo?.totalSaleAmount : "--"}</h2>
                </div>
                <div className="flex sm:items-center justify-between flex-col sm:flex-row gap-3">
                    <label className="font-bold text-lg">Total Loan Amount:</label>
                    <h2 className="text-md">{loanInfo?.totalLoanAmount ? "₹" + loanInfo?.totalLoanAmount : "--"}</h2>
                </div>
                <div className="flex sm:items-center justify-between flex-col sm:flex-row gap-3">
                    <label className="font-bold text-lg">Loan Start Date:</label>
                    <h2 className="text-md">{handleDateDisplay(loanInfo?.loanStartDate) || "--"}</h2>
                </div>
                <div className="flex sm:items-center justify-between flex-col sm:flex-row gap-3">
                    <label className="font-bold text-lg">Loan Tenure:</label>
                    <h2 className="text-md">{loanInfo?.loanTenure || "--"} Month</h2>
                </div>
                <div className="flex sm:items-center justify-between flex-col sm:flex-row gap-3">
                    <label className="font-bold text-lg">Interest Rate:</label>
                    <h2 className="text-md">{loanInfo?.interestRate || "--"}%</h2>
                </div>
                <div className="flex sm:items-center justify-between flex-col sm:flex-row gap-3">
                    <label className="font-bold text-lg">Down Payment:</label>
                    <h2 className="text-md">{loanInfo?.downPayment ? "₹" + loanInfo?.downPayment : "--"}</h2>
                </div>

                {!isExpended ? (
                    <button className="text-primary font-bold text-md inline-block mx-auto" onClick={() => setIsExpanded(true)}>
                        Show More ⬇️
                    </button>
                ) : (
                    <div className="flex flex-col gap-3 justify-center">
                        <div className="flex sm:items-center justify-between flex-col sm:flex-row gap-3">
                            <label className="font-bold text-lg">EMI Amount:</label>
                            <h2 className="text-md">{loanInfo?.emiAmount ? "₹" + loanInfo?.emiAmount : "--"}</h2>
                        </div>
                        <div className="flex sm:items-center justify-between flex-col sm:flex-row gap-3">
                            <label className="font-bold text-lg">First EMI Date:</label>
                            <h2 className="text-md">{handleDateDisplay(loanInfo?.firstEmiDate) || "--"}</h2>
                        </div>
                        <div className="flex sm:items-center justify-between flex-col sm:flex-row gap-3">
                            <label className="font-bold text-lg">Any balance Amount:</label>
                            <h2 className="text-md">{loanInfo?.dueAmount ? "₹" + loanInfo?.dueAmount : "--"}</h2>
                        </div>
                        <div className="flex sm:items-center justify-between flex-col sm:flex-row gap-3">
                            <label className="font-bold text-lg">Dasti Amount:</label>
                            <h2 className="text-md">{loanInfo?.dastiAmount ? "₹" + loanInfo?.dastiAmount : "--"}</h2>
                        </div>
                        <div className="flex sm:items-center justify-between flex-col sm:flex-row gap-3">
                            <label className="font-bold text-lg">Additional Charges:</label>
                            <h2 className="text-md">{loanInfo?.additionalCharges ? "₹" + loanInfo?.additionalCharges : "--"}</h2>
                        </div>

                        <button className="text-primary font-bold text-md inline-block mx-auto" onClick={() => setIsExpanded(false)}>
                            Show Less ⬆️
                        </button>
                    </div>
                )}
            </div>
        </section>
    )
}