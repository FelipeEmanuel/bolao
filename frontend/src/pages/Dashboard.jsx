import {useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import Spinner from '../components/Spinner/Spinner.jsx'
import PalpiteItem from '../components/PalpiteItem'
import { useState } from 'react'
import '../components/PalpiteItem/palpiteItem.css'
import { get } from '../api'
import {ordenarJogos, ordenarListaJogos} from '../components/utils'
import ListaPalpites from '../components/ListaPalpites/index.jsx'
import Header from '../components/Header/Header.jsx'
import Pagination from '../components/Pagination/index.jsx'


function Dashboard() {

  const user = localStorage.getItem('user')
  const navigate = useNavigate()
  
  useEffect(() => {
    if(!user) {
      navigate('/login')
    }

  }, [user, navigate])

  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [isFetching, setIsFetching] = useState(true)
  const [errorUser, setErrorUser] = useState(null)
  const [isFetchingUser, setIsFetchingUser] = useState(true)
  const [usuario, setUsuario] = useState(null)
  const [games, setGames] = useState(null)
  const [palpitou, setPalpitou] = useState(null)
  const [currentPage, setCurrentPage] = useState(1);
  const [gamesPerPage] = useState(5);
  const [currentPagePalpites, setCurrentPagePalpites] = useState(1);
  const [gamesPerPagePalpites] = useState(10);
  const [qtdPalpitou, setQtdPalpitou] = useState(0);
  const [qtdNaoPalpitou, setQtdNaoPalpitou] = useState(0);

  useEffect(() => {
    get("api/palpites/userPalpites", setData, setError, setIsFetching)
  }, [palpitou])

  useEffect(() => {
    get('/api/users/me', setUsuario, setErrorUser, setIsFetchingUser)
  })

  useEffect(() => { 
    if(data) {
      data?.palpites?.forEach(p => {   
        p.pontuacao = 0;
        data?.gamesTodos?.forEach(g => {
          if(p.jogo._id === g._id) {
            if(p.palpite1 === g.placar1 && p.palpite2 === g.placar2){
              if(g.gameType === 2) {
                p.pontuacao = p.pontuacao + 10;
              } else {
                p.pontuacao = p.pontuacao + 5;
              }   
            } else if((p.palpite1 > p.palpite2 && g.placar1 > g.placar2) || (p.palpite1 < p.palpite2 && g.placar1 < g.placar2)) {  
              if(g.gameType === 2) {
                p.pontuacao = p.pontuacao + 6;
              } else {
                p.pontuacao = p.pontuacao + 3;
              }
              if(p.palpite1 === g.placar1 || p.palpite2 === g.placar2) {
                if(g.gameType === 2) {
                  p.pontuacao = p.pontuacao + 2;
                } else {
                  p.pontuacao = p.pontuacao + 1;
                }              
              } 
            } else if(g.placar1 !== "" && g.placar2 !== "" && p.palpite1 === p.palpite2 && g.placar1 === g.placar2) {
              if(g.gameType === 2) {
                p.pontuacao = p.pontuacao + 6;
              } else {
                p.pontuacao = p.pontuacao + 3;
              }
            } else if(p.palpite1 === g.placar1 || p.palpite2 === g.placar2) {
              if(g.gameType === 2) {
                p.pontuacao = p.pontuacao + 2;
              } else {
                p.pontuacao = p.pontuacao + 1;
              }  
            } else {
              p.pontuacao = p.pontuacao + 0;
            }
          }  
          
        });
          
      });

      
      data?.palpites?.forEach(p => {
        data?.gamesDisponiveis?.forEach(g => {
          if(p.jogo._id === g._id) {
            g.palpite1 = p.palpite1;
            g.palpite2 = p.palpite2;
          }
        })
      })          
      
      setGames(data?.gamesDisponiveis)

      let qtdPalpitesUser = 0
      data?.gamesDisponiveis.forEach(gd => {
        data?.palpites?.forEach(up => {
          if(gd._id == up.jogo._id) {
            qtdPalpitesUser+=1;
          } 
        })
      });

      const qtdGames = data?.gamesDisponiveis.length - qtdPalpitesUser 
      setQtdPalpitou(qtdPalpitesUser)
      setQtdNaoPalpitou(qtdGames)
        

    }
  }, [data])


  if(isFetching || isFetchingUser) {
    return <Spinner/>
  } 

  // Get current games
  const indexOfLastGame = currentPage * gamesPerPage;
  const indexOfFirstGame = indexOfLastGame - gamesPerPage;
  const currentPages = games?.sort(ordenarListaJogos).slice(indexOfFirstGame, indexOfLastGame);


  // Change page
  const paginate = pageNumber => setCurrentPage(pageNumber);


  //Palpites
  // Get current games
  const indexOfLastGamePalpites = currentPagePalpites * gamesPerPagePalpites;
  const indexOfFirstGamePalpites = indexOfLastGamePalpites - gamesPerPagePalpites;
  const currentPagesPalpites = data?.palpites?.sort(ordenarJogos).reverse().slice(indexOfFirstGamePalpites, indexOfLastGamePalpites);

  // Change page
  const paginatePalpites = pageNumber => setCurrentPagePalpites(pageNumber);

  /**/

  return (
    <>
      <Header />
      <section>
       <h1>Bem-vindo, {usuario?.name}!</h1>
        <br/>
        <h3>Você pode palpitar até 5 minutos antes do início do jogo!</h3>
        <h3 className='alerta'>INSTRUÇÕES:</h3>
        <h3 className='alerta'>- Caso a lista de jogos não esteja aparecendo, saia e faça seu login novamente, muito provavelmente há uma nova versão do site no ar!</h3>
        <h3 className='alerta'>- É necessário palpitar em um jogo por vez, um aviso em verde com a mensagem "Palpite Realizado" aparecerá embaixo do botão de confirmar palpite e o palpite também aparecerá na lateral!</h3>
        <h3 className='alerta'>- É possível trocar seu palpite, é só enviar o palpite novamente, como se fosse a primeira vez, o seu palpite atualizado aparecerá na lateral!</h3>
        <h3 className='alerta'>- Quando você realizar um palpite os placares que você enviou ficarão salvos na caixinha mostrando o palpite que você realizou, se a caixinha de enviar os palpites estiver vazia é porquê você não fez um palpite ainda!</h3>
        <h2>Jogos</h2>
      </section>
      <div className='palpitesgrid'>
        <section className='contentpalpites'>
          <h2>Jogos disponíveis para palpitar no momento!</h2>
          <h3>Dos {games?.length} jogos disponíveis, você já palpitou em {qtdPalpitou}!</h3>
          <h3 className='falta-palpite'>Falta palpitar em {qtdNaoPalpitou} jogo(s)!</h3>
          { 
            currentPages?.length > 0 && 
            <div className='palpites'>
                { 
                  currentPages?.map((jogo) => (
                    <PalpiteItem key={jogo._id} jogo={jogo} competicao={jogo.competicao} palpitou={setPalpitou}/>
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
            games?.length == 0 && <h3>Não há jogos cadastrados</h3>
          }     
        </section>
        <section className='contentpalpites'>
          <h2>Seus palpites da semana!</h2>
          {currentPagesPalpites?.length > 0 && 
            <div className='palpite'>
              {currentPagesPalpites?.map((palpite) =>(
                <ListaPalpites key={palpite._id} palpite={palpite}/>
              ))
              }
              <Pagination 
                        gamesPerPage={gamesPerPagePalpites} 
                        totalGames={data?.palpites?.length} 
                        paginate={paginatePalpites}
              />
              
            </div>
          }
          {
            currentPagesPalpites?.length === 0 &&
            <h3>Você ainda não fez palpites essa semana.</h3>
          }   
          
        </section>
      </div>          

    </>
  )
}

export default Dashboard