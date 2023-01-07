import { useEffect } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

function Perfil() {

    const navigate = useNavigate()
    const {user} = useSelector((state) => state.auth)

    useEffect(() => {
        if(!user) {
          navigate('/login')
        } 
    
    }, [user, navigate])

    return (



        <div>Perfil do usuário</div>
    )
}

export default Perfil