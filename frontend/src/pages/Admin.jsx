import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'


function Admin() {

    const {user} = useSelector((state) => state.auth)
    const navigate = useNavigate()

    useEffect(() => {
        if(!user) {
          navigate('/login')
        }
    
    }, [user, navigate])

    return (
        <>
        <section>
            <div>Criar jogos</div>
        </section>
        <section>
            <div>Editar jogos</div>
        </section>
        <section>
            <div>Deletar jogos</div>
        </section>
        </>
    )
}

export default Admin