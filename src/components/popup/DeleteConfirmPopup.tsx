import { useEffect, useState } from "react";
import { IoWarningOutline } from "react-icons/io5";
import { MdClose } from "react-icons/md";
import Modal from "react-modal"
import { toast } from "react-toastify";
import Loader from "../Loader/RotatingLines";
import { useFirebaseContext } from "@/context/firebaseContext";
import { isMobile, isTablet } from "react-device-detect";
import { useRouter } from "next/navigation";
// import { useRouter } from "next/router";

Modal.setAppElement("#documentBody");

interface Props {
    isShowPopup: boolean;
    closePopup: () => void;
    carId: string;
    registrationNumber: string;
}
const DeleteConfirmPopup = ({ isShowPopup, closePopup, carId, registrationNumber }: Props) => {
    const [modalWidth, setModalWidth] = useState<string>("50%");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const router = useRouter();
    const firebaseContext = useFirebaseContext();

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

    const handleDeletion = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setIsLoading(true);

        const deletionResposne = await firebaseContext?.deleteCarRecord(carId);

        if (typeof deletionResposne === "boolean") {
            toast.success("Car Entry Deleted Successfully.");
            closePopup();
            router.push("/pages/DashBoard");
        }
        else {
            toast.error(deletionResposne);
        }

        setIsLoading(false);
    }
    useEffect(() => {
        const handleScreenSize = () => {
            if (window.innerWidth >= 1800) {
                setModalWidth("40%");
            }
            else if (window.innerWidth >= 1000) {
                setModalWidth("50%");
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
                    setModalWidth("50%");
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
                    {isLoading && <Loader />}

                    <div className="flex flex-col gap-3">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold text-primary">Delete Car Entry</h2>
                            <MdClose className="text-2xl font-bold text-red-500 cursor-pointer" onClick={closePopup} />
                        </div>

                        <div className="flex flex-col justify-center items-center gap-3 p-5">
                            <IoWarningOutline size={50} className="text-red-500" />
                            <h2 className="font-bold text-xl">Are you sure?</h2>

                            <div className="text-lg text-center text-red-500 font-semibold">Deleting <span className="text-primary">{registrationNumber}</span> will also remove any related loan information. Do you wish to continue?</div>
                        </div>

                        <div className="flex justify-center items-center gap-5">
                            <button className="px-5 py-2 text-xl text-white bg-primary rounded" onClick={handleDeletion}>Delete</button>
                            <button className="px-3 py-2 text-xl text-primary border border-primary rounded" onClick={closePopup}>Cancel</button>
                        </div>
                    </div>
                </Modal>
            </div>
        </>
    )
}

export default DeleteConfirmPopup;