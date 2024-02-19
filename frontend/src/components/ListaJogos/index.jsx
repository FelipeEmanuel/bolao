import './ListaJogos.css'
import {MdOutlineDelete, MdEdit} from 'react-icons/md'
import { remove } from '../../api'
import { Link } from 'react-router-dom'

function ListaJogos({jogo}) {

    const deletarJogo = ((id) => {
        remove(`/api/games/${id}`)
        window.location.reload();
    })


    return (
        <div className='jogos'>
            <div className='top'>
                <Link to={`/${jogo._id}`}>
                    <MdEdit />
                </Link>
                <Link onClick={() => deletarJogo(jogo._id)}>
                    <MdOutlineDelete />  
                </Link>
                
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
                </div>
                    <h2 className='h2test'>{jogo.placar1} x {jogo.placar2}</h2>
                <div className='time2'>
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
            
                
            
        
        </div>
    )
}

export default ListaJogos