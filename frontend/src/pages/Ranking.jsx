import {useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import {useSelector} from 'react-redux'
import Spinner from '../components/Spinner'
import useApi from '../hooks/useApi'
import { useState } from 'react'
import {ordenarRanking} from '../components/utils'



function Ranking() {

  const {data, error, isFetching} = useApi("/api/ranking")

  const navigate = useNavigate()

  const [users, setUsers] = useState(null)

  const {user} = useSelector((state) => state.auth)
  

  useEffect(() => {
    if(!user) {
      navigate('/login')
    }

  }, [user, navigate])

  useEffect(() => {
    if(data) {
      data?.users?.forEach(u => {   
          u.pontuacao = 0;
          u.palpites.forEach(p => {
            data?.games?.forEach(g => {
              if(p.jogo === g._id) {
                if(p.palpite1 === g.placar1 && p.palpite2 === g.placar2){
                  u.pontuacao = u.pontuacao + 5;
                } else if((p.palpite1 > p.palpite2 && g.placar1 > g.placar2) || (p.palpite1 < p.palpite2 && g.placar1 < g.placar2)) {  
                  u.pontuacao = u.pontuacao + 3;
                  if(p.palpite1 === g.placar1 || p.palpite2 === g.placar2) {
                    u.pontuacao = u.pontuacao + 1;             
                  } 
                } else if(p.palpite1 === p.palpite2 && g.placar1 === g.placar2) {
                  u.pontuacao = u.pontuacao + 3; 
                } else if(p.palpite1 === g.placar1 || p.palpite2 === g.placar2) {
                  u.pontuacao = u.pontuacao + 1;
                } else {

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
      <div className='ranking-top'>Ranking</div>
      <section className='ranking'>
        <div>
          <span>Posição</span>
          <span>Nome</span>
          <span>Pontuação</span>
        </div>
        <p className='linha'>-</p>
        {
          users?.map((u, key) => {
            return (
              <div className='pos' key={key}>
                <div>{ key + 1 }</div>
                <div>{ u.name }</div>
                <div>{ u.pontuacao }</div>
              </div> 
            )
          })
        }
      </section>
      <p className='linha'>-</p>
      <h3 className='regras'>O ranking sempre será atualizado alguns minutos após o último jogo do dia!</h3>
      <h2 className='regras'>Regras de Pontuação</h2>
      <p className='texto'>Acertar o placar em cheio: <b>5 pontos</b></p>
      <p className='texto'>Acertar que foi empate/o vencedor do jogo: <b>3 pontos</b></p>
      <p className='texto'>Errar o placar mas acertar o número de gols de um dos times: <b>1 ponto</b></p>
      <p className='texto'>Errar completamente o placar: <b>0 pontos</b></p>
    </>
  )
}

export default Ranking