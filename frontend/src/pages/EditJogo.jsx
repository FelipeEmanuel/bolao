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
import flamengo from '../images/logo-flamengo-256.png'
import fluminense from '../images/logo-fluminense-256.png'
import vasco from '../images/logo-vasco-da-gama-256.png'
import botafogo from '../images/logo-botafogo-256.png'
import madureira from '../images/logo-madureira-256.png'
import boavista from '../images/logo-boavista-rj-256.png'
import novaiguacu from '../images/logo-nova-iguacu-256.png'
import audaxrj from '../images/logo-audax.png'
import bangu from '../images/logo-bangu-256.png'
import sampaio from '../images/logo-sampaio-correa.png'
import voltaredonda from '../images/logo-volta-redonda-256.png'
import portuguesarj from '../images/logo-portuguesa-rj-256.png'
import palmeiras from '../images/logo-palmeiras-256.png'
import corinthians from '../images/logo-corinthians-256.png'
import santos from '../images/logo-santos-256.png'
import saopaulo from '../images/logo-sao-paulo-256.png'
import guarani from '../images/logo-guarani-256.png'
import pontepreta from '../images/logo-ponte-preta-256.png'
import bragantino from '../images/logo-red-bull-bragantino-256.png'
import aguasanta from '../images/logo-agua-santa-256.png'
import novorizontino from '../images/logo-novorizontino.png'
import santoandre from '../images/logo-santo-andre-256.png'
import saobernardo from '../images/logo-sao-bernardo-256.png'
import interlimeira from '../images/logo-inter-limeira.png'
import portuguesasp from '../images/logo-portuguesa-sp.png'
import mirassol from '../images/logo-mirassol-atualizado-256.png'
import ituano from '../images/logo-ituano-256.png'
import botafogosp from '../images/logo-botafogo-sp-256.png'
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
        {img: aguasanta, text: "Água Santa"},
        {img: atleticopb, text: "Atlético-PB"},
        {img: audaxrj, text: "Audax-RJ"},
        {img: bangu, text: "Bangu"},
        {img: boavista, text: "Boa Vista-RJ"},
        {img: botafogopb, text: "Botafogo-PB"},
        {img: botafogo, text: "Botafogo-RJ"},
        {img: botafogosp, text: "Botafogo-SP"},
        {img: campinense, text: "Campinense"},
        {img: corinthians, text: "Corinthians"},
        {img: csp, text: "CSP"},
        {img: flamengo, text: "Flamengo"},
        {img: fluminense, text: "Fluminense"},
        {img: guarani, text: "Guarani"},
        {img: interlimeira, text: "Inter de Limeira"},
        {img: ituano, text: "Ituano"},
        {img: madureira, text: "Madureira"},
        {img: mirassol, text: "Mirassol"},
        {img: nacionalpb, text: "Nacional de Patos"},
        {img: novaiguacu, text: "Nova Iguaçu"},
        {img: novorizontino, text: "Novorizontino"},
        {img: palmeiras, text: "Palmeiras"},
        {img: pombal, text: "Pombal"},
        {img: pontepreta, text: "Ponte Preta"},
        {img: portuguesarj, text: "Portuguesa-RJ"},
        {img: portuguesasp, text: "Portuguesa-SP"},
        {img: bragantino, text: "RB Bragantino"},
        {img: santoandre, text: "Santo André"},
        {img: santos, text: "Santos"},
        {img: saobernardo, text: "São Bernardo"},
        {img: saopaulo, text: "São Paulo"},
        {img: saopaulopb, text: "São Paulo Crystal"},
        {img: sampaio, text: "Sampaio Corrêa-RJ"},
        {img: serrabranca, text: "Serra Branca"},
        {img: sousa, text: "Sousa"},
        {img: treze, text: "Treze"},
        {img: vasco, text: "Vasco"},
        {img: voltaredonda, text: "Volta Redonda"},

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