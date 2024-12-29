import { OptionType } from "@/interface/CommonTypes";

export const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+$/;

export const frequentlyUsedCountryCodes : OptionType[] = [
    { label: "United States (+1)", value: "+1" },
    { label: "India (+91)", value: "+91" },
    { label: "United Kingdom (+44)", value: "+44" },
    { label: "Canada (+1)", value: "+1" },
    { label: "Australia (+61)", value: "+61" },
    { label: "Germany (+49)", value: "+49" },
    { label: "France (+33)", value: "+33" },
    { label: "China (+86)", value: "+86" },
    { label: "Japan (+81)", value: "+81" },
    { label: "South Korea (+82)", value: "+82" },
    { label: "Russia (+7)", value: "+7" },
    { label: "Brazil (+55)", value: "+55" },
    { label: "Mexico (+52)", value: "+52" },
    { label: "Italy (+39)", value: "+39" },
    { label: "South Africa (+27)", value: "+27" },
    { label: "Saudi Arabia (+966)", value: "+966" },
    { label: "United Arab Emirates (+971)", value: "+971" },
    { label: "Singapore (+65)", value: "+65" },
    { label: "New Zealand (+64)", value: "+64" },
    { label: "Pakistan (+92)", value: "+92" },
  ];
  