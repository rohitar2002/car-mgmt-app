import { DocumentData, WhereFilterOp } from "firebase/firestore";
import { CarDetailsType, CarDetailsWithIdType } from "./CarEntriesTypes";

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
    password: string;
}
export interface SignUpErrorType {
    userNameError: string;
    mobileError: string;
    emailError: string;
    passwordError: string;
    confirmPasswordError: string;
}
export interface LoginQueryType {
    userName: string;
    mobile: string;
    email: string;
    password: string;
    "Cars Ids": string[];
}

export interface UserDetailsType {
    "Cars ids": string[];
    email: string;
    mobile: string;
    password: string;
    userName: string;
}
export interface FirebaseContextType {
    userDetails: DocumentData | null;
    setUserDetails: React.Dispatch<React.SetStateAction<DocumentData | null>>;
    signUpUser: (data: SignUpType) => Promise<string | boolean | null>;
    loginUser: (data: LoginCredentials) => Promise<string | boolean | null>;
    signOutUser: () => Promise<boolean>;
    addCarRecord: (data: CarDetailsType) => Promise<string | boolean>;
    deleteCarRecord: (carId: string) => Promise<string | boolean>;
    getDataWithQuery: (collectionName: string, fieldName: string, operator: WhereFilterOp, value: unknown) => Promise<any>;
}