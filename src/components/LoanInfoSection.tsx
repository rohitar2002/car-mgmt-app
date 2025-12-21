import { LoanInfoChangesStatusType, LoanInfoType } from "@/interface/CarEntriesTypes"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface Props {
    loanInfo: LoanInfoType;
    setLoanInfo: React.Dispatch<React.SetStateAction<LoanInfoType>>;
    setLoanInfoChangesStatus?: React.Dispatch<React.SetStateAction<LoanInfoChangesStatusType>>;
}

export const LoanDetails = ({ loanInfo, setLoanInfo, setLoanInfoChangesStatus }: Props) => {
    const handleValueChange = (value: string, field: string) => {
        setLoanInfo((prev: LoanInfoType) => ({
            ...prev,
            [field]: value,
        }))

        if (setLoanInfoChangesStatus) {
            setLoanInfoChangesStatus((prev: LoanInfoChangesStatusType) => ({
                ...prev,
                [field]: true,
            }))
        }
    }
    return (
        <>
            <div className="flex flex-col gap-5 my-5">
                <h2 className="text-xl font-bold text-center underline text-accent">Loan Info Section</h2>
                <div className="flex flex-col justify-center gap-3">
                    <label className="font-semibold text-lg">Total Sale Amount</label>
                    <input type="text" value={loanInfo.totalSaleAmount} onChange={(e) => {
                        handleValueChange(e.target.value, "totalSaleAmount");
                    }} placeholder="Enter total Loan Amount" className="px-3 py-2 border border-primary focus:outline-none rounded" />
                </div>
                <div className="flex flex-col justify-center gap-3">
                    <label className="font-semibold text-lg">Total Loan Amount</label>
                    <input type="text" value={loanInfo.totalLoanAmount} onChange={(e) => {
                        handleValueChange(e.target.value, "totalLoanAmount");
                    }} placeholder="Enter total Loan Amount" className="px-3 py-2 border border-primary focus:outline-none rounded" />
                </div>

                <div className="flex items-center md:items-start gap-3 flex-col md:flex-row">
                    <div className="flex flex-col justify-center gap-3 w-full md:w-1/2">
                        <label className="font-semibold text-lg">Loan Tenure</label>
                        <input type="text" value={loanInfo.loanTenure} onChange={(e) => {
                            handleValueChange(e.target.value, "loanTenure");
                        }} placeholder="Enter Loan Tenure" className="px-3 py-2 border border-primary focus:outline-none rounded" />
                    </div>

                    <div className="flex flex-col justify-center gap-3 w-full md:w-1/2">
                        <label className="font-semibold text-lg">Interest Rate</label>
                        <input type="text" value={loanInfo.interestRate} onChange={(e) => {
                            handleValueChange(e.target.value, "interestRate");
                        }} placeholder="Enter Interest Rate" className="px-3 py-2 border border-primary focus:outline-none rounded" />
                    </div>
                </div>

                <div className="flex flex-col justify-center gap-3">
                    <label className="font-semibold text-lg">Loan Start Date</label>
                    <DatePicker
                        selected={loanInfo.loanStartDate.trim() ? new Date(loanInfo.loanStartDate) : null}
                        onChange={(date: Date | null) => {
                            handleValueChange(date ? date.toISOString() : "", "loanStartDate")
                        }}
                        dateFormat="dd-MM-yyyy"
                        placeholderText="dd-MM-yyyy"
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        scrollableMonthYearDropdown
                        className="px-3 py-2 w-full border border-primary focus:outline-none rounded"
                    />
                </div>
                <div className="flex flex-col justify-center gap-3">
                    <label className="font-semibold text-lg">EMI Amount</label>
                    <input type="text" value={loanInfo.emiAmount} onChange={(e) => {
                        handleValueChange(e.target.value, "emiAmount");
                    }} placeholder="Enter EMI Amount" className="px-3 py-2 border border-primary focus:outline-none rounded" />
                </div>
                <div className="flex flex-col justify-center gap-3">
                    <label className="font-semibold text-lg">First EMI Date</label>
                    <DatePicker
                        selected={loanInfo.firstEmiDate.trim() ? new Date(loanInfo.firstEmiDate) : null}
                        onChange={(date: Date | null) => {
                            handleValueChange(date ? date.toISOString() : "", "firstEmiDate")
                        }}
                        dateFormat="dd-MM-yyyy"
                        placeholderText="dd-MM-yyyy"
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        scrollableMonthYearDropdown
                        className="px-3 py-2 w-full border border-primary focus:outline-none rounded"
                    />
                </div>

                <div className="flex flex-col justify-center gap-3">
                    <label className="font-semibold text-lg">Any balance Amount</label>
                    <input type="text" value={loanInfo.dueAmount} onChange={(e) => {
                        handleValueChange(e.target.value, "dueAmount");
                    }} placeholder="Enter Any Due Amount" className="px-3 py-2 w-full border border-primary focus:outline-none rounded" />
                </div>
                <div className="flex flex-col justify-center gap-3">
                    <label className="font-semibold text-lg">Additional Charges (Including file Charges)</label>
                    <input type="text" value={loanInfo.additionalCharges} onChange={(e) => {
                        handleValueChange(e.target.value, "additionalCharges");
                    }} placeholder="Enter any Additional Charges" className="px-3 py-2 w-full border border-primary focus:outline-none rounded" />
                </div>
                <div className="flex flex-col justify-center gap-3">
                    <label className="font-semibold text-lg">Dasti Amount</label>
                    <input type="text" value={loanInfo.dastiAmount} onChange={(e) => {
                        handleValueChange(e.target.value, "dastiAmount");
                    }} placeholder="Enter any dasti Amount" className="px-3 py-2 w-full border border-primary focus:outline-none rounded" />
                </div>

                <div className="flex flex-col justify-center gap-3">
                    <label className="font-semibold text-lg">Down Payment</label>
                    <input type="text" value={loanInfo.downPayment} onChange={(e) => {
                        handleValueChange(e.target.value, "downPayment");
                    }} placeholder="Enter Down Payment" className="px-3 py-2 border border-primary focus:outline-none rounded" />
                </div>
            </div>
        </>
    )
}