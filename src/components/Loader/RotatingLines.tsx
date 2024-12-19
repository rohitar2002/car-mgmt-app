import { RotatingLines } from "react-loader-spinner"
import tailwindConfig from "../../../tailwind.config";

const Loader = () => {
    return (
        <>
            <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50 z-50">
                <RotatingLines
                    visible={true}
                    width="96"
                    strokeColor={tailwindConfig.theme.extend.colors.primary}
                    strokeWidth="5"
                    animationDuration="0.75"
                    ariaLabel="rotating-lines-loading"
                />
            </div>
        </>
    )
}

export default Loader;