import { LoanInfoChangesStatusType, LoanInfoErrorType, LoanInfoType } from "@/interface/CarEntriesTypes"

interface Props {
    loanInfo: LoanInfoType;
    setLoanInfo: React.Dispatch<React.SetStateAction<LoanInfoType>>;
    setLoanInfoChangesStatus?: React.Dispatch<React.SetStateAction<LoanInfoChangesStatusType>>;
    loanInfoError: LoanInfoErrorType;
    setLoanInfoError: React.Dispatch<React.SetStateAction<LoanInfoErrorType>>;
}

export const LoanDetails = ({ loanInfo, setLoanInfo, loanInfoError, setLoanInfoError, setLoanInfoChangesStatus }: Props) => {
    return (
        <>
            <div className="flex flex-col gap-5 my-5">
                <h2 className="text-xl font-bold text-center underline text-accent">Loan Info Section</h2>
                <div className="flex flex-col justify-center gap-3">
                    <label className="font-semibold text-lg">Total Loan Amount</label>
                    <input type="text" value={loanInfo["Total Loan Amount"]} onChange={(e) => {
                        setLoanInfo((prev: LoanInfoType) => ({
                            ...prev,
                            "Total Loan Amount": e.target.value,
                        }))

                        setLoanInfoChangesStatus && setLoanInfoChangesStatus((prev: LoanInfoChangesStatusType) => ({
                            ...prev,
                            "Total Loan Amount": true,
                        }))

                        setLoanInfoError((prev: LoanInfoErrorType) => ({
                            ...prev,
                            Total_Loan_Amount_Error: "",
                        }))
                    }} placeholder="Enter total Loan Amount" className="px-3 py-2 border border-primary focus:outline-none rounded" />

                    {loanInfoError.Total_Loan_Amount_Error && <h2 className="text-lg font-bold text-red-500">{loanInfoError.Total_Loan_Amount_Error}</h2>}
                </div>

                <div className="flex items-start gap-3">
                    <div className="flex flex-col justify-center gap-3 w-1/2">
                        <label className="font-semibold text-lg">Loan Tenure</label>
                        <input type="number" value={loanInfo["Loan Tenure"]} onChange={(e) => {
                            setLoanInfo((prev: LoanInfoType) => ({
                                ...prev,
                                "Loan Tenure": e.target.value,
                            }))

                            setLoanInfoChangesStatus && setLoanInfoChangesStatus((prev: LoanInfoChangesStatusType) => ({
                                ...prev,
                                "Loan Tenure": true,
                            }))

                            setLoanInfoError((prev: LoanInfoErrorType) => ({
                                ...prev,
                                Loan_Tenure_Error: "",
                            }))
                        }} placeholder="Enter Loan Tenure" className="px-3 py-2 border border-primary focus:outline-none rounded" />

                        {loanInfoError.Loan_Tenure_Error && <h2 className="text-lg font-bold text-red-500">{loanInfoError.Loan_Tenure_Error}</h2>}
                    </div>

                    <div className="flex flex-col justify-center gap-3 w-1/2">
                        <label className="font-semibold text-lg">Interest Rate</label>
                        <input type="number" value={loanInfo["Interest Rate"]} onChange={(e) => {
                            setLoanInfo((prev: LoanInfoType) => ({
                                ...prev,
                                "Interest Rate": e.target.value,
                            }))

                            setLoanInfoChangesStatus && setLoanInfoChangesStatus((prev: LoanInfoChangesStatusType) => ({
                                ...prev,
                                "Interest Rate": true,
                            }))

                            setLoanInfoError((prev: LoanInfoErrorType) => ({
                                ...prev,
                                Interest_Rate_Error: "",
                            }))
                        }} placeholder="Enter Interest Rate" className="px-3 py-2 border border-primary focus:outline-none rounded" />

                        {loanInfoError.Interest_Rate_Error && <h2 className="text-lg font-bold text-red-500">{loanInfoError.Interest_Rate_Error}</h2>}
                    </div>
                </div>

                <div className="flex flex-col justify-center gap-3">
                    <label className="font-semibold text-lg">Loan Start Date</label>
                    <input type="date" value={loanInfo["Loan Start Date"]} onChange={(e) => {
                        setLoanInfo((prev: LoanInfoType) => ({
                            ...prev,
                            "Loan Start Date": e.target.value,
                        }))

                        setLoanInfoChangesStatus && setLoanInfoChangesStatus((prev: LoanInfoChangesStatusType) => ({
                            ...prev,
                            "Loan Start Date": true,
                        }))

                        setLoanInfoError((prev: LoanInfoErrorType) => ({
                            ...prev,
                            Loan_Start_Date_Error: "",
                        }))
                    }} className="px-3 py-2 border border-primary focus:outline-none rounded" />

                    {loanInfoError.Loan_Start_Date_Error && <h2 className="text-lg font-bold text-red-500">{loanInfoError.Loan_Start_Date_Error}</h2>}
                </div>

                <div className="flex flex-col justify-center gap-3">
                    <label className="font-semibold text-lg">EMI Amount</label>
                    <input type="text" value={loanInfo["EMI Amount"]} onChange={(e) => {
                        setLoanInfo((prev: LoanInfoType) => ({
                            ...prev,
                            "EMI Amount": e.target.value,
                        }))

                        setLoanInfoChangesStatus && setLoanInfoChangesStatus((prev: LoanInfoChangesStatusType) => ({
                            ...prev,
                            "EMI Amount": true,
                        }))

                        setLoanInfoError((prev: LoanInfoErrorType) => ({
                            ...prev,
                            EMI_Amount_Error: "",
                        }))
                    }} placeholder="Enter EMI Amount" className="px-3 py-2 border border-primary focus:outline-none rounded" />

                    {loanInfoError.EMI_Amount_Error && <h2 className="text-lg font-bold text-red-500">{loanInfoError.EMI_Amount_Error}</h2>}
                </div>

                <div className="flex flex-col justify-center gap-3">
                    <label className="font-semibold text-lg">Total Paid Amount</label>
                    <input type="text" value={loanInfo["Total Paid Amount"]} onChange={(e) => {
                        setLoanInfo((prev: LoanInfoType) => ({
                            ...prev,
                            "Total Paid Amount": e.target.value,
                        }))

                        setLoanInfoChangesStatus && setLoanInfoChangesStatus((prev: LoanInfoChangesStatusType) => ({
                            ...prev,
                            "Total Paid Amount": true,
                        }))

                        setLoanInfoError((prev: LoanInfoErrorType) => ({
                            ...prev,
                            Total_Paid_Amount_Error: "",
                        }))
                    }} placeholder="Enter total paid Amount" className="px-3 py-2 border border-primary focus:outline-none rounded" />

                    {loanInfoError.Total_Paid_Amount_Error && <h2 className="text-lg font-bold text-red-500">{loanInfoError.Total_Paid_Amount_Error}</h2>}
                </div>
            </div>
        </>
    )
}