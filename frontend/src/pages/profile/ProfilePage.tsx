import { useParams } from "react-router"


export default function ProfilePage() {

    const { id } = useParams()

    return (
        <div>
            Perfil de { id }
        </div>
    )
}