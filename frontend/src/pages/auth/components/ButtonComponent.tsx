type ButtonProps = {
    text: string
    isLoading?: boolean
}

export default function ButtonComponent({text, isLoading = false} : ButtonProps) {

    return (
        <button type="submit" disabled={isLoading} aria-busy={isLoading}
            className="flex items-center justify-center gap-2
                      text-white bg-cyan-400 hover:bg-cyan-300
                        py-4 rounded cursor-pointer transition-all
                        disabled:opacity-60 disabled:cursor-not-allowed
                        disabled:hover:bg-cyan-400">
            { isLoading ? (
                <span aria-hidden="true" className="
                                                    size-5 rounded-full border-2
                                                    border-white border-t-transparent
                                                    animate-spin"/>
            ) : (
                text
            )}
            
        </button>
    )
}