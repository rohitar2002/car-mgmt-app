'use client'

import { SignUpErrorType, SignUpType } from "@/interface/UsersType";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa6";
import Link from "next/link";
import { useEffect, useState } from "react"
import { useFirebaseContext } from "@/context/firebaseContext";
import { toast } from "react-toastify";
import Loader from "@/components/Loader/RotatingLines";
import UserConfirmMeaasge from "@/components/popup/UserConfirmPopup";
import { emailRegex, frequentlyUsedCountryCodes } from "@/Helper/constants";
import Select, { SingleValue } from "react-select"
import { OptionType } from "@/interface/CommonTypes";

const RegisterUser = () => {
    const [signUpData, setSignUpData] = useState<SignUpType>({
        userName: "",
        mobile: "",
        email: "",
        countryCode: frequentlyUsedCountryCodes[1],
    })

    const [signUpErrors, setSignUpErrors] = useState<SignUpErrorType>({
        userNameError: "",
        mobileError: "",
        emailError: "",
        passwordError: "",
        confirmPasswordError: "",
    })
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [showConfirm, setShowConfirm] = useState<boolean>(false);
    const [passwordInput, setPasswordInput] = useState<boolean>(true);
    const [confirmPasswordInput, setConfirmPasswordInput] = useState<boolean>(true);
    const firebaseResponse = useFirebaseContext();

    const handleCountryCodeChange = (select: SingleValue<OptionType>) => {
        setSignUpData((prev: SignUpType) => ({
            ...prev,
            countryCode: select as OptionType,
        }))
    }
    const handleMobileBlur = () => {
        if (signUpData.mobile.length < 10) {
            setSignUpErrors((prev: SignUpErrorType) => ({
                ...prev,
                mobileError: "Mobile Number Must contains atleast 10 digits.",
            }))
            return;
        }
    }
    const handleEmailBlur = () => {
        if (!emailRegex.test(signUpData.email)) {
            setSignUpErrors((prev: SignUpErrorType) => ({
                ...prev,
                emailError: "Email is invalid",
            }))
            return;
        }
    }
    const handleRegister = async () => {

        if (signUpData.userName.trim() === "") {
            setSignUpErrors((prev: SignUpErrorType) => ({
                ...prev,
                userNameError: "This Field is required",
            }))
            return;
        }
        if (signUpData.mobile.trim() === "") {
            setSignUpErrors((prev: SignUpErrorType) => ({
                ...prev,
                mobileError: "This Field is required",
            }))
            return;
        }

        if (signUpData.email.trim() === "") {
            setSignUpErrors((prev: SignUpErrorType) => ({
                ...prev,
                emailError: "This Field is required",
            }))
            return;
        }

        if (password.trim() === "") {
            setSignUpErrors((prev: SignUpErrorType) => ({
                ...prev,
                passwordError: "This Field is required",
            }))
            return;
        }
        else if (password.length < 6 || password.length > 128) {
            setSignUpErrors((prev: SignUpErrorType) => ({
                ...prev,
                passwordError: "Password must contains from 6 to 128 Characters",
            }))
            return;
        }
        if (confirmPassword === "") {
            setSignUpErrors((prev: SignUpErrorType) => ({
                ...prev,
                confirmPasswordError: "This Field is required",
            }))
            return;
        }
        else if (confirmPassword !== password) {
            setSignUpErrors((prev: SignUpErrorType) => ({
                ...prev,
                confirmPasswordError: "Password & ConfirmPassword must be match",
            }))
            return;
        }

        setIsLoading(true);
        const mobileQueryResult = await firebaseResponse?.getDataWithQuery("Users", "mobile", "==", signUpData?.mobile);

        if (mobileQueryResult && !mobileQueryResult.empty) {
            toast.error("Mobile Number Already exists with Another User.");
            setSignUpErrors((prev: SignUpErrorType) => ({
                ...prev,
                mobileError: "Please Change Your Mobile Number!"
            }))
        }
        else {
            const userCreationResponse = await firebaseResponse?.signUpUser(signUpData, password);
            if (typeof userCreationResponse === "boolean") {
                setShowConfirm(true);
                setSignUpData({
                    userName: "",
                    mobile: "",
                    email: "",
                    countryCode: frequentlyUsedCountryCodes[1],
                })
                setPassword("");
                setConfirmPassword("");
            }
            else if (userCreationResponse === null) {
                toast.error("Something Went Wrong");
            }
            else {
                toast.error(userCreationResponse);
            }
        }
        setIsLoading(false);
    }

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            handleRegister();
        }
    }
    useEffect(() => {
        if (showConfirm) {
            document.body.style.display = "fixed";
            document.body.style.overflow = "hidden";
        }
        else {
            document.body.style.display = "relative";
            document.body.style.overflow = "auto";
        }

        return () => {
            document.body.style.display = "relative";
            document.body.style.overflow = "auto";
        }
    }, [showConfirm])
    return (
        <>
            {isLoading && <Loader />}
            <UserConfirmMeaasge isShowPopup={showConfirm} closePopup={() => {
                setShowConfirm(false);
            }} />

            <div className="flex flex-col justify-center items-center overflow-auto">
                {!showConfirm && (<div className="px-5 py-10 w-full lg:w-1/2">
                    <div className="text-xl text-center md:text-2xl text-primary font-bold py-10 underline">Car Finance Management App!</div>
                    <div className="p-5 md:p-10 rounded-lg flex flex-col gap-10 border border-primary">
                        <h2 className="text-lg text-center md:text-2xl text-primary font-bold underline">Register New User</h2>
                        <form className="flex flex-col justify-center gap-5">
                            <div className="flex flex-col justify-center gap-3">
                                <label className="text-lg font-semibold">UserName:</label>
                                <input type="text" placeholder="Enter UserName" className="px-3 py-2 border border-primary focus:outline-none rounded" value={signUpData.userName} onChange={(e) => {
                                    setSignUpData((prev: SignUpType) => ({
                                        ...prev,
                                        userName: e.target.value,
                                    }))

                                    setSignUpErrors((prev: SignUpErrorType) => ({
                                        ...prev,
                                        userNameError: "",
                                    }))
                                }} />
                                {signUpErrors.userNameError && <h2 className="text-lg text-error font-bold">{signUpErrors.userNameError}</h2>}
                            </div>

                            <div className="flex flex-col justify-center gap-3">
                                <label className="text-lg font-semibold">Mobile number :</label>
                                <div className="flex items-center md:items-start justify-center gap-3 flex-col md:flex-row">
                                    <Select instanceId="country-code" value={signUpData.countryCode} options={frequentlyUsedCountryCodes} onChange={handleCountryCodeChange} className="w-full md:w-4/12 border border-primary rounded focus:outline-none" />

                                    <div className="flex flex-col gap-3 w-full md:w-8/12">
                                        <input type="text" placeholder="Enter Mobile number" className="px-3 py-2 border border-primary focus:outline-none rounded w-full" value={signUpData.mobile} onChange={(e) => {
                                            const value = e.target.value.replace(/\D/g, "");
                                            setSignUpData((prev: SignUpType) => ({
                                                ...prev,
                                                mobile: value,
                                            }))

                                            setSignUpErrors((prev: SignUpErrorType) => ({
                                                ...prev,
                                                mobileError: "",
                                            }))
                                        }}

                                            onBlur={handleMobileBlur} />
                                        {signUpErrors.mobileError && <h2 className="text-lg text-error font-bold">{signUpErrors.mobileError}</h2>}
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col justify-center gap-3">
                                <label className="text-lg font-semibold">Email:</label>
                                <input type="text" placeholder="Enter Email" className="px-3 py-2 border border-primary focus:outline-none rounded" value={signUpData.email} onChange={(e) => {
                                    setSignUpData((prev: SignUpType) => ({
                                        ...prev,
                                        email: e.target.value,
                                    }))

                                    setSignUpErrors((prev: SignUpErrorType) => ({
                                        ...prev,
                                        emailError: "",
                                    }))
                                }}
                                    onBlur={handleEmailBlur} />
                                {signUpErrors.emailError && <h2 className="text-lg text-error font-bold">{signUpErrors.emailError}</h2>}
                            </div>

                            <div className="flex flex-col lg:flex-row items-start gap-5">
                                <div className="flex flex-col justify-center gap-3 w-full lg:w-1/2">
                                    <label className="text-lg font-semibold">Password:</label>
                                    <div className="flex items-center relative">
                                        <input type={passwordInput ? "password" : "text"} placeholder="Enter Password" className="px-3 py-2 border border-primary focus:outline-none rounded w-full" value={password} onChange={(e) => {
                                            setPassword(e.target.value);

                                            setSignUpErrors((prev: SignUpErrorType) => ({
                                                ...prev,
                                                passwordError: "",
                                            }))
                                        }} />
                                        <div className="absolute right-0 pr-3">
                                            {!passwordInput ? <FaEye size={20} onClick={() => {
                                                setPasswordInput(true);
                                            }} className="cursor-pointer" /> : <FaEyeSlash size={20} onClick={() => {
                                                setPasswordInput(false);
                                            }} className="cursor-pointer" />}
                                        </div>
                                    </div>
                                    {signUpErrors.passwordError && <h2 className="text-lg text-error font-bold">{signUpErrors.passwordError}</h2>}
                                </div>

                                <div className="flex flex-col justify-center gap-3 w-full lg:w-1/2">
                                    <label className="text-lg font-semibold">Confirm Password:</label>
                                    <div className="flex items-center relative">
                                        <input type={confirmPasswordInput ? "password" : "text"} placeholder="Enter Confirm Password" className="px-3 py-2 border border-primary focus:outline-none rounded w-full" value={confirmPassword} onChange={(e) => {
                                            setConfirmPassword(e.target.value)
                                            setSignUpErrors((prev: SignUpErrorType) => ({
                                                ...prev,
                                                confirmPasswordError: "",
                                            }))
                                        }}
                                            onKeyDown={handleKeyPress}
                                        />

                                        <div className="absolute right-0 pr-3">
                                            {!confirmPasswordInput ? <FaEye size={20} onClick={() => {
                                                setConfirmPasswordInput(true);
                                            }} className="cursor-pointer" /> : <FaEyeSlash size={20} onClick={() => {
                                                setConfirmPasswordInput(false);
                                            }} className="cursor-pointer" />}
                                        </div>
                                    </div>
                                    {signUpErrors.confirmPasswordError && <h2 className="text-lg text-error font-bold">{signUpErrors.confirmPasswordError}</h2>}
                                </div>
                            </div>

                            <div className="mt-5">
                                <button className="py-3 w-full text-xl text-white bg-primary rounded " type="button" onClick={handleRegister}>Register</button>
                            </div>

                            <div className="flex flex-col md:flex-row justify-center items-center gap-3 text-lg font-bold mt-5">
                                <h2>Already have an account?</h2>
                                <Link href="/">
                                    <h2 className="text-primary cursor-pointer">Login</h2>
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>)}
            </div>
        </>
    )
}

export default RegisterUser;