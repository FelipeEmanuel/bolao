import trofeuOuro from '../../images/Ouro.png'
import trofeuPrata from '../../images/Prata.png'
import trofeuBronze from '../../images/Bronze.png'
import './ConquistaCard.css'

function ConquistaCard({conquista}) {

    return (
        <div className='conquista-card'>
            <div className='conquista-nome'>
                <h2>{conquista.campeonato.name}</h2>
            </div>
            <div className='posicoes'>
                <div className='primeiro'>
                    <img 
                        src={trofeuOuro} 
                        alt='Medalha de ouro' 
                        style={{
                            width: '5em',
                            height: '5em',    
                        }}>
                    </img>
                    <div className='stats'>
                        <h2>{conquista.primeiro}x</h2>
                        <div className='anos'>
                            {conquista?.primeiroAnos?.map((ano, i) => (
                                <span className='primeiro-anos' key={i}>{ano}</span>
                            ))}
                        </div>
                        
                    </div>
                    
                </div>
                <div className='segundo'>
                    <img 
                        src={trofeuPrata} 
                        alt='Medalha de prata' 
                        style={{
                            width: '5em',
                            height: '5em'
                        }}>
                    </img>
                    <div className='stats'>
                        <h2>{conquista.segundo}x</h2>
                        <div className='anos'>
                            {conquista?.segundoAnos?.map((ano, i) => (
                                <span className="segundo-anos" key={i}>{ano}</span>
                            ))}
                        </div>
                    </div>
                </div>
                <div className='terceiro'>
                    <img 
                        src={trofeuBronze} 
                        alt='Medalha de ouro' 
                        style={{
                            width: '5em',
                            height: '5em'
                        }}>
                    </img>
                    <div className='stats'>
                        <h2>{conquista.terceiro}x</h2>
                        <div className='anos'>
                            {conquista?.terceiroAnos?.map((ano, i) => (
                                <span className='terceiro-anos' key={i}>{ano}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            
        </div>
        
    )
}

export default ConquistaCard