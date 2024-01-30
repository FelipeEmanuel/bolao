import { Link } from 'react-router-dom'
import './CardsRanking.css'
import { imgDefault } from '../utils/constants'

function CardsRanking({competicao}) {

    function getRandom() {

        return `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`
    }

    return (
        <div className="comp">
            <div className="cabecalho" style={{backgroundColor: getRandom()}}> 
                <img 
                    src={competicao?.img ? competicao?.img : imgDefault} 
                    alt='Imagem do usuário' 
                    style={{
                        width: '12em',
                        height: '12em'
                    }}>
                </img>
            </div>
            <div className="rodape">
                <h2>{competicao.name}</h2>
                <h5>{competicao.sigla}</h5>
                <div className="botao">
                    <Link to={`/getPontuacao/${competicao._id}`}>
                        <button className='btn btn-block3'>
                        Ver Ranking</button>
                    </Link>
                </div>
            </div>
            
        </div>
        
    )

}

export default CardsRanking