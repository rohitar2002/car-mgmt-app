'use client'

import { nextEMIDate } from "@/Helper/utils";
import { auth, firestore } from "@/firebase/firebase.config";
import { CarDetailsType, EmiDetailsType } from "@/interface/CarEntriesTypes";
import { FirebaseContextType, LoginCredentials, SignUpType, UserDetailsType } from "@/interface/UsersType";
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { addDoc, arrayUnion, collection, doc, DocumentData, getDoc, getDocs, query, updateDoc, where, WhereFilterOp } from "firebase/firestore";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

const signUpUser = async (data: SignUpType, password: string) => {
    try {
        const response = await createUserWithEmailAndPassword(auth, data.email, password)

        if (response?.user) {
            const { countryCode, ...passedData } = data;

            await addDoc(collection(firestore, "Users"), {
                ...passedData,
                email: passedData.email.toLowerCase(),
                mobile: countryCode.value + passedData.mobile,
                registeredCars: [],
            });
            return true;
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            return error.message;
        }
        return "Something Went Wrong!";
    }
    return null;
}

const getDataWithQuery = async (collectionName: string, fieldName: string, operator: WhereFilterOp, value: unknown) => {
    const queryForData = query(collection(firestore, collectionName), where(fieldName, operator, value))
    const queryResult = await getDocs(queryForData);

    return queryResult;
}

const signOutUser = async () => {
    try {
        await signOut(auth);
    } catch (error) {
        console.error(error);

        return false;
    }

    return true;
}
const FirebaseUtilsContext = createContext<FirebaseContextType | null>(null);

export const FireBaseProvider = ({ children }: { children: ReactNode }) => {
    const [userDetails, setUserDetails] = useState<DocumentData | null>(null);

    const loginUser = async (data: LoginCredentials) => {
        try {
            const signInResponse = await signInWithEmailAndPassword(auth, data.email, data.password);

            if (signInResponse.user) {
                const queryResult = await getDataWithQuery("Users", "email", "==", signInResponse?.user?.email);

                const documentId = queryResult.docs[0].id;
                const documentData = queryResult.docs[0].data();

                if (documentData.registeredCars.length) {
                    const registeredCars = documentData.registeredCars;

                    const activeCars = (
                        await Promise.all(
                            registeredCars.map(async (item: string) => {
                                const carDocRef = doc(firestore, "CarDetails", item);
                                const carDocument = await getDoc(carDocRef);
                                const documentSnapShot = carDocument.data();

                                // Return both the item and the boolean condition
                                return { item, include: !(documentSnapShot?.isDeleted) };
                            })
                        )
                    ).filter((result) => result.include) // Only keep those that pass the condition
                        .map((result) => result.item);

                    setUserDetails({
                        ...documentData,
                        id: documentId,
                        registeredCars: activeCars,
                    });
                }
                else {
                    setUserDetails({
                        ...documentData,
                        id: documentId,
                    });
                }

                return true;
            }

        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error("error", error.message);

                return error.message;
            }

            return "Something Went Wrong!"
        }

        return null;
    }

    const addCarRecord = async (data: CarDetailsType) => {
        try {
            const carDocRef = await addDoc(collection(firestore, "CarDetails"), data.carInfo);

            const loanDocRef = await addDoc(collection(firestore, "LoanDetails"), {
                ...data.loanInfo,
                remainingBalance: (Number(data.loanInfo.totalLoanAmount) - Number(data.loanInfo.downPayment)).toString(),
                carId: carDocRef.id,
            });

            await addDoc(collection(firestore, "EMIDetails"), {
                "loanId": loanDocRef.id,
                "emiNo": 1,
                "emiAmount": data.loanInfo.emiAmount,
                "emiDueDate": nextEMIDate(data.loanInfo.firstEmiDate),
            });

            await addDoc(collection(firestore, "CustomerDetails"), {
                ...data.customerInfo,
                carId: carDocRef.id,
            });

            const userRef = doc(firestore, "Users", userDetails?.id);
            await updateDoc(userRef, {
                registeredCars: arrayUnion(carDocRef.id),
            })

            const carIds: string[] = userDetails?.registeredCars || [];
            carIds.push(carDocRef.id);

            setUserDetails((prev: UserDetailsType) => ({
                ...prev,
                registeredCars: carIds,
            }))

        } catch (error: unknown) {
            if (error instanceof Error) {
                return error.message;
            }

            return "Something Went Wrong!";
        }

        return true;
    }

    const deleteCarRecord = async (carId: string) => {
        try {
            const carDocRef = doc(firestore, "CarDetails", carId);
            await updateDoc(carDocRef, {
                isDeleted: true,
            })

            const updatedCarIds: string[] = userDetails?.registeredCars.filter((item: string) => item != carId)
            setUserDetails((prev: UserDetailsType) => ({
                ...prev,
                registeredCars: updatedCarIds,
            }))

            return true;
        } catch (error: unknown) {
            if (error instanceof Error) {
                return error.message;
            }

            return "Something Went Wrong!";
        }
    }
    const addEMIDetails = async (loanId: string, emiDetails: EmiDetailsType) => {
        try {
            const emiDocRef = await addDoc(collection(firestore, "EMIDetails"), {
                loanId: loanId,
                ...emiDetails,
            })

            if (emiDocRef.id) {
                return true;
            }
        } catch (error) {
            if (error instanceof Error) {
                return error.message;
            }

            return "Something Went Wrong!";
        }
        return "Something Went Wrong!";
    }

    useEffect(() => {

        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user && user.uid) {
                const queryResult = await getDataWithQuery("Users", "email", "==", user.email);
                if (queryResult && !queryResult.empty) {
                    setUserDetails({
                        ...queryResult.docs[0].data(),
                    });
                }
            }
            else setUserDetails(null);
        })

        return () => {
            unsubscribe();
        }
    }, [])
    return (
        <FirebaseUtilsContext.Provider value={{ signUpUser, getDataWithQuery, loginUser, signOutUser, userDetails, addCarRecord, addEMIDetails, setUserDetails, deleteCarRecord }}>
            {children}
        </FirebaseUtilsContext.Provider>
    )
}

export const useFirebaseContext = () => {
    const firebaseContext = useContext(FirebaseUtilsContext);

    return firebaseContext;
}