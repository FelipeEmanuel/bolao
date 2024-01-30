import {useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
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
  const[isFetching, setIsFetching] = useState(false)
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
      <div className='lista-comps'>
                    { 
                    comps?.map((comp) => (
                        <CardsRanking key={comp._id} competicao={comp}/>
                    ))
                    }           
        </div>
    </>
  )
}

export default Ranking