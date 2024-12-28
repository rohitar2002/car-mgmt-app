'use client'

import { nextEMIDate } from "@/Constants/utils";
import { auth, firestore } from "@/firebase/firebase.config";
import { CarDetailsType } from "@/interface/CarEntriesTypes";
import { FirebaseContextType, LoginCredentials, SignUpType, UserDetailsType } from "@/interface/UsersType";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { addDoc, arrayUnion, collection, doc, DocumentData, getDoc, getDocs, query, updateDoc, where, WhereFilterOp } from "firebase/firestore";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

const signUpUser = async (data: SignUpType) => {
    try {
        const response = await createUserWithEmailAndPassword(auth, data.email, data.password)

        if (response?.user) {
            await addDoc(collection(firestore, "Users"), {
                ...data,
                email: data.email.toLowerCase(),
                "Cars Ids": [],
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


                if (documentData["Cars Ids"].length) {
                    const carIds = documentData["Cars Ids"];

                    const activeCars = (
                        await Promise.all(
                            carIds.map(async (item: string) => {
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
                        "Cars Ids": activeCars,
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
                "Remaining Balance": (Number(data.loanInfo["Total Loan Amount"]) - Number(data.loanInfo["Total Paid Amount"])).toString(),
                "Car Id": carDocRef.id,
            });

            await addDoc(collection(firestore, "EMIDetails"), {
                "Loan Id": loanDocRef.id,
                "EMI Amount": data.loanInfo["EMI Amount"],
                "Due Date": nextEMIDate(data.loanInfo["Loan Start Date"]),
            });

            const userRef = doc(firestore, "Users", userDetails?.id);
            await updateDoc(userRef, {
                "Cars Ids": arrayUnion(carDocRef.id),
            })

            const carIds: string[] = userDetails?.["Cars Ids"];
            carIds.push(carDocRef.id);

            setUserDetails((prev: UserDetailsType) => ({
                ...prev,
                "Cars Ids": carIds,
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

            const updatedCarIds: string[] = userDetails?.["Cars Ids"].filter((item: string) => item != carId)
            setUserDetails((prev: UserDetailsType) => ({
                ...prev,
                "Cars Ids": updatedCarIds,
            }))

            return true;
        } catch (error: unknown) {
            if (error instanceof Error) {
                return error.message;
            }

            return "Something Went Wrong!";
        }
    }

    useEffect(() => {
        if (userDetails) {
            localStorage.setItem("UsersInfo", JSON.stringify(userDetails));
        }
    }, [userDetails])

    useEffect(() => {
        const usersData = localStorage.getItem("UsersInfo");

        if (usersData) {
            setUserDetails(JSON.parse(usersData));
        }
    }, [])
    return (
        <FirebaseUtilsContext.Provider value={{ signUpUser, getDataWithQuery, loginUser, signOutUser, userDetails, addCarRecord, setUserDetails, deleteCarRecord }}>
            {children}
        </FirebaseUtilsContext.Provider>
    )
}

export const useFirebaseContext = () => {
    const firebaseContext = useContext(FirebaseUtilsContext);

    return firebaseContext;
}