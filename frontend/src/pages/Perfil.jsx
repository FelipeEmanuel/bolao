import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import ModalPopup from "../components/ModalPopup"
import Header from "../components/Header/Header"
import Botao from "../components/Botao"
import ListaSuspensaImg from "../components/ListaSuspensaImg"
import { get, put } from "../api"
import { imgDefault } from '../components/utils/constants'
import Spinner from "../components/Spinner/Spinner"
import Campo from "../components/Campo"
import { escudos } from "../components/utils/constants"

function Perfil() {

    const navigate = useNavigate()
    const user = JSON.parse(localStorage.getItem('user'))
    const[buttonPopup, setButtonPopup] = useState(false);
    const[data, setData] = useState(null)
    const[error, setError] = useState(null)
    const[isFetching, setIsFetching] = useState(false)
    const[email, setEmail] = useState('')
    const[name, setName] = useState('')
    const[imgPerfil, setImgPerfil] = useState('')

    useEffect(() => {
        
        const fetchData = () => {
            
            if (!user) {
                navigate('/login');
            } else {
                get(`api/users/me`, setData, setError, setIsFetching);
            }  
        
        };

        fetchData(); 
    
    }, [])

    useEffect(() => {

        console.log(data)
        if(isFetching) {
            return <Spinner/>
        } 

        if(data) {
            setImgPerfil(data?.imgPerfil);
            setName(data?.name);
            setEmail(data?.email);   
        } 

        if(error) {
            console.error('Erro ao buscar dados do jogo:', error);
        }
        
    }, [data, error, isFetching])


    const editarImagem = async (event) => {

        event.preventDefault();
        alert("Alterações realizadas com sucesso!")
        setButtonPopup(false)
        
        const body = {
            imgPerfil, name, email 
        }
        
        try{
            put(`api/users/${data?._id}`, body, setData) 
        //setJogoAdicionado(true) 
        } catch (error) {
            console.error('Erro ao editar o usuário', error)
        }
  
    };

    /*

                    */


    return (
        <>
            <Header/>
            <h1>Olá, {data?.name}! Estes são seus dados e suas conquistas!</h1>
            <div className="perfilMain">
                <div className='perfil'>
                        <div className='perfilimagem'>
                            <img 
                                src={data?.imgPerfil ? data?.imgPerfil : imgDefault} 
                                alt='Imagem do usuário' 
                                style={{
                                    width: '7em',
                                    height: '7em'
                                }}>
                            </img>
                            <button className='button-imagem' onClick={() => setButtonPopup(true)}>
                                Editar perfil
                            </button>
                            
                        </div>
                        
                        <div className='perfilNome'>
                                <p>Nome</p>
                                <h2>{data?.name}</h2>
                                
                            </div>
                            <div className='perfilEmail'>
                                <p>Email</p>
                                <h3>{data?.email}</h3>
                            </div>   
                </div>
                <div>
                    <h2>Em breve!</h2>
                </div> 
            </div>
            
            <ModalPopup trigger={buttonPopup} setTrigger={setButtonPopup}>
                <form className='formulario' onSubmit={(event) => editarImagem(event)}>
                    <h3>Escolha um time para sua imagem de perfil!</h3>
                        <ListaSuspensaImg 
                            required={false} 
                            label="Imagem do Perfil" 
                            itens={escudos}
                            valor={imgPerfil ? imgPerfil : ''}
                            aoAlterado={valor => setImgPerfil(valor)}
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
                        label="Alterar email"
                        type='size-input1'
                        placeholder="Alterar email"
                        valor={email ? email : ""}
                        aoAlterado={valor => setEmail(valor)}
                    />
                    <div className='div1'>
                        <Botao texto='Finalizar edição' />
                    </div>
                </form>
            </ModalPopup>
        </>
        
    )
}

export default Perfil