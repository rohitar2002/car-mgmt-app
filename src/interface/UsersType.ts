import { DocumentData, QuerySnapshot, WhereFilterOp } from "firebase/firestore";
import { CarDetailsType, EmiDetailsType } from "./CarEntriesTypes";
import { OptionType } from "./CommonTypes";

export interface LoginCredentials {
    email: string;
    password: string;
}
export interface LoginErrors {
    emailError: string;
    passwordError: string;
}

export interface SignUpType {
    userName: string;
    mobile: string;
    email: string;
    countryCode: OptionType;
}
export interface SignUpErrorType {
    userNameError: string;
    mobileError: string;
    emailError: string;
    passwordError: string;
    confirmPasswordError: string;
}
export interface UserDetailsType {
    registeredCars: string[];
    email: string;
    mobile: string;
    userName: string;
}
export interface FirebaseContextType {
    userDetails: DocumentData | null;
    setUserDetails: React.Dispatch<React.SetStateAction<DocumentData | null>>;
    signUpUser: (data: SignUpType, password: string) => Promise<string | boolean | null>;
    loginUser: (data: LoginCredentials) => Promise<string | boolean | null>;
    signOutUser: () => Promise<boolean>;
    addCarRecord: (data: CarDetailsType) => Promise<string | boolean>;
    addEMIDetails: (loanId: string, data: EmiDetailsType) => Promise<string | boolean>;
    deleteCarRecord: (carId: string) => Promise<string | boolean>;
    getDataWithQuery: (collectionName: string, fieldName: string, operator: WhereFilterOp, value: unknown) => Promise<QuerySnapshot<DocumentData, DocumentData>>;
}