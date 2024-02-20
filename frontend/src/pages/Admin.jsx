import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Spinner from '../components/Spinner/Spinner'
import useApi from '../hooks/useApi'
import ListaJogos from '../components/ListaJogos'
import Pagination from '../components/Pagination'
import { ordenarJogos, ordenarListaJogos } from '../components/utils'
import Header from '../components/Header/Header'
import { get } from '../api'


function Admin() {

    const [data, setData] = useState(null)
    const [error, setError] = useState(null)
    const [isFetching, setIsFetching] = useState(false)
    const navigate = useNavigate()
    const user = JSON.parse(localStorage.getItem('user'))
    const [currentPage, setCurrentPage] = useState(1);
    const [gamesPerPage] = useState(15);

    useEffect(() => {
        if(!user) {
            navigate('/login')
        }
    
    }, [user, navigate])

    useEffect(() => {
        get("api/games", setData, setError, setIsFetching)
    }, [data])

    if(isFetching) {
        return <Spinner/>
    }


    // Get current games
    const indexOfLastGame = currentPage * gamesPerPage;
    const indexOfFirstGame = indexOfLastGame - gamesPerPage;
    const currentPages = data?.sort(ordenarListaJogos).reverse().slice(indexOfFirstGame, indexOfLastGame);

    // Change page
    const paginate = pageNumber => setCurrentPage(pageNumber);

    return (
        <>
        <Header/>
        <section>
            <div className='div1'>
                <Link to='/novojogo'>
                    <button className='btn btn-block3'>Adicionar novo jogo</button>
                </Link>

            </div>   
            {   
                currentPages?.length > 0 && 
                <div className='lista-jogos'>
                    { 
                    currentPages?.map((jogo) => (
                        <ListaJogos key={jogo._id} jogo={jogo}/>
                    ))
                    }           
                    <Pagination 
                        gamesPerPage={gamesPerPage} 
                        totalGames={data?.length} 
                        paginate={paginate}
                    />
                </div>
            }
            {
                data?.length === 0 && <h3>Não há jogos cadastrados</h3>
            }
            
        </section>
        </>
    )
}

export default Admin