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
                        className="shrink-0 rounded-md border-2 px-3 py-2
                                   focus-visible:outline-2
                                   focus-visible:outline-offset-2
                                   focus-visible:outline-blue-400"
                    >
                        <svg viewBox="0 0 24 24" width="24" height="24"
                            fill="none" stroke="currentColor" strokeWidth="2"
                            strokeLinecap="round" strokeLinejoin="round"
                            aria-hidden="true" focusable="false">
                            <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z" />
                            <circle cx="12" cy="12" r="3" />
                            {isPasswordVisible && <path d="m3 3 18 18" />}
                        </svg>
                    </button>
                )}
            </div>
        </div>
    )
}