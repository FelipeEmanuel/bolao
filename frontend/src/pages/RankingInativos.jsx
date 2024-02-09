import {useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import Spinner from '../components/Spinner/Spinner'
import { useState } from 'react'
import Header from '../components/Header/Header'
import { get } from '../api'
import CardsRanking from '../components/CardsRanking'

function Ranking() {

  const user = JSON.parse(localStorage.getItem('user'))
  const navigate = useNavigate()
  const[comps, setComps] = useState(null)
  const[data, setData] = useState(null)
  const[isFetching, setIsFetching] = useState(false)
  const[error, setError] = useState(null)
  const[up, setUp] = useState(0)

  useEffect(() => {
    if(!user) {
      navigate('/login')
    }

  }, [user, navigate])

  useEffect(() => {
    get("api/competicoes", setData, setError, setIsFetching)
  }, [])

  useEffect(() => { 
    if(data) {
      setComps(data)

      let up = 0;

      data?.forEach(d => {
        if(d.ativa === false) {
          up = up + 1;
        }
      })

      setUp(up)
    }

  }, [data])

  if(isFetching) {
    return <Spinner />
  }

  return (
    <>
      <Header />
      <h1>Competições finalizadas</h1>
      <div className='lista-comps'>
        { 
        comps?.map((comp) => ( 
            comp.ativa === false && 
              <CardsRanking key={comp._id} competicao={comp} />
        ))
        }  
      </div>
      <section>
        {up === 0 && <h2>Não existem competições finalizadas!</h2>}
      </section>
    </>
  )
}

export default Ranking