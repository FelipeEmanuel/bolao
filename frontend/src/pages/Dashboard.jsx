import {useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import {useSelector, useDispatch} from 'react-redux'
import Spinner from '../components/Spinner'
import {reset} from '../features/auth/authSlice'
import {getJogos} from '../features/jogos/jogosSlice'
import { getPalpites } from '../features/palpites/palpiteSlice'
import PalpiteItem from '../components/PalpiteItem'
import { useState } from 'react'

function Dashboard() {

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const {user} = useSelector((state) => state.auth)
  const {jogos, isLoading, isError, message} = useSelector((state) => state.jogos)
  const {palpites, isLoadingP, isErrorP, messageP} = useSelector((state) => state.palpites)
  useEffect(() => {
    if(isError) {
      console.log(message)
    }

    if(!user) {
      navigate('/login')
    } else {
      dispatch(getJogos())
      dispatch(getPalpites())
    }

    return () => {
      dispatch(reset())
    }
    
  }, [user, navigate, isError, message, dispatch])


  if(isLoading && isLoadingP) {
    return <Spinner/>
  } 

  return (
    <>
      <section>
        <h1>Bem-vindo, {user && user.name}</h1>
        <br/>
        <h2>Jogos</h2>
      </section>

      <section className='content'>
        {jogos.length > 0 ? 
        (<div className='palpites'>
            {jogos.map((jogo) =>(
              <PalpiteItem key={jogo._id} jogo={jogo} palpites={palpites}/>
            ))}
        </div>
          ) : 
        (<h3>Não há jogos cadastrados</h3>)}
      </section>

      
    </>
  )
}

export default Dashboard