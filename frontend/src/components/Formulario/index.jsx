import './Formulario.css'
import { useEffect, useState } from 'react'
import Campo from '../Campo'
import Botao from '../Botao'
import ListaSuspensa from '../ListaSuspensa'
import ListaSuspensaImg from '../ListaSuspensaImg'
import { toast } from 'react-toastify'
import { get, post } from '../../api'
import { useNavigate } from 'react-router-dom'
import treze from '../../images/logo-treze-de-campina-grande-256.png'
import campinense from '../../images/logo-campinense-256.png'
import serrabranca from '../../images/logo-serra-branca.png'
import botafogopb from '../../images/logo-botafogo-pb.png'
import atleticopb from '../../images/logo-atletico-pb.png'
import sousa from '../../images/logo-sousa-pb-256.png'
import nacionalpb from '../../images/logo-nacional-de-patos-pb.png'
import csp from '../../images/logo-csp.png'
import pombal from '../../images/logo-pombal.png'
import saopaulopb from '../../images/logo-sao-paulo-crystal.png'

const Formulario = () => {

    /*const[data, setData] = useState(null)
    const[error, setError] = useState(null)
    const[isFetching, setIsFetching] = useState(false)
    const[competicao, setCompeticao] = useState(null)*/
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
    //const[jogoAdicionado, setJogoAdicionado] = useState(false)
    const navigate = useNavigate()

    //let competicoes = []

    /*useEffect(() => {
        get("api/competicoes", setData, setError, setIsFetching).then((response) => {
            console.log(response);
            const competicoes = response.data.map((c) => ({
                nome: c.name,
                id: c._id
            }));

            setCompeticao({competicoes});
        });
        //console.log(data)
    })

    //console.log(data)

    
    /*data?.forEach(x => {
        competicoes.push({id: x._id, nome: x.name})
    })

    console.log(competicoes)*/

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

    const adicionarJogo = ((e) => {
        e.preventDefault()
        
        const body = {
            time1, time2, placar1, placar2, dataLimite, isocodetime1, isocodetime2, infoCamp, infoJogo, infoGroup, gameType, 
        }
        
        if(!time1 || !time2 || !dataLimite || !isocodetime1 || !isocodetime2 || !infoCamp || !infoJogo || !infoGroup || !gameType) {
            toast.error("Preencha todos os campos")
        } else {
            post('api/games', body)
            //setJogoAdicionado(true)
            navigate('/admin')
        }
        
    })


    return (
        <section className='formulario-container'>
            <form className='formulario' onSubmit={adicionarJogo}>
                <h2>Preencha os dados para adicionar um novo jogo!</h2>
                <div className='side-input'>
                    <Campo 
                        required
                        label="Time 1"
                        type='size-input1'
                        placeholder="Nome do time 1"
                        valor={time1}
                        aoAlterado={valor => setTime1(valor)}
                    />
                    <Campo 
                        required
                        label="Time 2"
                        type='size-input1'
                        placeholder="Nome do time 2"
                        valor={time2}
                        aoAlterado={valor => setTime2(valor)}
                    />
                </div>
                <div className='side-input'>
                    <ListaSuspensaImg 
                        required 
                        label="Escudo do Time 1" 
                        itens={escudos}
                        valor={isocodetime1}
                        aoAlterado={valor => setIsocodetime1(valor)}
                    />
                    <ListaSuspensaImg 
                        required 
                        label="Escudo do Time 2" 
                        itens={escudos}
                        valor={isocodetime2}
                        aoAlterado={valor => setIsocodetime2(valor)}
                    />
                </div>
                <div className='side-input'>
                    <Campo 
                        required={false}
                        label="Placar Time 1"
                        placeholder="Placar do time 1"
                        valor={placar1}
                        type='sizeLimit'
                        aoAlterado={valor => setPlacar1(valor)}
                    />
                    <Campo 
                        required={false}
                        label="Placar Time 2"
                        placeholder="Placar do time 2"
                        valor={placar2}
                        type='sizeLimit'
                        aoAlterado={valor => setPlacar2(valor)}
                    />
                </div>
                <Campo 
                    required
                    label="Informa a competição que esse jogo pertence (Ex: PB24)"
                    placeholder="Competição do jogo"
                    valor={infoCamp}
                    aoAlterado={valor => setInfoCamp(valor)}
                />
                <Campo 
                    required
                    label="Data Limite (Ex: 2022-12-28T09:45:00)"
                    placeholder="Data limite para palpitar num jogo"
                    valor={dataLimite}
                    aoAlterado={valor => setDataLimite(valor)}
                />
                <Campo 
                    required
                    label="Info do Jogo (Ex: SÁB 26/11/2022 AL JANOUB 07:00)"
                    placeholder="Informação sobre o jogo"
                    valor={infoJogo}
                    aoAlterado={valor => setInfoJogo(valor)}
                />
                <Campo 
                    required
                    label="Info sobre a fase do jogo (Ex: Grupo A ou Final)"
                    placeholder="Informação sobre a fase do jogo"
                    valor={infoGroup}
                    aoAlterado={valor => setInfoGroup(valor)}
                />
                <ListaSuspensa 
                    required 
                    label="Tipo de jogo (1 - Normal, 2 - Ponto Duplo)" 
                    itens={options}
                    valor={gameType}
                    aoAlterado={valor => setGameType(valor)}
                />
                <div className='div1'>
                    <Botao texto='Adicionar novo jogo' />
                </div>
                
            </form>
        </section>
    )
}

export default Formulario