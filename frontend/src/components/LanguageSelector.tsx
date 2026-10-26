import { useTranslation } from "react-i18next"


export default function LanguageSelector() {

    const { i18n } = useTranslation()

    return (
        <select className="bg-surface text-text text-sm border
                            border-soft-text/30 rounded-md px-3 py-2
                            focus:outline-none focus:border-primary 
                            cursor-pointer"

            value={i18n.language}
            onChange={(e) => i18n.changeLanguage(e.target.value)} >
            <option value="es">Español</option>
            <option value="en">English</option>
            <option value="nl">Nederlands</option>
        </select>
    )
}