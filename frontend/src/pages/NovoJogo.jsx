import Formulario from "../components/Formulario"
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Header from "../components/Header/Header"

function NovoJogo() {

    const navigate = useNavigate()
    const {user} = useSelector((state) => state.auth)

    useEffect(() => {
        if(!user) {
          navigate('/login')
        } 
    
    }, [user, navigate])

    useEffect(() => {
        if(user.role === 'user') {
            navigate('/')
        }
    }, [user, navigate])

    return (
        <div>
            <Header />
            <Formulario />
        </div>
    )

}

export default NovoJogo