import { put, remove } from '../../api'
import './Cards.css'
import { AiFillCloseCircle } from "react-icons/ai"
import { logos, imgDefault } from '../utils/constants'
import { useState } from 'react';
import ModalPopup from '../ModalPopup';
import ListaSuspensaImg from '../ListaSuspensaImg';
import Campo from '../Campo';
import Botao from '../Botao';

function Cards({competicao, setComp, camp}) {

    const[buttonPopup, setButtonPopup] = useState(false);
    const[statusPopup, setStatusPopup] = useState(false);
    const[data, setData] = useState(null)
    const[error, setError] = useState(null)
    const[isFetching, setIsFetching] = useState(false)
    const[ano, setAno] = useState(competicao?.sigla)
    const[img, setImg] = useState(competicao?.img)

    const editarComp = async (event) => {

        event.preventDefault();
        alert("Alterações realizadas com sucesso!")
        setButtonPopup(false)
        
        const body = {
            img, ano
        }
        
        try{
            put(`api/competicoes/${competicao?._id}`, body, setData) 
        } catch (error) {
            console.error('Erro ao editar o usuário', error)
        }
  
    };

    const deletarComp = ((id) => {
        remove(`/api/competicoes/${id}`, setComp, setError, setIsFetching)
    })

    function getRandom() {

        return `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`
    }

    const atualizarComp = async (e) => {
        e.preventDefault()
        alert("Status atualizado com sucesso!")
        setStatusPopup(false)

        const body = {}
        put(`api/competicoes/encerrar/${competicao?._id}`, body, setData)
    }

    return (
        <>
            <div className="comp">
                <AiFillCloseCircle 
                    size={25} 
                    className="deletar" 
                    onClick={() => deletarComp(competicao?._id)}
                />
                <div className="cabecalho" style={{backgroundColor: getRandom()}}> 
                    <img 
                        src={competicao?.img ? competicao?.img : imgDefault} 
                        alt='Imagem do usuário' 
                        style={{
                            width: '12em',
                            height: '12em',
                        }}>
                    </img>
                </div>
                <div className="rodape">
                    <h2>{competicao?.name}</h2>
                    <h5>{competicao?.ano}</h5>
                    <div className='ativa'>
                        {competicao?.ativa ? (<h5 style={{color: '#00FF00'}}>Em andamento</h5>) : (<h5 style={{color: '#FF0000'}}>Finalizada</h5>)}
                    </div>
                    <div className='botao'>
                        <button className='btn btn-block3' onClick={() => setButtonPopup(true)}>
                            Editar competição
                        </button>
                        {competicao?.ativa === true &&
                        <button className='btn btn-block3' onClick={() => setStatusPopup(true)}>
                            Encerrar competição
                        </button>
                        }
                    </div>
                    
                </div>
                
            </div>

            <ModalPopup trigger={buttonPopup} setTrigger={setButtonPopup}>
                <form className='formulario' onSubmit={(event) => editarComp(event)}>
                    <Campo 
                        required
                        label="Ano"
                        type='size-input1'
                        placeholder="Ano da Competição"
                        valor={ano ? ano : ''}
                        aoAlterado={valor => setAno(valor)}
                    />
                    <ListaSuspensaImg 
                        required={false} 
                        label="Logo da Competição" 
                        itens={logos}
                        valor={img ? img : ''}
                        aoAlterado={valor => setImg(valor)}
                    /> 
                    <div className='div1'>
                        <Botao texto='Finalizar edição' />
                    </div>
                </form>
            </ModalPopup>

            <ModalPopup trigger={statusPopup} setTrigger={setStatusPopup}>
                <h2>Tem certeza que deseja encerrar a competição?</h2>
                <div className='div1'>
                    <button className='btn btn-block3' onClick={atualizarComp}>
                        Sim
                    </button>
                </div>
            </ModalPopup>

        </>
    )

}

export default Cards