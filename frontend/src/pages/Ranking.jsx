import {useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import {useSelector, useDispatch} from 'react-redux'
import { getRanking } from '../features/ranking/rankingSlice'
import Spinner from '../components/Spinner'

function Ranking() {

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const {user} = useSelector((state) => state.auth)
  const {ranking: data, isLoading, isError, message} = useSelector((state) => state.ranking)
  console.log(data);
  useEffect(() => {
    if(!user) {
      navigate('/login')
    }else {
      dispatch(getRanking())
    }
  }, [user, navigate])

  if(isLoading) {
    return <Spinner />
  } 

  return (
    <>
      <div>Ranking</div>
      <section className='ranking'>
        <div>
          <span>Posição</span>
          <span>Nome</span>
          <span>Pontuação</span>
        </div>
        {
          data.map((d, key) => {
            return (
              <div key={key} >
                <div>{ key + 1 }</div>
                <div>{ d.name }</div>
                <div>{ d.pontuacao }</div>
              </div>
            )
          })
        }
      </section>
    </>
  )
}

export default Ranking