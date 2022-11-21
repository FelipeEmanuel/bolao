import {useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import {useSelector, useDispatch} from 'react-redux'
import Spinner from '../components/Spinner'
import {reset} from '../features/auth/authSlice'
import {getJogos} from '../features/jogos/jogosSlice'
import { getPalpites } from '../features/palpites/palpiteSlice'
import PalpiteItem from '../components/PalpiteItem'
import { useState } from 'react'
import '../components/PalpiteItem/palpiteItem.css'
import ReactCountryFlag from 'react-country-flag'
import { toast } from 'react-toastify'


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
        
        <h3>Você pode palpitar até 15 minutos antes do início do jogo!</h3>
        <h3 className='alerta'>INSTRUÇÕES:</h3>
        <h3 className='alerta'>- É necessário palpitar em um jogo por vez, a página atualizará quando você realizar um palpite!</h3>
        <h3 className='alerta'>- Os jogos em que você realizou um palpite aparecem na lateral, se algum jogo não estiver lá, você ainda não palpitou nele!</h3>
        <h3 className='alerta'>- É possível trocar seu palpite, é só enviar o palpite novamente, como se fosse a primeira vez, o seu palpite atualizado aparecerá na lateral!</h3>
        <h2>Jogos</h2>
      </section>
      <div className='palpitesgrid'>
        <section className='contentpalpites'>
          {jogos?.length > 0 ? 
          (<div className='palpites'>
              {jogos?.map((jogo) =>(
                <PalpiteItem key={jogo._id} jogo={jogo} />
              ))}
          </div>
            ) : 
          (<h3>Não há jogos cadastrados</h3>)}
        </section>
        <section className='contentpalpites'>
          <h2>Seus palpites</h2>
          {palpites?.length > 0 ? 
          (<div className='palpite'>
              {palpites?.map((palpite) =>(
                <>{palpite.jogo.infoJogo}
                <div className='times'>
                  <div className='time1'>
                  <ReactCountryFlag countryCode={palpite.jogo.isocodetime1} svg style={{
                    width: '2em',
                    height: '2em',
                  }}/>
                  <h2>{palpite.jogo.time1}</h2>
                  <h2>{palpite.palpite1}</h2>
                  </div>
                  <h2>x</h2>
                  <div className='time2'>
                    <h2>{palpite.palpite2}</h2>
                    <h2>{palpite.jogo.time2}</h2>
                    <ReactCountryFlag countryCode={palpite.jogo.isocodetime2} svg style={{
                      width: '2em',
                      height: '2em',
                    }}/>
                    <>
                    {palpite.palpitePontos === '5' ? 
                    (<h2 className='palpiteG'>+{palpite.palpitePontos}</h2>) : 
                    (palpite.palpitePontos === '4' ? (<h2 className='palpiteB'>+{palpite.palpitePontos}</h2>) : 
                    (palpite.palpitePontos === '3' ? (<h2 className='palpiteY'>+{palpite.palpitePontos}</h2>) : 
                    (palpite.palpitePontos === '1' ? (<h2 className='palpiteC'>+{palpite.palpitePontos}</h2>) : 
                    (palpite.palpitePontos === ''? (<h2 className='palpiteR'>{palpite.palpitePontos}</h2>) : 
                    (<h2 className='palpiteR'>+{palpite.palpitePontos}</h2>)))))}
                    
                    </>
                  </div>
                </div>
                </>
              ))}
          </div>
            ) : 
          (<h3>Você ainda não fez palpites.</h3>)}
        </section>
      </div>         

    </>
  )
}

export default Dashboard