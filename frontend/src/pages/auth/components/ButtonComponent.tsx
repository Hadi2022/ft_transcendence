type ButtonProps = {
    text: string
}

export default function ButtonComponent({text} : ButtonProps) {

    return (
        <button type="submit" 
            className="text-white bg-cyan-400 hover:bg-cyan-300
                        py-4 rounded cursor-pointer transition-all">
            {text}
        </button>
    )
}