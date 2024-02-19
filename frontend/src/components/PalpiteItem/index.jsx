import {useState} from 'react'
import './palpiteItem.css'
import { useEffect } from 'react'
import { toast } from 'react-toastify'
import {post} from '../../api/'


function PalpiteItem({jogo, competicao, palpitou}) {

    const [palpite1, setPalpite1] = useState(jogo?.palpite1)
    const [palpite2, setPalpite2] = useState(jogo?.palpite2)
    const [palpiteRealizado, setPalpiteRealizado] = useState(false)

    useEffect (() => {
        if(jogo?.palpite1 && jogo?.palpite2) {
            setPalpiteRealizado(true)
        }
    })

    const aoPalpitar = ((e) => {
        e.preventDefault()
        
        const body = {
            jogo_id: jogo._id,
            competicao,
            palpite1,
            palpite2, 
        }
        
        if(!palpite1 || !palpite2) {
            toast.error("Não é possível fazer um palpite vazio")
        } else {
            post('api/palpites', body, palpitou)
            setPalpiteRealizado(true)
        }
        
    })

    function onKeyPress1(event) {
        if (!/[0-9]/.test(event.key)) {
            event.preventDefault();          
        }}   

    return (
        <form onSubmit={aoPalpitar}>
            <div className='palpite'>
                <div className='palpite-info'>    
                    {jogo.gameType === 2 ? 
                        <div className='x2'>X2 PONTOS!</div> : 
                    ''}
                </div>
                <h3>{jogo.infoGroup} - {jogo.infoCamp}</h3>
                {jogo.infoJogo}
                    <div className='times'>
                        <div className='time1'>
                            <img 
                                src={jogo.isocodetime1} 
                                alt='Escudo Time 1' 
                                style={{
                                    width: '2em',
                                    height: '2em'
                                }}>
                            </img>
                            <h2>{jogo.time1}</h2>
                            <input type="text" className="placar" id="palpite1" 
                                name="palpite1" value={palpite1} onChange={(e) => setPalpite1(e.target.value)}
                                onKeyPress={(e) => onKeyPress1(e)}
                            />
                        </div>
                            <h2 className='h2test'>x</h2>
                        <div className='time2'>
                            <input type="text" className="placar" id="palpite2" 
                                name="palpite2" value={palpite2} onChange={(e) => setPalpite2(e.target.value)}
                                onKeyPress={(e) => onKeyPress1(e)}/>
                            <h2>{jogo.time2}</h2>
                            <img 
                                src={jogo.isocodetime2} 
                                alt='Escudo Time 2' 
                                style={{
                                    width: '2em',
                                    height: '2em'
                                }}>
                            </img>
                        </div>
                    </div>
            
                <button className='btn btn-block2'>Confirmar palpite</button>
                {palpiteRealizado &&
                <div>
                    <span className='alert-success'>Palpite Realizado!</span>
                </div>}
            </div>
        </form>
        
        
    )
}

export default PalpiteItem