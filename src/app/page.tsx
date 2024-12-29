'use client'

import Loader from "@/components/Loader/RotatingLines";
import { useFirebaseContext } from "@/context/firebaseContext";
import { emailRegex } from "@/Helper/constants";
import { LoginCredentials, LoginErrors } from "@/interface/UsersType";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";

export default function Home() {
  const [loginData, setLoginData] = useState<LoginCredentials>({
    email: "",
    password: "",
  })

  const [loginErrors, setLoginErrors] = useState<LoginErrors>({
    emailError: "",
    passwordError: "",
  })
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState<boolean>(true);
  const firebaseResponse = useFirebaseContext();
  const router = useRouter();


  const handleLogin = async (e?: React.MouseEvent<HTMLButtonElement>) => {
    e?.preventDefault();
    if (loginData.email.trim() === "") {
      setLoginErrors((prev: LoginErrors) => ({
        ...prev,
        emailError: "This field is Required",
      }))

      return;
    }
    else if (!emailRegex.test(loginData.email)) {
      setLoginErrors((prev: LoginErrors) => ({
        ...prev,
        emailError: "Email is Invalid",
      }))

      return;
    }

    if (loginData.password.trim() === "") {
      setLoginErrors((prev: LoginErrors) => ({
        ...prev,
        passwordError: "This field is Required",
      }))

      return;
    }
    setIsLoading(true);
    const loginResponse = await firebaseResponse?.loginUser(loginData);
    if (typeof loginResponse === "string") {
      toast.error(loginResponse)
    }
    else if (loginResponse === null) {
      toast.error("Something Went Wrong");
    }
    else {
      toast.success("Login Success!");

      setLoginData({
        email: "",
        password: "",
      })
      router.replace("/pages/DashBoard");
    }

    setIsLoading(false);
  }

  useEffect(() => {
    if (localStorage.getItem("UsersInfo")) {
      router.replace("/pages/DashBoard")
    }
  }, [])

  return (
    <>
      {isLoading && <Loader />}
      <div className="flex flex-col justify-center items-center w-full px-5 py-10">
        <div className="text-xl text-center md:text-2xl text-primary font-bold py-10 underline">Car Finance Management App!</div>
        <div className="p-5 md:p-10 w-full lg:w-2/5 rounded-lg flex flex-col gap-10 border border-primary">
          <h2 className="text-lg text-center md:text-2xl text-primary font-bold underline">Welcome Back!</h2>
          <form className="flex flex-col justify-center gap-5">
            <div className="flex flex-col justify-center gap-3">
              <label className="text-lg font-semibold">Email:</label>
              <input type="text" placeholder="Enter Email" className="px-3 py-2 border border-primary focus:outline-none rounded" value={loginData.email} onChange={(e) => {
                setLoginData((prev: LoginCredentials) => ({
                  ...prev,
                  email: e.target.value,
                }))

                setLoginErrors((prev: LoginErrors) => ({
                  ...prev,
                  emailError: "",
                }))
              }} />
              {loginErrors.emailError && <h2 className="text-lg text-error font-bold">{loginErrors.emailError}</h2>}

            </div>
            <div className="flex flex-col justify-center gap-3">
              <label className="text-lg font-semibold">Password:</label>
              <div className="flex items-center w-full relative">
                <input type={passwordInput ? "password" : "text"} placeholder="Enter Password" className="px-3 py-2 border border-primary focus:outline-none rounded w-full" value={loginData.password} onChange={(e) => {
                  setLoginData((prev: LoginCredentials) => ({
                    ...prev,
                    password: e.target.value,
                  }))

                  setLoginErrors((prev: LoginErrors) => ({
                    ...prev,
                    passwordError: "",
                  }))
                }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleLogin();
                    }
                  }} />

                <div className="absolute right-0 pr-3">
                  {!passwordInput ? <FaEye size={20} onClick={() => {
                    setPasswordInput(true);
                  }} className="cursor-pointer" />
                    : <FaEyeSlash size={20} onClick={() => {
                      setPasswordInput(false);
                    }} className="cursor-pointer" />}
                </div>
              </div>
              {loginErrors.passwordError && <h2 className="text-lg text-error font-bold">{loginErrors.passwordError}</h2>}
            </div>

            <div className="mt-5">
              <button type="button" className="py-3 w-full text-xl text-white bg-primary rounded " onClick={handleLogin}>Login</button>
            </div>

            <div className="flex flex-col md:flex-row justify-center items-center gap-3 text-lg font-bold mt-5">
              <h2>Don&apos;t have an account?</h2>
              <Link href="/pages/RegisterUser">
                <h2 className="text-primary cursor-pointer">Register here</h2>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
