import { ErrorCode, errorText } from "utils"

export const useErrors = () => {
    return (key: string) => (errorText[key] ?? 'Unknown Error')
}
