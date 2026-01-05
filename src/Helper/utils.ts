export const dateToString = (value: Date) => {
    return value.toLocaleDateString("en-CA", { day: "2-digit", month: "2-digit", year: "numeric" }).replaceAll("/", "-");
}

export const handleDateDisplay = (value: string) => {
    return value.split("-").reverse().join("-")
}

export const getLastDateOfMonth = (year: number, month: number): number => {
    return new Date(year, month + 1, 0).getDate();
}