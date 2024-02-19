import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { get } from "../api"
import { imgDefault } from "../components/utils/constants"
import Header from "../components/Header/Header"

function RankingSemanal() {

    const user = JSON.parse(localStorage.getItem('user'))
    const navigate = useNavigate()
    const[data, setData] = useState(null)
    const[isFetching, setIsFetching] = useState(false)
    const[error, setError] = useState(null)
    const [users, setUsers] = useState(null)

    useEffect(() => {
        if(!user) {
          navigate('/login')
        }
    
    }, [user, navigate])

    useEffect(() => {
        get("api/ranking/semanal", setData, setError, setIsFetching)
    }, [])

    useEffect(() => {
        if(data) {
          setUsers(data)
        }
      
    }, [data])

    return (
        <>
          <Header />
          <div className='ranking-top'>Ranking Semanal</div>
          <section className='ranking'>
            <div className='ranking-cabecalho'>
              <div className='ranking-col-1'>Posição</div>
              <div className='ranking-col-2'>Nome</div>
              <div className='ranking-col-1'>Pontuação</div>
              <div className='ranking-col-1'>Cravadas</div>
              <div className="ranking-col-1">Palpites</div>
            </div>
            <p className='linha'></p>
            {

              users?.map((u, key) => {
                return (
                  <div className='pos' key={key}>
                    <div className='ranking-col-1'>{ key + 1 }</div>
                    <div className='ranking-col-3'>
                      <img 
                        src={u?.user?.imgPerfil ? u?.user?.imgPerfil : imgDefault} 
                        alt='Imagem do usuário' 
                        style={{
                            width: '1.5em',
                            height: '1.5em'
                        }}>
                      </img>
                      {
                        u?.user?._id.toString() === user._id ? 
                        (<Link to='/perfil'>
                          <span>{ u?.user?.name }</span>
                        </Link>
                        ) : 
                        (<Link to={`/user/${u?.user?._id}`}>
                          <span>{ u?.user?.name }</span>
                        </Link>)
                      } 
                    </div>
                    <div className='ranking-col-1'>{ u.pontuacao }</div>
                    <div className='ranking-col-1'>{ u.cravadas }</div>
                    <div className="ranking-col-1">{ u.jogos }</div>
                  </div> 
                )
              })
            }
          </section>
          <p className='linha'></p>
          <h3 className='regras'>O ranking será atualizado automaticamente a cada hora!</h3>
          <h2 className='regras'>Regras de Pontuação - Jogo comum</h2>
          <p className='texto'>Acertar o placar em cheio: <b>5 pontos</b></p>
          <p className='texto'>Acertar que foi empate/o vencedor do jogo: <b>3 pontos</b></p>
          <p className='texto'>Errar o placar mas acertar o número de gols de um dos times: <b>1 pontos</b></p>
          <p className='texto'>Errar completamente o placar: <b>0 pontos</b></p>
          <h2 className='regras'>Regras de Pontuação - Mata-mata (Pontuação em dobro)</h2>
          <h2 className='regras'>Só vale os 90 (+30 de prorrogação) minutos do jogo, pênaltis não contam pro resultado.</h2>
          <p className='texto'>Acertar o placar em cheio: <b>10 pontos</b></p>
          <p className='texto'>Acertar que foi empate/o vencedor do jogo: <b>6 pontos</b></p>
          <p className='texto'>Errar o placar mas acertar o número de gols de um dos times: <b>2 pontos</b></p>
          <p className='texto'>Errar completamente o placar: <b>0 pontos</b></p>
        </>
    )
}

export default RankingSemanal