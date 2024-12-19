import Link from "next/link";
import { FaUserCircle } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import Modal from "react-modal"

Modal.setAppElement("#documentBody");

const customStyles: any = {
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
        width: "40%",
        border: "1px solid #ccc",
        borderRadius: "8px",
        background: "#ffffff",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        overflow: "auto",
    },
};

interface Props{
    isShowPopup: boolean;
    closePopup: ()=> void;
}
const UserConfirmMeaasge = ({isShowPopup, closePopup} : Props) => {
    return (
        <>
            <div>
                <Modal isOpen={isShowPopup} style={customStyles}>
                    <div className="flex flex-col gap-3">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold text-primary">User Registration</h2>
                            <MdClose className="text-2xl font-bold text-red-500 cursor-pointer" onClick={closePopup}/>
                        </div>

                        <div className="flex flex-col justify-center items-center gap-3 p-5">
                            <FaUserCircle size={50} className="text-primary" />
                            <h2 className="font-bold text-xl">User has Created Successfully</h2>
                        </div>

                        <div className="flex justify-center items-center gap-5">
                            <button className="px-5 py-2 text-xl text-white bg-primary rounded" onClick={closePopup}>Ok</button>
                            <Link href= "/">
                                <button className="px-3 py-2 text-xl text-primary border border-primary rounded">Login</button>
                            </Link>
                        </div>
                    </div>
                </Modal>
            </div>
        </>
    )
}

export default UserConfirmMeaasge;