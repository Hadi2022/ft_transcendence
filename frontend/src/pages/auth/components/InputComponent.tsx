import { useId, useState, type ComponentProps } from "react"

type InputProps = ComponentProps<"input"> & {
    label: string,
}

export default function InputComponent(
    { label, type = "text", className = "", placeholder = "", ...props }: InputProps
) {
    const id = useId()
    const [isPasswordVisible, setIsPasswordVisible] = useState(false)

    return (
        <div className="space-y-1">
            <label
                htmlFor={id}
                className="block text-sm font-semibold uppercase tracking-wide"
            >
                {label}
            </label>

            <div className="flex items-center gap-2">
                <input
                    id={id}
                    type={type === "password" && isPasswordVisible ? "text" : type}
                    placeholder={placeholder}
                    className={`bg-white text-zinc-800 w-full min-w-0
                                rounded-md px-3 py-2
                                border-2 focus:border-blue-400
                                transition-colors focus:outline-none
                                ${className}`}
                    {...props}
                />

                {type === "password" && (
                    <button
                        type="button"
                        onClick={() => setIsPasswordVisible(visible => !visible)}
                        aria-label={`${isPasswordVisible ? "Hide" : "Show"} ${label}`}
                        aria-controls={id}
                        className="w-20 shrink-0 rounded-md border-2 px-3 py-2
                                   focus-visible:outline-2
                                   focus-visible:outline-offset-2
                                   focus-visible:outline-blue-400"
                    >
                        {isPasswordVisible ? "Hide" : "Show"}
                    </button>
                )}
            </div>
        </div>
    )
}