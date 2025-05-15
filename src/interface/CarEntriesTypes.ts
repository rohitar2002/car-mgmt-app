export interface CarInfoType {
    "Registration Number": string;
    "Model Number": string;
    "Brand Name": string;
    "Engine Number": string;
    "Chassis Number": string;
    "Purchased Date": string;
}
export interface CustomerInfoType {
    "Customer Name": string;
    "Guardian name": string;
    "Address": string;
    "Mobile Number": string;
    "Guarantor Name": string;
    "Guarantor Guardian Name": string;
    "Guarantor Address": string;
    "Guarantor Mobile Number": string;
}
export interface CustomerInfoChangesStatusType {
    "Customer Name": boolean;
    "Guardian name": boolean;
    "Address": boolean;
    "Mobile Number": boolean;
    "Guarantor Name": boolean;
    "Guarantor Guardian Name": boolean;
    "Guarantor Address": boolean;
    "Guarantor Mobile Number": boolean;
}

export interface CarInfoChangesStatusType {
    "Registration Number": boolean;
    "Model Number": boolean;
    "Brand Name": boolean;
    "Engine Number": boolean;
    "Chassis Number": boolean;
    "Purchased Date": boolean;
}

export interface CarInfoErrorType {
    "Registration_Number_Error": string;
    "Model_Number_Error": string;
    "Brand_Name_Error": string;
    "Engine_Number_Error": string;
    "Chassis_Number_Error": string;
    "Purchased_Date_Error": string;
}

export interface LoanInfoType {
    "Total Loan Amount": string;
    "Loan Start Date": string;
    "Loan Tenure": string;
    "EMI Amount": string;
    "First EMI Date": string;
    "Due Amount": string;
    "Additional Charges": string;
    "Dasti Amount": string;
    "Total Paid Amount": string;
    "Interest Rate": string;
}
export interface LoanInfoChangesStatusType {
    "Total Loan Amount": boolean;
    "Loan Start Date": boolean;
    "Loan Tenure": boolean;
    "EMI Amount": boolean;
    "First EMI Date": boolean;
    "Due Amount": boolean;
    "Additional Charges": boolean;
    "Dasti Amount": boolean;
    "Total Paid Amount": boolean;
    "Interest Rate": boolean;
}
export interface LoanInfoErrorType {
    "Total_Loan_Amount_Error": string;
    "Loan_Start_Date_Error": string;
    "Loan_Tenure_Error": string;
    "EMI_Amount_Error": string;
    "First_EMI Date_Error": string;
    "Due_Amount_Error": string;
    "Additional_Charges_Error": string;
    "Dasti_Amount_Error": string;
    "Total_Paid_Amount_Error": string;
    "Interest_Rate_Error": string;
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
}

export interface EmiDetailsType {
    emiNo: string;
    emiDueDate: string;
    emiReceivedDate: string;
    emiAmount: string;
    slipNo: string;
    overdue?: string;
    emiStatus?: string;
    otherInterest: string;
}
export interface EMIHistoryDBType {
    "EMI Amount": string;
    "Due Date": string;
    "Payment Date"?: string;
    "Loan Id": string;
}