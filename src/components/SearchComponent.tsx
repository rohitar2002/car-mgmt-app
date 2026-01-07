import { OptionType } from "@/interface/CommonTypes";
import { useEffect, useState } from "react";
import Select, { SingleValue } from "react-select"

interface SearchComponentProps {
    registrationNumber: OptionType | null;
    registrationNumberOptionList: OptionType[];
    setRegistrationNumber: (value: SingleValue<OptionType>) => void;
    isEmiHistory: boolean;
    setHistoryTableTitle?: React.Dispatch<React.SetStateAction<string>>;
    getEMIDetails?: (value: string, setHistoryTableTitle?: React.Dispatch<React.SetStateAction<string>>) => void;
}

export const SearchComponent = ({ registrationNumber, registrationNumberOptionList, setRegistrationNumber, isEmiHistory, getEMIDetails, setHistoryTableTitle }: SearchComponentProps) => {
    const [updatedOtionList, setUpdatedOptionList] = useState<OptionType[]>([]);
    useEffect(() => {
        if (isEmiHistory) {
            setUpdatedOptionList(registrationNumberOptionList.filter((item) => item.value !== ""));
        }

        return () => setUpdatedOptionList([]);
    }, []);
    return (
        <div className={`flex sm:justify-end items-center sm:flex-row w-full ${isEmiHistory ? "gap-10 flex-col" : "md:w-5/12"}`}>
            {!isEmiHistory && <label className="px-3 font-bold whitespace-nowrap text-accent text-lg" htmlFor="filter-car">Filter Cars:</label>}
            <Select
                className="border border-primary w-full rounded focus:outline-none"
                placeholder="Search using registration Number"
                instanceId="filter-car"
                value={registrationNumber}
                options={isEmiHistory ? updatedOtionList : registrationNumberOptionList}
                onChange={(selectedOption: SingleValue<OptionType>) =>
                    setRegistrationNumber(selectedOption)}
            />

            {isEmiHistory && getEMIDetails && <button className="px-5 py-2 w-fit whitespace-nowrap rounded bg-primary text-white " disabled={registrationNumber == null} onClick={() => getEMIDetails(registrationNumber ? registrationNumber.value : "", setHistoryTableTitle)}>Get EMI History</button>}
        </div>
    )
}