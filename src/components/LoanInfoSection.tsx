import { LoanInfoChangesStatusType, LoanInfoErrorType, LoanInfoType } from "@/interface/CarEntriesTypes"

interface Props {
    loanInfo: LoanInfoType;
    setLoanInfo: React.Dispatch<React.SetStateAction<LoanInfoType>>;
    setLoanInfoChangesStatus?: React.Dispatch<React.SetStateAction<LoanInfoChangesStatusType>>;
    loanInfoError: LoanInfoErrorType;
    setLoanInfoError: React.Dispatch<React.SetStateAction<LoanInfoErrorType>>;
}

export const LoanDetails = ({ loanInfo, setLoanInfo, loanInfoError, setLoanInfoError, setLoanInfoChangesStatus }: Props) => {
    const handleIntRateBlur = () => {
        if (Number(loanInfo["Interest Rate"]) > 100) {
            setLoanInfoError((prev: LoanInfoErrorType) => ({
                ...prev,
                Interest_Rate_Error: "Interest Rate must 0 to 100.",
            }))
            return;
        }

    }
    return (
        <>
            <div className="flex flex-col gap-5 my-5">
                <h2 className="text-xl font-bold text-center underline text-accent">Loan Info Section</h2>
                <div className="flex flex-col justify-center gap-3">
                    <label className="font-semibold text-lg">Total Loan Amount</label>
                    <input type="text" value={loanInfo["Total Loan Amount"]} onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "");
                        setLoanInfo((prev: LoanInfoType) => ({
                            ...prev,
                            "Total Loan Amount": value,
                        }))

                        if (setLoanInfoChangesStatus) {
                            setLoanInfoChangesStatus((prev: LoanInfoChangesStatusType) => ({
                                ...prev,
                                "Total Loan Amount": true,
                            }))
                        }
                        setLoanInfoError((prev: LoanInfoErrorType) => ({
                            ...prev,
                            Total_Loan_Amount_Error: "",
                        }))
                    }} placeholder="Enter total Loan Amount" className="px-3 py-2 border border-primary focus:outline-none rounded" />

                    {loanInfoError.Total_Loan_Amount_Error && <h2 className="text-lg font-bold text-red-500">{loanInfoError.Total_Loan_Amount_Error}</h2>}
                </div>

                <div className="flex items-center md:items-start gap-3 flex-col md:flex-row">
                    <div className="flex flex-col justify-center gap-3 w-full md:w-1/2">
                        <label className="font-semibold text-lg">Loan Tenure</label>
                        <input type="text" value={loanInfo["Loan Tenure"]} onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, "");
                            setLoanInfo((prev: LoanInfoType) => ({
                                ...prev,
                                "Loan Tenure": value,
                            }))

                            if (setLoanInfoChangesStatus) {
                                setLoanInfoChangesStatus((prev: LoanInfoChangesStatusType) => ({
                                    ...prev,
                                    "Loan Tenure": true,
                                }))
                            }

                            setLoanInfoError((prev: LoanInfoErrorType) => ({
                                ...prev,
                                Loan_Tenure_Error: "",
                            }))
                        }} placeholder="Enter Loan Tenure" className="px-3 py-2 border border-primary focus:outline-none rounded" />

                        {loanInfoError.Loan_Tenure_Error && <h2 className="text-lg font-bold text-red-500">{loanInfoError.Loan_Tenure_Error}</h2>}
                    </div>

                    <div className="flex flex-col justify-center gap-3 w-full md:w-1/2">
                        <label className="font-semibold text-lg">Interest Rate</label>
                        <input type="text" value={loanInfo["Interest Rate"]} onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, "");
                            setLoanInfo((prev: LoanInfoType) => ({
                                ...prev,
                                "Interest Rate": value,
                            }))

                            if (setLoanInfoChangesStatus) {
                                setLoanInfoChangesStatus((prev: LoanInfoChangesStatusType) => ({
                                    ...prev,
                                    "Interest Rate": true,
                                }))
                            }
                            setLoanInfoError((prev: LoanInfoErrorType) => ({
                                ...prev,
                                Interest_Rate_Error: "",
                            }))
                        }}
                            onBlur={handleIntRateBlur}
                            placeholder="Enter Interest Rate" className="px-3 py-2 border border-primary focus:outline-none rounded" />

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

                        if (setLoanInfoChangesStatus) {
                            setLoanInfoChangesStatus((prev: LoanInfoChangesStatusType) => ({
                                ...prev,
                                "Loan Start Date": true,
                            }))
                        }

                        setLoanInfoError((prev: LoanInfoErrorType) => ({
                            ...prev,
                            Loan_Start_Date_Error: "",
                        }))
                    }} className="px-3 py-2 w-full border border-primary focus:outline-none rounded" />

                    {loanInfoError.Loan_Start_Date_Error && <h2 className="text-lg font-bold text-red-500">{loanInfoError.Loan_Start_Date_Error}</h2>}
                </div>
                <div className="flex flex-col justify-center gap-3">
                    <label className="font-semibold text-lg">EMI Amount</label>
                    <input type="text" value={loanInfo["EMI Amount"]} onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "");
                        setLoanInfo((prev: LoanInfoType) => ({
                            ...prev,
                            "EMI Amount": value,
                        }))

                        if (setLoanInfoChangesStatus) {
                            setLoanInfoChangesStatus((prev: LoanInfoChangesStatusType) => ({
                                ...prev,
                                "EMI Amount": true,
                            }))
                        }

                        setLoanInfoError((prev: LoanInfoErrorType) => ({
                            ...prev,
                            EMI_Amount_Error: "",
                        }))
                    }} placeholder="Enter EMI Amount" className="px-3 py-2 border border-primary focus:outline-none rounded" />

                    {loanInfoError.EMI_Amount_Error && <h2 className="text-lg font-bold text-red-500">{loanInfoError.EMI_Amount_Error}</h2>}
                </div>
                <div className="flex flex-col justify-center gap-3">
                    <label className="font-semibold text-lg">First EMI Date</label>
                    <input type="date" value={loanInfo["First EMI Date"]} onChange={(e) => {
                        setLoanInfo((prev: LoanInfoType) => ({
                            ...prev,
                            "First EMI Date": e.target.value,
                        }))

                        if (setLoanInfoChangesStatus) {
                            setLoanInfoChangesStatus((prev: LoanInfoChangesStatusType) => ({
                                ...prev,
                                "First EMI Date": true,
                            }))
                        }

                        setLoanInfoError((prev: LoanInfoErrorType) => ({
                            ...prev,
                            "First_EMI Date_Error": "",
                        }))
                    }} className="px-3 py-2 w-full border border-primary focus:outline-none rounded" />

                    {loanInfoError["First_EMI Date_Error"] && <h2 className="text-lg font-bold text-red-500">{loanInfoError["First_EMI Date_Error"]}</h2>}
                </div>

                <div className="flex flex-col justify-center gap-3">
                    <label className="font-semibold text-lg">Due Amount</label>
                    <input type="text" value={loanInfo["Due Amount"]} onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "");
                        setLoanInfo((prev: LoanInfoType) => ({
                            ...prev,
                            "Due Amount": value,
                        }))

                        if (setLoanInfoChangesStatus) {
                            setLoanInfoChangesStatus((prev: LoanInfoChangesStatusType) => ({
                                ...prev,
                                "Due Amount": true,
                            }))
                        }

                        setLoanInfoError((prev: LoanInfoErrorType) => ({
                            ...prev,
                            Due_Amount_Error: "",
                        }))
                    }} placeholder="Enter Any Due Amount" className="px-3 py-2 w-full border border-primary focus:outline-none rounded" />

                    {loanInfoError.Due_Amount_Error && <h2 className="text-lg font-bold text-red-500">{loanInfoError.Due_Amount_Error}</h2>}
                </div>
                <div className="flex flex-col justify-center gap-3">
                    <label className="font-semibold text-lg">Additional Charges (Including file Charges)</label>
                    <input type="text" value={loanInfo["Additional Charges"]} onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "");
                        setLoanInfo((prev: LoanInfoType) => ({
                            ...prev,
                            "Additional Charges": value,
                        }))

                        if (setLoanInfoChangesStatus) {
                            setLoanInfoChangesStatus((prev: LoanInfoChangesStatusType) => ({
                                ...prev,
                                "Additional Charges": true,
                            }))
                        }

                        setLoanInfoError((prev: LoanInfoErrorType) => ({
                            ...prev,
                            Additional_Charges_Error: "",
                        }))
                    }} placeholder="Enter any Additional Charges" className="px-3 py-2 w-full border border-primary focus:outline-none rounded" />

                    {loanInfoError.Additional_Charges_Error && <h2 className="text-lg font-bold text-red-500">{loanInfoError.Additional_Charges_Error}</h2>}
                </div>
                <div className="flex flex-col justify-center gap-3">
                    <label className="font-semibold text-lg">Dasti Amount</label>
                    <input type="text" value={loanInfo["Dasti Amount"]} onChange={(e) => {
                        setLoanInfo((prev: LoanInfoType) => ({
                            ...prev,
                            "Dasti Amount": e.target.value,
                        }))

                        if (setLoanInfoChangesStatus) {
                            setLoanInfoChangesStatus((prev: LoanInfoChangesStatusType) => ({
                                ...prev,
                                "Dasti Amount": true,
                            }))
                        }

                        setLoanInfoError((prev: LoanInfoErrorType) => ({
                            ...prev,
                            Dasti_Amount_Error: "",
                        }))
                    }} placeholder="Enter any dasti Amount" className="px-3 py-2 w-full border border-primary focus:outline-none rounded" />

                    {loanInfoError.Dasti_Amount_Error && <h2 className="text-lg font-bold text-red-500">{loanInfoError.Dasti_Amount_Error}</h2>}
                </div>

                <div className="flex flex-col justify-center gap-3">
                    <label className="font-semibold text-lg">Total Paid Amount</label>
                    <input type="text" value={loanInfo["Total Paid Amount"]} onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "");
                        setLoanInfo((prev: LoanInfoType) => ({
                            ...prev,
                            "Total Paid Amount": value,
                        }))

                        if (setLoanInfoChangesStatus) {
                            setLoanInfoChangesStatus((prev: LoanInfoChangesStatusType) => ({
                                ...prev,
                                "Total Paid Amount": true,
                            }))
                        }

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