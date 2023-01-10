import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Header from "../components/Header/Header"

function Perfil() {

    const navigate = useNavigate()
    const user = JSON.parse(localStorage.getItem('user'))

    useEffect(() => {
        if(!user) {
          navigate('/login')
        } 
    
    }, [user, navigate])

    return (
        <>
            <Header/>
            <section>
                <h1>Olá, {user.name}! Estes são seus dados!</h1>
                <h3>Email: {user.email}</h3>
            </section>
        </>
        
    )
}

export default Perfil