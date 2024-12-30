import Link from "next/link";
import { useEffect, useState } from "react";
import { isMobile, isTablet } from "react-device-detect";
import { FaUserCircle } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import Modal from "react-modal"

Modal.setAppElement("#documentBody");

interface Props {
    isShowPopup: boolean;
    closePopup: () => void;
}
const UserConfirmMeaasge = ({ isShowPopup, closePopup }: Props) => {
    const [modalWidth, setModalWidth] = useState<string>("50%");

    const customStyles: ReactModal.Styles = {
        overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1000,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
        },
        content: {
            position: "relative",
            inset: "auto",
            padding: "20px",
            width: modalWidth,
            border: "1px solid #ccc",
            borderRadius: "8px",
            background: "#ffffff",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            overflow: "auto",
        },
    };

    useEffect(() => {
        const handleScreenSize = () => {
            if (window.innerWidth >= 1700) {
                setModalWidth("30%");
            }
            else if (window.innerWidth >= 1000) {
                setModalWidth("40%");
            }
            else if (window.innerWidth >= 768) {
                setModalWidth("80%");
            }
            else {
                setModalWidth("90%");
            }
        }

        if (isShowPopup) {
            window.addEventListener("resize", handleScreenSize);

            if (isShowPopup) {
                if (isMobile) {
                    setModalWidth("90%");
                }
                else if (isTablet) {
                    setModalWidth("70%");
                }
                else {
                    setModalWidth("40%");
                }
            }
        }
        else {
            window.removeEventListener("resize", handleScreenSize);
        }

        return () => {
            window.removeEventListener("resize", handleScreenSize);
        }
    }, [isShowPopup])
    return (
        <>
            <div>
                <Modal isOpen={isShowPopup} style={customStyles}>
                    <div className="flex flex-col gap-3">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold text-primary">User Registration</h2>
                            <MdClose className="text-2xl font-bold text-red-500 cursor-pointer" onClick={closePopup} />
                        </div>

                        <div className="flex flex-col justify-center items-center gap-3 p-5">
                            <FaUserCircle size={50} className="text-primary" />
                            <h2 className="font-bold text-xl text-center whitespace-nowrap">User has Created Successfully</h2>
                        </div>

                        <div className="flex justify-center items-center gap-5">
                            <button className="px-10 py-2 text-xl text-white bg-primary rounded" onClick={closePopup}>Ok</button>
                            <Link href="/">
                                <button className="px-8 py-2 text-xl text-primary border border-primary rounded">Login</button>
                            </Link>
                        </div>
                    </div>
                </Modal>
            </div>
        </>
    )
}

export default UserConfirmMeaasge;