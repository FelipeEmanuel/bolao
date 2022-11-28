import {useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import {useSelector} from 'react-redux'
import Spinner from '../components/Spinner'
import PalpiteItem from '../components/PalpiteItem'
import { useState } from 'react'
import '../components/PalpiteItem/palpiteItem.css'
import ReactCountryFlag from 'react-country-flag'
import { get } from '../api'
import {ordenarJogos} from '../components/utils'


function Dashboard() {

  const {user} = useSelector((state) => state.auth)
  const navigate = useNavigate()
  
  useEffect(() => {
    if(!user) {
      navigate('/login')
    }

  }, [user, navigate])

  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [isFetching, setIsFetching] = useState(false)
  const [usuario, setUsuario] = useState(null)
  const [games, setGames] = useState(null)
  const [palpitou, setPalpitou] = useState(null)

  useEffect(() => {
    get("api/palpites", setData, setError, setIsFetching)
  }, [palpitou])

  useEffect(() => { 
    if(data) {
      data?.user?.forEach(u => {   
          u.palpites.forEach(p => {
            p.pontuacao = 0;
            data?.gamesTodos?.forEach(g => {
              if(p.jogo === g._id) {
                p.jogoObj = g;
                if(p.palpite1 === g.placar1 && p.palpite2 === g.placar2){
                  p.pontuacao = p.pontuacao + 5;
                } else if((p.palpite1 > p.palpite2 && g.placar1 > g.placar2) || (p.palpite1 < p.palpite2 && g.placar1 < g.placar2)) {  
                  p.pontuacao = p.pontuacao + 3;
                  if(p.palpite1 === g.placar1 || p.palpite2 === g.placar2) {
                    p.pontuacao = p.pontuacao + 1;             
                  } 
                } else if(g.placar1 !== "" && g.placar2 !== "" && p.palpite1 === p.palpite2 && g.placar1 === g.placar2) {
                  p.pontuacao = p.pontuacao + 3; 
                } else if(p.palpite1 === g.placar1 || p.palpite2 === g.placar2) {
                  p.pontuacao = p.pontuacao + 1;
                } else {
                  p.pontuacao = p.pontuacao + 0;
                }
              }  
              
            });
          });
      });

      
      data?.user?.forEach(u => {
        u.palpites.forEach(p => {
          data?.gamesDisponiveis?.forEach(g => {
            if(p.jogo === g._id) {
              g.palpite1 = p.palpite1;
              g.palpite2 = p.palpite2;
            }
          })
        })
      })          
      
      setUsuario(data?.user[0])
      setGames(data?.gamesDisponiveis)

    }
  }, [data])

  if(isFetching) {
    return <Spinner/>
  } 

  return (
    <>
      <section>
       <h1>Bem-vindo, {user && user.name}</h1>
        <br/>
        <h3>Você pode palpitar até 15 minutos antes do início do jogo!</h3>
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
          { 
            games?.length > 0 && 
            <div className='palpites'>
                { 
                  games?.map((jogo) => (
                    <PalpiteItem key={jogo._id} jogo={jogo} palpitou={setPalpitou}/>
                  ))
                }
            </div>
          }
          {
            games?.length === 0 && <h3>Não há jogos cadastrados</h3>
          }     
        </section>
        <section className='contentpalpites'>
          <h2>Seus palpites</h2>
          {usuario?.palpites?.length > 0 && 
            <div className='palpite'>
              {usuario?.palpites?.sort(ordenarJogos).reverse().map((palpite) =>(
                <>{palpite.jogoObj.infoJogo}
                <div className='times'>
                  <div className='time1'>
                  <ReactCountryFlag countryCode={palpite.jogoObj.isocodetime1} svg style={{
                    width: '2em',
                    height: '2em',
                  }}/>
                  <h2>{palpite.jogoObj.time1}</h2>
                  <h2>{palpite.palpite1}</h2>
                  </div>
                  <h2>x</h2>
                  <div className='time2'>
                    <h2>{palpite.palpite2}</h2>
                    <h2>{palpite.jogoObj.time2}</h2>
                    <ReactCountryFlag countryCode={palpite.jogoObj.isocodetime2} svg style={{
                      width: '2em',
                      height: '2em',
                    }}/>
                    <>{palpite.pontuacao === 5 && <h2 className='palpiteG'>+{palpite.pontuacao}</h2>}
                    {palpite.pontuacao === 4 && <h2 className='palpiteB'>+{palpite.pontuacao}</h2>}
                    {palpite.pontuacao === 3 && <h2 className='palpiteY'>+{palpite.pontuacao}</h2>}
                    {palpite.pontuacao === 1 && <h2 className='palpiteC'>+{palpite.pontuacao}</h2>}
                    {palpite.jogoObj.placar1 !== "" && palpite.jogoObj.placar2 !== "" && palpite.pontuacao === 0 && <h2 className='palpiteR'>+{palpite.pontuacao}</h2>}
                           
                    </>
                  </div>
                </div>
                </>
              ))}
          </div>
          }
          {
            usuario?.palpites?.length === 0 &&
            <h3>Você ainda não fez palpites.</h3>
          }   
          
        </section>
      </div>          

    </>
  )
}

export default Dashboard