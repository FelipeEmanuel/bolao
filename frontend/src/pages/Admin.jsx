import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Spinner from '../components/Spinner'
import useApi from '../hooks/useApi'
import ListaJogos from '../components/ListaJogos'


function Admin() {

    const {data, error, isFetching} = useApi("/api/palpites")
    const navigate = useNavigate()
    const [users, setUsers] = useState(null)
    const {user} = useSelector((state) => state.auth)
    const [games, setGames] = useState(null)

    useEffect(() => {
        if(!user) {
          navigate('/login')
        }
    
    }, [user, navigate])

    useEffect(() => {
        setGames(data?.gamesTodos)
    }, [data])

    if(isFetching) {
        return <Spinner/>
    }

    return (
        <>
        <section>
            <div className='div1'>
                <button className='btn btn-block3'>Adicionar novo jogo</button>
            </div>   
            {   
                games?.length > 0 && 
                <div className='lista-jogos'>
                    { 
                    games?.map((jogo) => (
                        <ListaJogos key={jogo._id} jogo={jogo}/>
                    ))
                    }
                </div>
            }
            {
                games?.length === 0 && <h3>Não há jogos cadastrados</h3>
            }
            
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