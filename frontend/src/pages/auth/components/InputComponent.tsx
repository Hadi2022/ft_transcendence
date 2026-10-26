import { useId, type ComponentProps } from "react"

type InputProps = ComponentProps<"input"> & {
    label: string,
}

export default function InputComponent(
    { label, type = "text", className = "", placeholder = "", ...props } : InputProps
) {

    const id = useId()

    return (
        <div className="space-y-1">
            <label htmlFor={id} className="block text-sm font-semibold
                                            uppercase tracking-wide">
                { label }
            </label>

            <input id={id} type={type} placeholder={placeholder}
                className={`bg-white text-zinc-800 w-full
                            rounded-md px-3 py-2
                            border-2 focus:border-blue-400
                            transition-colors focus:outline-none
                            ${className}`}
                { ...props } />
        </div>
    )
}