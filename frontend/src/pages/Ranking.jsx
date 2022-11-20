import {useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import {useSelector, useDispatch} from 'react-redux'
import { getRanking } from '../features/ranking/rankingSlice'
import {reset} from '../features/auth/authSlice'
import Spinner from '../components/Spinner'

function Ranking() {

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const {user} = useSelector((state) => state.auth)
  const {ranking: data, isLoading, isError, message} = useSelector((state) => state.ranking)

  useEffect(() => {
    if(!user) {
      navigate('/login')
    }else {
      dispatch(getRanking())
    }

    return () => {
      dispatch(reset())
    }
  }, [user, navigate])

  if(isLoading) {
    return <Spinner />
  } 

  return (
    <>
      <div className='ranking-top'>Ranking</div>
      <section className='ranking'>
        <div>
          <span>Posição</span>
          <span>Nome</span>
          <span>Pontuação</span>
        </div>
        <p className='linha'>-</p>
        {
          data.map((d, key) => {
            return (
              <div className='pos' key={key}>
                <div>{ key + 1 }</div>
                <div>{ d.name }</div>
                <div>{ d.pontuacao }</div>
              </div>
            )
          })
        }
      </section>
      <p className='linha'>-</p>
      <h2 className='regras'>Regras de Pontuação</h2>
      <p className='texto'>Acertar o placar em cheio: <b>5 pontos</b></p>
      <p className='texto'>Acertar que foi empate/o vencedor do jogo: <b>3 pontos</b></p>
      <p className='texto'>Errar o placar mas acertar o número de gols de um dos times: <b>1 ponto</b></p>
      <p className='texto'>Errar completamente o placar: <b>0 pontos</b></p>
    </>
  )
}

export default Ranking