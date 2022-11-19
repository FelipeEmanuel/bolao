import {useState} from 'react'
import { useDispatch } from 'react-redux'
import './palpiteItem.css'
import {doPalpite} from '../../features/palpites/palpiteSlice'
import { useEffect } from 'react'


function PalpiteItem({jogo, palpites}) {

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
        
        dispatch(doPalpite(body))
        console.log(palpite1)
        console.log(palpite2)
    })

    useEffect(() => {
        palpites.forEach(palpite => {
            if(jogo._id === palpite.jogo._id) {
                setPalpite1(palpite.palpite1)
                setPalpite2(palpite.palpite2)
            }
        })
        
    }, [jogo, palpites])

    return (
        <form onSubmit={aoPalpitar}>
            <div className='palpite'>
                <div>
                    {jogo.dataLimite}
                </div>
                    <div className='times'>
                        <div className='time1'>
                            <h2>{jogo.time1}</h2>
                            <input type="text" className="placar" id="palpite1" 
                            name="palpite1" value={palpite1} onChange={(e) => setPalpite1(e.target.value)}/>
                        </div>
                            <h2 className='h2test'>x</h2>
                        <div className='time2'>
                            <input type="text" className="placar" id="palpite2" 
                            name="palpite2" value={palpite2} onChange={(e) => setPalpite2(e.target.value)}/>
                            <h2>{jogo.time2}</h2>
                        </div>
                    </div>
            
                <button className=''>Confirmar palpite</button>
            </div>
        </form>
        
        
    )
}

export default PalpiteItem