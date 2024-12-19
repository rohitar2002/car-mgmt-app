'use client'

import { useFirebaseContext } from "@/context/firebaseContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaUser } from "react-icons/fa"
import { toast } from "react-toastify";
import Loader from "./Loader/RotatingLines";

export const Header = () => {
    const [userName, setUserName] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const firebaseContext = useFirebaseContext();
    const router = useRouter();
  
    const handleLogout = (e: any) => {
      e.preventDefault();
      setIsLoading(true);
  
      setTimeout(async () => {
        const signOutResponse = await firebaseContext?.signOutUser();
  
        if (signOutResponse) {
          toast.success("SignOut User");
          firebaseContext?.setUserDetails(null);
          localStorage.removeItem("UsersInfo");
          localStorage.removeItem("carDetails");
          router.replace("/")
        }
        else {
          toast.error("Something Went wrong during SignOut");
        }
        setIsLoading(false);
      }, 1000)
    }
  
    useEffect(() => {
      if (firebaseContext?.userDetails) {
        setUserName(firebaseContext?.userDetails?.userName || firebaseContext?.userDetails?.email);
      }
    }, [firebaseContext?.userDetails])
    return (
        <>
            {isLoading && <Loader/>}
            <header className="bg-primary p-5">
                <div className="flex gap-8 items-center justify-end">
                    <div className="flex items-center gap-3">
                        <FaUser size={30} className="text-white" />
                        <h2 className="text-white text-lg">{userName}</h2>
                    </div>
                    <button className="border border-red-500 text-red-500 bg-white rounded px-3 py-2 text-lg font-bold" onClick={handleLogout}>Logout</button>
                </div>
            </header>
        </>
    )
}