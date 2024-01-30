import { put, remove } from '../../api'
import './Cards.css'
import { AiFillCloseCircle } from "react-icons/ai"
import { logos, imgDefault } from '../utils/constants'
import { useState } from 'react';
import ModalPopup from '../ModalPopup';
import ListaSuspensaImg from '../ListaSuspensaImg';
import Campo from '../Campo';
import Botao from '../Botao';
function Cards({competicao, setComp}) {

    const[buttonPopup, setButtonPopup] = useState(false);
    const[data, setData] = useState(null)
    const[error, setError] = useState(null)
    const[isFetching, setIsFetching] = useState(false)
    const[sigla, setSigla] = useState(competicao?.sigla)
    const[name, setName] = useState(competicao?.name)
    const[img, setImg] = useState(competicao?.img)
    const[ativa, setAtiva] = useState(competicao?.ativa)

    const editarComp = async (event) => {

        event.preventDefault();
        alert("Alterações realizadas com sucesso!")
        setButtonPopup(false)
        
        const body = {
            img, name, sigla
        }
        
        try{
            put(`api/competicoes/${competicao?._id}`, body, setData) 
        //setJogoAdicionado(true) 
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

    const editPontuacao = ((e) => {
        //e.preventDefault()
        alert("Pontuação atualizada com sucesso!")

        const body = {}

        put(`api/ranking/setPontuacao/${competicao?._id}`, body, setData)
    })

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
                    <h5>{competicao?.sigla}</h5>
                    <div className='ativa'>
                        {competicao?.ativa ? (<h5 style={{color: '#00FF00'}}>Em andamento</h5>) : (<h5 style={{color: '#FF0000'}}>Finalizada</h5>)}
                    </div>
                    <div className='botao'>
                        <button className='btn btn-block3' onClick={() => setButtonPopup(true)}>
                            Editar competição
                        </button>
                        <button className='btn btn-block3' onClick={editPontuacao}>
                            Atualizar pontuação
                        </button>
                    </div>
                    
                </div>
                
            </div>

            <ModalPopup trigger={buttonPopup} setTrigger={setButtonPopup}>
            <form className='formulario' onSubmit={(event) => editarComp(event)}>
                <h3>Escolha um logo para a imagem do campeonato!</h3>
                    <ListaSuspensaImg 
                        required={false} 
                        label="Logo da Competição" 
                        itens={logos}
                        valor={img ? img : ''}
                        aoAlterado={valor => setImg(valor)}
                    /> 
                <Campo 
                    required
                    label="Alterar nome"
                    type='size-input1'
                    placeholder="Alterar nome"
                    valor={name ? name : ""}
                    aoAlterado={valor => setName(valor)}
                />
                <Campo 
                    required
                    label="Alterar sigla"
                    type='size-input1'
                    placeholder="Alterar sigla"
                    valor={sigla ? sigla : ""}
                    aoAlterado={valor => setSigla(valor)}
                />
                <div className='div1'>
                    <Botao texto='Finalizar edição' />
                </div>
            </form>
            </ModalPopup>

        </>
    )

}

export default Cards