'use client';

import { usePathname, useRouter } from "next/navigation";
import { Header } from "./Header";
import { useEffect } from "react";
import { useFirebaseContext } from "@/context/firebaseContext";

const HeaderLayout = ({ children }: { children: React.ReactNode }) => {
    const withoutHeaderPagesList = ["/", "/pages/RegisterUser"];
    const protectedRoutes = ["/pages/CarDetails", "/pages/DashBoard"];
    const firebaseContext = useFirebaseContext();
    const currentPath = usePathname();
    const router = useRouter();

    useEffect(() => {
        if (protectedRoutes.includes(currentPath) && !firebaseContext?.userDetails) {
            router.replace("/");
        }
    }, [currentPath])
    return (
        <>
            {!withoutHeaderPagesList.includes(currentPath) && <Header />}
            {children}
        </>
    );
}
export default HeaderLayout;
