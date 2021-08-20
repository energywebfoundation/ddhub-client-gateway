import { errorExplainer } from "../utils"

export const useErrors = () => {
    return (key: string) => (errorExplainer[key]?.text ?? key)
}
