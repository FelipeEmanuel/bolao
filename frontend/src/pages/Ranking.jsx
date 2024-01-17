import {useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import Spinner from '../components/Spinner/Spinner'
import useApi from '../hooks/useApi'
import { useState } from 'react'
import {ordenarRanking} from '../components/utils'
import Header from '../components/Header/Header'
import { imgDefault } from '../components/utils/constants'

function Ranking() {

  const {data, error, isFetching} = useApi("/api/ranking")

  const navigate = useNavigate()

  const [users, setUsers] = useState(null)

  const user = JSON.parse(localStorage.getItem('user'))
  
  useEffect(() => {
    if(!user) {
      navigate('/login')
    }

  }, [user, navigate])

  useEffect(() => {
    if(data) {
      console.log(data)
      console.log(data?.users)
      data?.users?.forEach(u => {   
          u.pontuacao = 0;
          u.palpitesCravados = 0;
          u.palpites.forEach(p => {
            data?.games?.forEach(g => {
              if(p.jogo === g._id) {
                if(p.palpite1 === g.placar1 && p.palpite2 === g.placar2){
                  if(g.gameType === 2) {
                    u.pontuacao = u.pontuacao + 10;
                    u.palpitesCravados += 1;
                  } else {
                    u.pontuacao = u.pontuacao + 5;
                    u.palpitesCravados += 1;
                  }
                } else if((p.palpite1 > p.palpite2 && g.placar1 > g.placar2) || (p.palpite1 < p.palpite2 && g.placar1 < g.placar2)) {  
                  if(g.gameType === 2) {
                    u.pontuacao = u.pontuacao + 6;
                  } else {
                    u.pontuacao = u.pontuacao + 3;
                  }
                  if(p.palpite1 === g.placar1 || p.palpite2 === g.placar2) {
                    if(g.gameType === 2) {
                      u.pontuacao = u.pontuacao + 2;
                    } else {
                      u.pontuacao = u.pontuacao + 1;
                    }            
                  } 
                } else if(p.palpite1 === p.palpite2 && g.placar1 === g.placar2) {
                  if(g.gameType === 2) {
                    u.pontuacao = u.pontuacao + 6;
                  } else {
                    u.pontuacao = u.pontuacao + 3; 
                  } 
                } else if(p.palpite1 === g.placar1 || p.palpite2 === g.placar2) {
                  if(g.gameType === 2) {
                    u.pontuacao = u.pontuacao + 2;
                  } else {
                    u.pontuacao = u.pontuacao + 1;
                  }
                } else {
                  u.pontuacao = u.pontuacao + 0;
                }
              }
            });
          });
      });
      
    
      data?.users?.sort(ordenarRanking).reverse()
      setUsers(data.users)
    }
  
  }, [data])

  if(isFetching) {
    return <Spinner />
  }

  return (
    <>
      <Header />
      <div className='ranking-top'>Ranking</div>
      <section className='ranking'>
        <div className='ranking-cabecalho'>
          <div className='ranking-col-1'>Posição</div>
          <div className='ranking-col-2'>Nome</div>
          <div className='ranking-col-1'>Pontuação</div>
          <div className='ranking-col-1'>Cravadas</div>
        </div>
        <p className='linha'></p>
        {
          users?.map((u, key) => {
            return (
              <div className='pos' key={key}>
                <div className='ranking-col-1'>{ key + 1 }</div>
                <div className='ranking-col-3'>
                  <img 
                    src={u?.imgPerfil ? u?.imgPerfil : imgDefault} 
                    alt='Imagem do usuário' 
                    style={{
                        width: '1.5em',
                        height: '1.5em'
                    }}>
                  </img> 
                  <span>{ u.name }</span>
                </div>
                <div className='ranking-col-1'>{ u.pontuacao }</div>
                <div className='ranking-col-1'>{ u.palpitesCravados }</div>
              </div> 
            )
          })
        }
      </section>
      <p className='linha'></p>
      <h3 className='regras'>O ranking será atualizado periodicamente, ao fim de cada jogo ou dia de jogos!</h3>
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

export default Ranking