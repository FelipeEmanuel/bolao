import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header/Header'
import Campo from '../components/Campo'
import ListaSuspensaImg from '../components/ListaSuspensaImg'
import ListaSuspensa from '../components/ListaSuspensa'
import Botao from '../components/Botao'
import { get, put } from '../api'
import treze from '../images/logo-treze-de-campina-grande-256.png'
import campinense from '../images/logo-campinense-256.png'
import serrabranca from '../images/logo-serra-branca.png'
import botafogopb from '../images/logo-botafogo-pb.png'
import atleticopb from '../images/logo-atletico-pb.png'
import sousa from '../images/logo-sousa-pb-256.png'
import nacionalpb from '../images/logo-nacional-de-patos-pb.png'
import csp from '../images/logo-csp.png'
import pombal from '../images/logo-pombal.png'
import saopaulopb from '../images/logo-sao-paulo-crystal.png'
import Spinner from '../components/Spinner/Spinner'

const EditJogo = () => {

    const navigate = useNavigate()
    const { id } = useParams();
    const user = JSON.parse(localStorage.getItem('user'))

    const[data, setData] = useState(null)
    const[error, setError] = useState(null)
    const[isFetching, setIsFetching] = useState(false)
    const[time1, setTime1] = useState('')
    const[time2, setTime2] = useState('')
    const[dataLimite, setDataLimite] = useState('')
    const[isocodetime1, setIsocodetime1] = useState('')
    const[isocodetime2, setIsocodetime2] = useState('')
    const[infoCamp, setInfoCamp] = useState('')
    const[infoJogo, setInfoJogo] = useState('')
    const[infoGroup, setInfoGroup] = useState('')
    const[placar1, setPlacar1] = useState('')
    const[placar2, setPlacar2] = useState('')
    const[gameType, setGameType] = useState('')

    const options = [
        '1',
        '2'
    ]

    const escudos = [
        {img: treze, text: "Treze"},
        {img: campinense, text: "Campinense"},
        {img: atleticopb, text: "Atlético-PB"},
        {img: botafogopb, text: "Botafogo-PB"},
        {img: sousa, text: "Sousa"},
        {img: serrabranca, text: "Serra Branca"},
        {img: nacionalpb, text: "Nacional de Patos"},
        {img: csp, text: "CSP"},
        {img: pombal, text: "Pombal"},
        {img: saopaulopb, text: "São Paulo Crystal"},

    ] 

    useEffect(() => {

        const fetchData = () => {
            
            if (!user) {
                navigate('/login');
            } else {
                get(`api/games/${id}`, setData, setError, setIsFetching);
            }  
        
        };

        fetchData();
    }, [id]);

    useEffect(() => {
        
        if(isFetching) {
            return <Spinner/>
        } 

        if(data) {
            setTime1(data?.time1);
            setTime2(data?.time2);
            setDataLimite(data?.dataLimite);
            setIsocodetime1(data?.isocodetime1);
            setIsocodetime2(data?.isocodetime2);
            setInfoCamp(data?.infoCamp);
            setInfoJogo(data?.infoJogo);
            setInfoGroup(data?.infoGroup);
            setPlacar1(data?.placar1);
            setPlacar2(data?.placar2);
            setGameType(data?.gameType);
        } 

        if(error) {
            console.error('Erro ao buscar dados do jogo:', error);
        }
        
    }, [data, error, isFetching])

    const editarJogo = async (event) => {

        event.preventDefault();
        
        const body = {
            time1, time2, placar1, placar2, dataLimite, isocodetime1, isocodetime2, infoCamp, infoJogo, infoGroup, gameType, 
        }
        
        try{
            put(`api/games/${id}`, body)
        //setJogoAdicionado(true)
            navigate('/admin') 
        } catch (error) {
            console.error('Erro ao editar o jogo', error)
        }
          
        
    };

    return (
        <>
           <Header />
           <section className='formulario-container'>
                <form className='formulario' onSubmit={(event) => editarJogo(event)}>
                    <h2>Preencha os dados para adicionar um novo jogo!</h2>
                    <div className='side-input'>
                        <Campo
                            required={false} 
                            label="Time 1"
                            type='size-input1'
                            placeholder="Nome do time 1"
                            valor={time1 ? time1 : ''}
                            aoAlterado={valor => setTime1(valor)}
                        />
                        <Campo 
                            required={false}
                            label="Time 2"
                            type='size-input1'
                            placeholder="Nome do time 2"
                            valor={time2 ? time2 : ''}
                            aoAlterado={valor => setTime2(valor)}
                        />
                    </div>
                    
                    <div className='side-input'>
                        <ListaSuspensaImg 
                            required={false} 
                            label="Escudo do Time 1" 
                            itens={escudos}
                            valor={isocodetime1 ? isocodetime1 : ''}
                            aoAlterado={valor => setIsocodetime1(valor)}
                        />
                        <ListaSuspensaImg 
                            required={false} 
                            label="Escudo do Time 2" 
                            itens={escudos}
                            valor={isocodetime2 ? isocodetime2 : ''}
                            aoAlterado={valor => setIsocodetime2(valor)}
                        />
                    </div>
                    <div className='side-input'>
                        <Campo 
                            required={false}
                            label="Placar Time 1"
                            placeholder="Placar do time 1"
                            valor={placar1 ? placar1 : ''}
                            type='sizeLimit'
                            aoAlterado={valor => setPlacar1(valor)}
                        />
                        <Campo 
                            required={false}
                            label="Placar Time 2"
                            placeholder="Placar do time 2"
                            valor={placar2 ? placar2 : ''}
                            type='sizeLimit'
                            aoAlterado={valor => setPlacar2(valor)}
                        />
                    </div>
                    <Campo 
                        required={false}
                        label="Informa a competição que esse jogo pertence (Ex: PB24)"
                        placeholder="Competição do jogo"
                        valor={infoCamp ? infoCamp : ''}
                        aoAlterado={valor => setInfoCamp(valor)}
                    />
                    <Campo 
                        required={false}
                        label="Data Limite (Ex: 2022-12-28T09:45:00)"
                        placeholder="Data limite para palpitar num jogo"
                        valor={dataLimite ? dataLimite : ''}
                        aoAlterado={valor => setDataLimite(valor)}
                    />
                    <Campo 
                        required={false}
                        label="Info do Jogo (Ex: SÁB 26/11/2022 AL JANOUB 07:00)"
                        placeholder="Informação sobre o jogo"
                        valor={infoJogo ? infoJogo : ''}
                        aoAlterado={valor => setInfoJogo(valor)}
                    />
                    <Campo 
                        required={false}
                        label="Info sobre a fase do jogo (Ex: Grupo A ou Final)"
                        placeholder="Informação sobre a fase do jogo"
                        valor={infoGroup ? infoGroup : ''}
                        aoAlterado={valor => setInfoGroup(valor)}
                    />
                    <ListaSuspensa 
                        required={false} 
                        label="Tipo de jogo (1 - Normal, 2 - Ponto Duplo)" 
                        itens={options}
                        valor={gameType ? gameType : ''}
                        aoAlterado={valor => setGameType(valor)}
                    />
                    <div className='div1'>
                        <Botao texto='Finalizar edição' />
                    </div>
                    
                </form>
            </section> 
        </>
    )
}

export default EditJogo