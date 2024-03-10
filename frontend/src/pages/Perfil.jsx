import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import ModalPopup from "../components/ModalPopup"
import Header from "../components/Header/Header"
import Botao from "../components/Botao"
import ListaSuspensaImg from "../components/ListaSuspensaImg"
import { get, put } from "../api"
import { imgDefault } from '../components/utils/constants'
import Spinner from "../components/Spinner/Spinner"
import Campo from "../components/Campo"
import { escudos } from "../components/utils/constants"
import ConquistaCard from "../components/ConquistaCard"
import SemanalCard from "../components/SemanalCard"

function Perfil() {

    const navigate = useNavigate()
    const user = JSON.parse(localStorage.getItem('user'))
    const[buttonPopup, setButtonPopup] = useState(false);
    const[data, setData] = useState(null)
    const[error, setError] = useState(null)
    const[isFetching, setIsFetching] = useState(true)
    const[email, setEmail] = useState('')
    const[name, setName] = useState('')
    const[imgPerfil, setImgPerfil] = useState('')
    const[conquistasData, setConquistasData] = useState(null)
    const[conquistaserror, setConquistasError] = useState(null)
    const[conquistasIsFetching, setConquistasIsFetching] = useState(true)

    useEffect(() => {
        
        const fetchData = () => {
            
            if (!user) {
                navigate('/login');
            } else {
                get(`api/users/me`, setData, setError, setIsFetching);
            }  
        
        };

        fetchData(); 
    
    }, [])

    useEffect(() => {

        if(data) {
            setImgPerfil(data?.imgPerfil);
            setName(data?.name);
            setEmail(data?.email);   
        } 

        if(error) {
            console.error('Erro ao buscar dados do jogo:', error);
        }
        
    }, [data, error, isFetching])

    useEffect(() => {
        get("api/conquistas", setConquistasData, setConquistasError, setConquistasIsFetching)
    }, [])

    function fecharModal() {
        setButtonPopup(false)
    }

    const editarUser = async (event) => {

        event.preventDefault();
        
        const body = {
            imgPerfil, name, email 
        }
        
        put(`api/users/${data?._id}`, body, setData, setError, fecharModal)

    };

    if(isFetching || conquistasIsFetching) {
        <Spinner/>
    }
    let pctC = ((conquistasData?.userStats[0]?.cravadasTotal/conquistasData?.userStats[0].jogosTotal)*100).toFixed(2);

    return (
        <>
            <Header/>
            <h2>Olá, {data?.name}! Estes são seus dados e suas conquistas!</h2>
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
                            <button className='button-imagem' onClick={() => setButtonPopup(true)}>
                                Editar perfil
                            </button>
                            
                        </div>
                        
                        <div className='perfilNome'>
                            <p>Nome</p>
                            <h2>{data?.name}</h2>  
                        </div>
                        <div className='perfilEmail'>
                            <p>Email</p>
                            <h3>{data?.email}</h3>
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
                    <div className="conquistas">
                        <h1>Suas conquistas!</h1>
                        {conquistasData?.userSemanais?.length > 0 && conquistasData?.userSemanais?.map((semanal) => (
                            <SemanalCard key={semanal._id} conquista={semanal}/>
                        ))
                        }
                        {conquistasData?.userConquistas?.length > 0 && conquistasData?.userConquistas?.map((conquista) => (
                            <ConquistaCard key={conquista._id} conquista={conquista}/>
                        ))}
                        {(conquistasData?.userConquistas?.length || conquistasData?.userSemanais?.length === 0) && <h1 className="conquistas">Você não possui conquistas!</h1>}
                    </div> 
                }
                {
                   
                }
                
            </div>
            
            <ModalPopup trigger={buttonPopup} setTrigger={setButtonPopup}>
                <form className='formulario' onSubmit={(event) => editarUser(event)}>
                    <h3>Escolha um time para sua imagem de perfil!</h3>
                        <ListaSuspensaImg 
                            required={false} 
                            label="Imagem do Perfil" 
                            itens={escudos}
                            valor={imgPerfil ? imgPerfil : ''}
                            aoAlterado={valor => setImgPerfil(valor)}
                        /> 
                    <Campo 
                        required
                        label="Alterar nome"
                        type='size-input1'
                        placeholder="Alterar nome"
                        valor={name ? name : ""}
                        aoAlterado={valor => setName(valor)}
                    />
                    <Campo 
                        required
                        label="Alterar email"
                        type='size-input1'
                        placeholder="Alterar email"
                        valor={email ? email : ""}
                        aoAlterado={valor => setEmail(valor)}
                    />
                    {error &&
                        <div className="perfil-error">
                            {error.message}
                        </div>
                    }
                    
                    <div className='div1'>
                        <Botao texto='Finalizar edição' />
                    </div>
                </form>
            </ModalPopup>
        </>
        
    )
}

export default Perfil