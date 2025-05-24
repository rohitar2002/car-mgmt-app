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
        if (Number(loanInfo.interestRate) > 100) {
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
                    <label className="font-semibold text-lg">Total Sale Amount</label>
                    <input type="text" value={loanInfo.totalSaleAmount} onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "");
                        setLoanInfo((prev: LoanInfoType) => ({
                            ...prev,
                            totalSaleAmount: value,
                        }))

                        if (setLoanInfoChangesStatus) {
                            setLoanInfoChangesStatus((prev: LoanInfoChangesStatusType) => ({
                                ...prev,
                                totalSaleAmount: true,
                            }))
                        }
                        setLoanInfoError((prev: LoanInfoErrorType) => ({
                            ...prev,
                            totalSaleAmountError: "",
                        }))
                    }} placeholder="Enter total Loan Amount" className="px-3 py-2 border border-primary focus:outline-none rounded" />

                    {loanInfoError.totalSaleAmountError && <h2 className="text-lg font-bold text-red-500">{loanInfoError.totalSaleAmountError}</h2>}
                </div>
                <div className="flex flex-col justify-center gap-3">
                    <label className="font-semibold text-lg">Total Loan Amount</label>
                    <input type="text" value={loanInfo.totalLoanAmount} onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "");
                        setLoanInfo((prev: LoanInfoType) => ({
                            ...prev,
                            totalLoanAmount: value,
                        }))

                        if (setLoanInfoChangesStatus) {
                            setLoanInfoChangesStatus((prev: LoanInfoChangesStatusType) => ({
                                ...prev,
                                totalLoanAmount: true,
                            }))
                        }
                        setLoanInfoError((prev: LoanInfoErrorType) => ({
                            ...prev,
                            totalLoanAmountError: "",
                        }))
                    }} placeholder="Enter total Loan Amount" className="px-3 py-2 border border-primary focus:outline-none rounded" />

                    {loanInfoError.totalLoanAmountError && <h2 className="text-lg font-bold text-red-500">{loanInfoError.totalLoanAmountError}</h2>}
                </div>

                <div className="flex items-center md:items-start gap-3 flex-col md:flex-row">
                    <div className="flex flex-col justify-center gap-3 w-full md:w-1/2">
                        <label className="font-semibold text-lg">Loan Tenure</label>
                        <input type="text" value={loanInfo.loanTenure} onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, "");
                            setLoanInfo((prev: LoanInfoType) => ({
                                ...prev,
                                loanTenure: value,
                            }))

                            if (setLoanInfoChangesStatus) {
                                setLoanInfoChangesStatus((prev: LoanInfoChangesStatusType) => ({
                                    ...prev,
                                    loanTenure: true,
                                }))
                            }

                            setLoanInfoError((prev: LoanInfoErrorType) => ({
                                ...prev,
                                loanTenureError: "",
                            }))
                        }} placeholder="Enter Loan Tenure" className="px-3 py-2 border border-primary focus:outline-none rounded" />

                        {loanInfoError.loanTenureError && <h2 className="text-lg font-bold text-red-500">{loanInfoError.loanTenureError}</h2>}
                    </div>

                    <div className="flex flex-col justify-center gap-3 w-full md:w-1/2">
                        <label className="font-semibold text-lg">Interest Rate</label>
                        <input type="text" value={loanInfo.interestRate} onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, "");
                            setLoanInfo((prev: LoanInfoType) => ({
                                ...prev,
                                interestRate: value,
                            }))

                            if (setLoanInfoChangesStatus) {
                                setLoanInfoChangesStatus((prev: LoanInfoChangesStatusType) => ({
                                    ...prev,
                                    interestRate: true,
                                }))
                            }
                            setLoanInfoError((prev: LoanInfoErrorType) => ({
                                ...prev,
                                interestRateError: "",
                            }))
                        }}
                            onBlur={handleIntRateBlur}
                            placeholder="Enter Interest Rate" className="px-3 py-2 border border-primary focus:outline-none rounded" />

                        {loanInfoError.interestRateError && <h2 className="text-lg font-bold text-red-500">{loanInfoError.interestRateError}</h2>}
                    </div>
                </div>

                <div className="flex flex-col justify-center gap-3">
                    <label className="font-semibold text-lg">Loan Start Date</label>
                    <input type="date" value={loanInfo.loanStartDate} onChange={(e) => {
                        setLoanInfo((prev: LoanInfoType) => ({
                            ...prev,
                            loanStartDate: e.target.value,
                        }))

                        if (setLoanInfoChangesStatus) {
                            setLoanInfoChangesStatus((prev: LoanInfoChangesStatusType) => ({
                                ...prev,
                                loanStartDate: true,
                            }))
                        }

                        setLoanInfoError((prev: LoanInfoErrorType) => ({
                            ...prev,
                            loanStartDateError: "",
                        }))
                    }} className="px-3 py-2 w-full border border-primary focus:outline-none rounded" />

                    {loanInfoError.loanStartDateError && <h2 className="text-lg font-bold text-red-500">{loanInfoError.loanStartDateError}</h2>}
                </div>
                <div className="flex flex-col justify-center gap-3">
                    <label className="font-semibold text-lg">EMI Amount</label>
                    <input type="text" value={loanInfo.emiAmount} onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "");
                        setLoanInfo((prev: LoanInfoType) => ({
                            ...prev,
                            emiAmount: value,
                        }))

                        if (setLoanInfoChangesStatus) {
                            setLoanInfoChangesStatus((prev: LoanInfoChangesStatusType) => ({
                                ...prev,
                                emiAmount: true,
                            }))
                        }

                        setLoanInfoError((prev: LoanInfoErrorType) => ({
                            ...prev,
                            emiAmountError: "",
                        }))
                    }} placeholder="Enter EMI Amount" className="px-3 py-2 border border-primary focus:outline-none rounded" />

                    {loanInfoError.emiAmountError && <h2 className="text-lg font-bold text-red-500">{loanInfoError.emiAmountError}</h2>}
                </div>
                <div className="flex flex-col justify-center gap-3">
                    <label className="font-semibold text-lg">First EMI Date</label>
                    <input type="date" value={loanInfo.firstEmiDate} onChange={(e) => {
                        setLoanInfo((prev: LoanInfoType) => ({
                            ...prev,
                            firstEmiDate: e.target.value,
                        }))

                        if (setLoanInfoChangesStatus) {
                            setLoanInfoChangesStatus((prev: LoanInfoChangesStatusType) => ({
                                ...prev,
                                firstEmiDate: true,
                            }))
                        }

                        setLoanInfoError((prev: LoanInfoErrorType) => ({
                            ...prev,
                            firstEmiDateError: "",
                        }))
                    }} className="px-3 py-2 w-full border border-primary focus:outline-none rounded" />

                    {loanInfoError.firstEmiDateError && <h2 className="text-lg font-bold text-red-500">{loanInfoError.firstEmiDateError}</h2>}
                </div>

                <div className="flex flex-col justify-center gap-3">
                    <label className="font-semibold text-lg">Due Amount</label>
                    <input type="text" value={loanInfo.dueAmount} onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "");
                        setLoanInfo((prev: LoanInfoType) => ({
                            ...prev,
                            dueAmount: value,
                        }))

                        if (setLoanInfoChangesStatus) {
                            setLoanInfoChangesStatus((prev: LoanInfoChangesStatusType) => ({
                                ...prev,
                                dueAmount: true,
                            }))
                        }

                        setLoanInfoError((prev: LoanInfoErrorType) => ({
                            ...prev,
                            dueAmountError: "",
                        }))
                    }} placeholder="Enter Any Due Amount" className="px-3 py-2 w-full border border-primary focus:outline-none rounded" />

                    {loanInfoError.dueAmountError && <h2 className="text-lg font-bold text-red-500">{loanInfoError.dueAmountError}</h2>}
                </div>
                <div className="flex flex-col justify-center gap-3">
                    <label className="font-semibold text-lg">Additional Charges (Including file Charges)</label>
                    <input type="text" value={loanInfo.additionalCharges} onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "");
                        setLoanInfo((prev: LoanInfoType) => ({
                            ...prev,
                            additionalCharges: value,
                        }))

                        if (setLoanInfoChangesStatus) {
                            setLoanInfoChangesStatus((prev: LoanInfoChangesStatusType) => ({
                                ...prev,
                                additionalCharges: true,
                            }))
                        }

                        setLoanInfoError((prev: LoanInfoErrorType) => ({
                            ...prev,
                            additionalChargesError: "",
                        }))
                    }} placeholder="Enter any Additional Charges" className="px-3 py-2 w-full border border-primary focus:outline-none rounded" />

                    {loanInfoError.additionalChargesError && <h2 className="text-lg font-bold text-red-500">{loanInfoError.additionalChargesError}</h2>}
                </div>
                <div className="flex flex-col justify-center gap-3">
                    <label className="font-semibold text-lg">Dasti Amount</label>
                    <input type="text" value={loanInfo.dastiAmount} onChange={(e) => {
                        setLoanInfo((prev: LoanInfoType) => ({
                            ...prev,
                            dastiAmount: e.target.value,
                        }))

                        if (setLoanInfoChangesStatus) {
                            setLoanInfoChangesStatus((prev: LoanInfoChangesStatusType) => ({
                                ...prev,
                                dastiAmount: true,
                            }))
                        }

                        setLoanInfoError((prev: LoanInfoErrorType) => ({
                            ...prev,
                            dastiAmountError: "",
                        }))
                    }} placeholder="Enter any dasti Amount" className="px-3 py-2 w-full border border-primary focus:outline-none rounded" />

                    {loanInfoError.dastiAmountError && <h2 className="text-lg font-bold text-red-500">{loanInfoError.dastiAmountError}</h2>}
                </div>

                <div className="flex flex-col justify-center gap-3">
                    <label className="font-semibold text-lg">Down Payment</label>
                    <input type="text" value={loanInfo.downPayment} onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "");
                        setLoanInfo((prev: LoanInfoType) => ({
                            ...prev,
                            downPayment: value,
                        }))

                        if (setLoanInfoChangesStatus) {
                            setLoanInfoChangesStatus((prev: LoanInfoChangesStatusType) => ({
                                ...prev,
                                downPayment: true,
                            }))
                        }

                        setLoanInfoError((prev: LoanInfoErrorType) => ({
                            ...prev,
                            downPaymentError: "",
                        }))
                    }} placeholder="Enter Down Payment" className="px-3 py-2 border border-primary focus:outline-none rounded" />

                    {loanInfoError.downPaymentError && <h2 className="text-lg font-bold text-red-500">{loanInfoError.downPaymentError}</h2>}
                </div>
            </div>
        </>
    )
}