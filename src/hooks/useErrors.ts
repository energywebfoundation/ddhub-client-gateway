import { errorText } from "utils"

export const useErrors = () => {
    return (key: string) => (errorText[key] ?? key)
}
