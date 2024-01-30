import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Spinner from '../components/Spinner/Spinner'
import useApi from '../hooks/useApi'
import ListaJogos from '../components/ListaJogos'
import Pagination from '../components/Pagination'
import { ordenarJogos } from '../components/utils'
import Header from '../components/Header/Header'


function Admin() {

    const {data, isFetching} = useApi("/api/palpites")
    const navigate = useNavigate()
    const user = JSON.parse(localStorage.getItem('user'))
    const [games, setGames] = useState(null)
    const [currentPage, setCurrentPage] = useState(1);
    const [gamesPerPage] = useState(15);

    

    useEffect(() => {
        if(!user) {
          navigate('/login')
        }

        /*if(user.role != "admin") {
            navigate('/')
        }*/
    
    }, [user, navigate])

    useEffect(() => {
        setGames(data?.gamesTodos.sort(ordenarJogos).reverse())
    }, [data])

    if(isFetching) {
        return <Spinner/>
    }

    // Get current games
    const indexOfLastGame = currentPage * gamesPerPage;
    const indexOfFirstGame = indexOfLastGame - gamesPerPage;
    const currentPages = games?.slice(indexOfFirstGame, indexOfLastGame);

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
                        totalGames={games?.length} 
                        paginate={paginate}
                    />
                </div>
            }
            {
                games?.length === 0 && <h3>Não há jogos cadastrados</h3>
            }
            
        </section>
        </>
    )
}

export default Admin