import medalhaOuro from '../../images/MedOuro.png'
import medalhaPrata from '../../images/MedPrata.png'
import medalhaBronze from '../../images/MedBronze.png'
import './SemanalCard.css'

function SemanalCard({conquista}) {

    return (
        <div className='conquista-card'>
            <div className='conquista-nome'>
                <h2>Ranking Semanal</h2>
            </div>
            <div className='posicoes'>
                <div className='primeiro'>
                    <img 
                        src={medalhaOuro} 
                        alt='Medalha de ouro' 
                        style={{
                            width: '5em',
                            height: '5em',    
                        }}>
                    </img>
                    <div className='stats'>
                        <h2>{conquista.primeiro}x</h2> 
                    </div>
                    
                </div>
                <div className='segundo'>
                    <img 
                        src={medalhaPrata} 
                        alt='Medalha de prata' 
                        style={{
                            width: '5em',
                            height: '5em'
                        }}>
                    </img>
                    <div className='stats'>
                        <h2>{conquista.segundo}x</h2>
                    </div>
                </div>
                <div className='terceiro'>
                    <img 
                        src={medalhaBronze} 
                        alt='Medalha de ouro' 
                        style={{
                            width: '5em',
                            height: '5em'
                        }}>
                    </img>
                    <div className='stats'>
                        <h2>{conquista.terceiro}x</h2>
                    </div>
                </div>
            </div>
            
        </div>
        
    )
}

export default SemanalCard