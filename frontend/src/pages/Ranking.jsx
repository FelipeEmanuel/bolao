import {useEffect} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import Spinner from '../components/Spinner/Spinner'
import useApi from '../hooks/useApi'
import { useState } from 'react'
import Header from '../components/Header/Header'
import Rankings from '../components/Rankings'
import { get } from '../api'
import CardsRanking from '../components/CardsRanking'

function Ranking() {

  const user = JSON.parse(localStorage.getItem('user'))
  const navigate = useNavigate()
  const[comps, setComps] = useState(null)
  const[data, setData] = useState(null)
  const[isFetching, setIsFetching] = useState(true)
  const[error, setError] = useState(null)
  
  
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
    }
  }, [data])

  if(isFetching) {
    return <Spinner />
  }


  return (
    <>
      <Header />
      <h1>Competições em andamento</h1>
      <div className='lista-comps'>
          { 
          comps?.map((comp) => (
              comp.ativa === true &&
                <CardsRanking key={comp._id} competicao={comp}/>
          ))
          }           
      </div>
      <div className='div1'>
        <Link to='/ranking/inativos'>
          <button className='btn btn-block3'>
            Ver rankings de competições passadas
          </button>
        </Link>
      </div>
    </>
  )
}

export default Ranking