import { useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useState } from "react"
import Header from "../components/Header/Header"
import { get } from "../api"
import { imgDefault } from '../components/utils/constants'
import Spinner from "../components/Spinner/Spinner"
import ConquistaCard from "../components/ConquistaCard"
import SemanalCard from "../components/SemanalCard"

function UserProfile() {

    const navigate = useNavigate()
    const { id } = useParams();
    const user = JSON.parse(localStorage.getItem('user'))
    const[data, setData] = useState(null)
    const[error, setError] = useState(null)
    const[isFetching, setIsFetching] = useState(false)
    const[conquistasData, setConquistasData] = useState(null)
    const[conquistaserror, setConquistasError] = useState(null)
    const[conquistasisFetching, setConquistasIsFetching] = useState(false)

    useEffect(() => {
        
        const fetchData = () => {
            
            if (!user) {
                navigate('/login');
            } else {
                get(`api/users/user/${id}`, setData, setError, setIsFetching);
            }  
        
        };

        fetchData(); 
    
    }, [])

    useEffect(() => {
        get(`api/conquistas/${id}`, setConquistasData, setConquistasError, setConquistasIsFetching)
    }, [])

    let pctC = ((conquistasData?.userStats[0]?.cravadasTotal/conquistasData?.userStats[0].jogosTotal)*100).toFixed(2);

    return (
        <>
            <Header/>
            <h2>Este é o perfil de {data?.name}! Aqui estão algumas de suas estatísticas e conquistas!</h2>
            <div className="perfilMain">
                <div className='perfil'>
                        <div className='perfilimagem'>
                            <img 
                                src={data?.imgPerfil ? data?.imgPerfil : imgDefault} 
                                alt='Imagem do usuário' 
                                style={{
                                    width: '7em',
                                    height: '7em'
                                }}>
                            </img>                  
                        </div>
                        
                        <div className='perfilNome'>
                            <p>Nome</p>
                            <h2>{data?.name}</h2>  
                        </div>

                        <div className="perfilStats">
                            <h1>Estatísticas Totais</h1>
                            <div className="perfil-stats">
                            <span className="perfil-stats2">
                                    <h3>Pontos Totais</h3>
                                    <h2>{conquistasData?.userStats[0]?.pontuacaoTotal}</h2>
                                </span>
                                <span className="perfil-stats2">
                                    <h3>Cravadas Totais</h3>
                                    <h2>{conquistasData?.userStats[0]?.cravadasTotal}</h2>    
                                </span>
                                <span className="perfil-stats2">
                                    <h3>Jogos Totais</h3>
                                    <h2>{conquistasData?.userStats[0]?.jogosTotal}</h2>           
                                </span>
                                <span className="perfil-stats2">
                                    <h3>% Cravadas</h3>
                                    <h2>{conquistasData?.userStats[0]?.jogosTotal === 0 ? '-' : `${pctC}%`}</h2>      
                                </span>
                                <span className="perfil-stats2">
                                    <h3>Campeonatos Jogados</h3>
                                    <h2>{conquistasData?.userStats[0]?.campsParticipou}</h2>  
                                </span>
                            </div> 
                        </div>  
                </div>
                {
                    (conquistasData?.userConquistas?.length > 0 || conquistasData?.userSemanais?.length > 0) &&
                    <div className="conquistas">
                        <h1>Conquistas de {data?.name}!</h1>
                        {conquistasData?.userSemanais?.map((semanal) => (
                            <SemanalCard key={semanal._id} conquista={semanal}/>
                        ))
                        }
                        {conquistasData?.userConquistas?.map((conquista) => (
                            <ConquistaCard key={conquista._id} conquista={conquista}/>
                        ))}
                    </div> 
                }
                {
                    (conquistasData?.userConquistas?.length || conquistasData?.userSemanais?.length) === 0 && <h1 className="conquistas">{data?.name} não possui conquistas!</h1>
                }
                
            </div>
        </>
        
    )
}

export default UserProfile