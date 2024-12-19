export const nextEMIDate = (date: string) =>{
    const dateRef = new Date(date);

    const currentMonth = dateRef.getMonth();
    let nextMonth;
    let nextYear = dateRef.getFullYear();
    if (currentMonth == 11) {
        nextMonth = "01";
        nextYear += 1;  
    }
    else{
        nextMonth = currentMonth + 2;
        if (nextMonth < 10) {
            nextMonth = `0${nextMonth}`
        }
    }

    let nextDate = dateRef.getDate().toString();
    if (dateRef.getDate() < 10) {
        nextDate = `0${nextDate}`
    }

    return `${nextYear}-${nextMonth}-${nextDate}`;
}