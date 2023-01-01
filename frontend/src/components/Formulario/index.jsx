import './Formulario.css'
import { useState } from 'react'
import Campo from '../Campo'
import Botao from '../Botao'
import ListaSuspensa from '../ListaSuspensa'
import { toast } from 'react-toastify'
import { post } from '../../api'
import { useNavigate } from 'react-router-dom'

const Formulario = () => {

    const[time1, setTime1] = useState('')
    const[time2, setTime2] = useState('')
    const[dataLimite, setDataLimite] = useState('')
    const[isocodetime1, setIsocodetime1] = useState('')
    const[isocodetime2, setIsocodetime2] = useState('')
    const[infoJogo, setInfoJogo] = useState('')
    const[infoGroup, setInfoGroup] = useState('')
    const[placar1, setPlacar1] = useState('')
    const[placar2, setPlacar2] = useState('')
    const[gameType, setGameType] = useState('')
    //const[jogoAdicionado, setJogoAdicionado] = useState(false)
    const navigate = useNavigate()


    const options = [
        '1',
        '2'
    ]

    const adicionarJogo = ((e) => {
        e.preventDefault()
        
        const body = {
            time1, time2, placar1, placar2, dataLimite, isocodetime1, isocodetime2, infoJogo, infoGroup, gameType, 
        }
        
        if(!time1 || !time2 || !dataLimite || !isocodetime1 || !isocodetime2 || !infoJogo || !infoGroup || !gameType) {
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
                    <Campo 
                        required
                        label="IsoCode Time 1"
                        placeholder="IsoCode do time 1"
                        valor={isocodetime1}
                        type='sizeLimit'
                        aoAlterado={valor => setIsocodetime1(valor)}
                    />
                    <Campo 
                        required
                        label="IsoCode Time 2"
                        placeholder="IsoCode do time 2"
                        valor={isocodetime2}
                        type='sizeLimit'
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