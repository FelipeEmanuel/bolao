import Formulario from "../components/Formulario"
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Header from "../components/Header/Header"

function NovoJogo() {

    const navigate = useNavigate()
    const [users, setUsers] = useState(null)

    const user = JSON.parse(localStorage.getItem('user'))
    //const {user} = useSelector((state) => state.auth)

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