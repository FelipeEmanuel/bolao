import { Link, useNavigate, useParams } from "react-router-dom"
import Header from "../Header/Header"
import { imgDefault } from "../utils/constants"
import './Rankings.css'
import { useEffect, useState } from "react"
import Spinner from "../Spinner/Spinner"
import { get } from "../../api"

const Rankings = () => {

    const { id } = useParams();
    const[comp, setComp] = useState(null)
    const[data, setData] = useState(null)
    const[error, setError] = useState(null)
    const[isFetching, setIsFetching] = useState(false)
    const[data2, setData2] = useState(null)
    const[error2, setError2] = useState(null)
    const[isFetching2, setIsFetching2] = useState(false)
    const navigate = useNavigate()
    const [users, setUsers] = useState(null)
    const user = JSON.parse(localStorage.getItem('user'))
  
    useEffect(() => {
        if(!user) {
        navigate('/login')
        }

    }, [user, navigate])


    useEffect(() => {
        get(`api/ranking/getPontuacao/${id}`, setData, setError, setIsFetching)
    }, [])

    useEffect(() => {
        get(`api/competicoes/${id}`, setData2, setError2, setIsFetching2)
    }, [])

    useEffect(() => {
        if(data) {
          setUsers(data)
        }
      
    }, [data])

    useEffect(() => {
        if(data2) {
            setComp(`${data2.name} ${data2.ano}`)
        }
    }, [data2])
    
    if(isFetching) {
      return <Spinner />
    }

    return (
        <>
          <Header />
          <div className='ranking-top'>Ranking {comp}</div>
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

export default Rankings