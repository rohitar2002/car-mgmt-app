export interface CarInfoType {
    registrationNumber: string;
    modelNumber: string;
    brandName: string;
    engineNumber: string;
    chassisNumber: string;
    purchasedDate: string;
}
export interface CustomerInfoType {
    customerName: string;
    permitHolderName?: string;
    guardianName: string;
    address: string;
    mobileNumber: string;
    guarantorName: string;
    guarantorGuardianName: string;
    guarantorAddress: string;
    guarantorMobileNumber: string;
}
export interface CustomerInfoChangesStatusType {
    customerName: boolean;
    guardianName: boolean;
    address: boolean;
    mobileNumber: boolean;
    guarantorName: boolean;
    guarantorGuardianName: boolean;
    guarantorAddress: boolean;
    guarantorMobileNumber: boolean;
}

export interface CarInfoChangesStatusType {
    registrationNumber: boolean;
    modelNumber: boolean;
    brandName: boolean;
    engineNumber: boolean;
    chassisNumber: boolean;
    purchasedDate: boolean;
}

export interface CarInfoErrorType {
    registrationNumberError: string;
    modelNumberError: string;
    brandNameError: string;
    engineNumberError: string;
    chassisNumberError: string;
    purchasedDateError: string;
}

export interface LoanInfoType {
    totalSaleAmount: string;
    totalLoanAmount: string;
    loanStartDate: string;
    loanTenure: string;
    emiAmount: string;
    firstEmiDate: string;
    dueAmount: string;
    additionalCharges: string;
    friendlyLoan1: string;
    friendlyLoan1Description: string;
    friendlyLoan2: string;
    friendlyLoan2Description: string;
    loandisbursementDescription: string;
    downPayment: string;
    interestRate: string;
}
export interface LoanInfoChangesStatusType {
    totalSaleAmount: boolean;
    totalLoanAmount: boolean;
    loanStartDate: boolean;
    loanTenure: boolean;
    emiAmount: boolean;
    firstEmiDate: boolean;
    dueAmount: boolean;
    additionalCharges: boolean;
    friendlyLoan1: boolean;
    friendlyLoan1Description: boolean;
    friendlyLoan2: boolean;
    friendlyLoan2Description: boolean;
    loandisbursementDescription: boolean;
    downPayment: boolean;
    interestRate: boolean;
}
export interface LoanInfoErrorType {
    totalSaleAmountError: string;
    totalLoanAmountError: string;
    loanStartDateError: string;
    loanTenureError: string;
    emiAmountError: string;
    firstEmiDateError: string;
    dueAmountError: string;
    additionalChargesError: string;
    dastiAmountError: string;
    downPaymentError: string;
    interestRateError: string;
}
export interface CarDetailsType {
    carInfo: CarInfoType;
    customerInfo: CustomerInfoType;
    loanInfo: LoanInfoType;
}
export interface CarDetailsWithIdType {
    carInfo: CarInfoType;
    customerInfo: CustomerInfoType;
    loanInfo: LoanInfoType;
    carId: string;
    loanId: string;
    customerId: string;
    permitHolder: CustomerInfoType | null;
}

export interface EmiDetailsType {
    emiNo: string;
    emiDueDate: string;
    emiReceivedDate: string;
    emiAmount: string;
    slipNo: string;
    overdue: string;
    emiStatus?: string;
    otherInterest: string;
}
export interface EMIDetailsWithIDType {
    data: EmiDetailsType;
    id: string;
}
export interface EMIContextType {
    emiHistoryDetails: EMIDetailsWithIDType[];
    setEMIHistoryDetails: React.Dispatch<React.SetStateAction<EMIDetailsWithIDType[]>>;
    existingEMIDetails: EMIDetailsWithIDType | null;
    setExistingEMIDetails: React.Dispatch<React.SetStateAction<EMIDetailsWithIDType | null>>;
    emiPopupTitle: string;
    setEMIPopupTitle: React.Dispatch<React.SetStateAction<string>>;
    showAddEMIPopup: boolean;
    setShowAddEMIPopup: React.Dispatch<React.SetStateAction<boolean>>;
    getEMIHistory: (loanId: string) => Promise<void>;
    updateEMIDetails: (emiDetails : EmiDetailsType, id: string, loanId: string) => Promise<boolean>;
    nextEMIDate: (value:string, firstDueDate: string | undefined) => string;
}