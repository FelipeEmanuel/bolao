import ReactCountryFlag from 'react-country-flag'
import './ListaJogos.css'
import {MdOutlineDelete, MdEdit} from 'react-icons/md'
import { remove, put } from '../../api'
import { useNavigate, Link } from 'react-router-dom'

function ListaJogos({jogo}) {
    const navigate = useNavigate()

    const deletarJogo = ((id) => {
        remove(`/api/games/${id}`)
        window.location.reload();
    })


    return (
        <div className='jogos'>
            <div className='top'>
                <Link to={`/${jogo._id}`}>
                    <button className='editar'>
                        <MdEdit />
                    </button>
                </Link>
                
                <button className='deletar' onClick={() => deletarJogo(jogo._id)}>
                    <MdOutlineDelete />
                </button>   
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