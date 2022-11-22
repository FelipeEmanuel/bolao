import {useState} from 'react'
import { useDispatch } from 'react-redux'
import './palpiteItem.css'
import {doPalpite} from '../../features/palpites/palpiteSlice'
import { useEffect } from 'react'
import ReactCountryFlag from 'react-country-flag'
import { toast } from 'react-toastify'


function PalpiteItem({jogo}) {

    const [palpite1, setPalpite1] = useState('')
    const [palpite2, setPalpite2] = useState('')
    const dispatch = useDispatch()

    const aoPalpitar = ((e) => {
        e.preventDefault()
        
        const body = {
            jogo_id: jogo._id,
            palpite1,
            palpite2, 
        }
        
        if(!palpite1 || !palpite2) {
            toast.error("Não é possível fazer um palpite vazio")
        } else {
            dispatch(doPalpite(body))
        }
        
    })

    /*useEffect(() => {
        palpites.forEach(palpite => {
            if(jogo._id === palpite.jogo._id) {
                setPalpite1(palpite.palpite1)
                setPalpite2(palpite.palpite2)
            }
        })
        
    }, [jogo, palpites])*/

    function refreshPage() {
        window.location.reload(false);
    }

    function onKeyPress1(event) {
            if (!/[0-9]/.test(event.key)) {
              event.preventDefault();          
          }}   


    return (
        <form onSubmit={aoPalpitar}>
            <div className='palpite'>
                <div>
                    <h3>{jogo.infoGroup}</h3>
                    {jogo.infoJogo}
                </div>
                    <div className='times'>
                        <div className='time1'>
                            <ReactCountryFlag countryCode={jogo.isocodetime1} svg style={{
                                width: '2em',
                                height: '2em',
                            }}/>
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
                            <ReactCountryFlag countryCode={jogo.isocodetime2} svg style={{
                                width: '2em',
                                height: '2em',
                            }}/>
                        </div>
                    </div>
            
                <button className='btn btn-block2' onClick={refreshPage}>Confirmar palpite</button>
            </div>
        </form>
        
        
    )
}

export default PalpiteItem