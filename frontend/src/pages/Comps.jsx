import { useNavigate } from "react-router-dom"
import Header from "../components/Header/Header"
import { useEffect, useState } from "react"
import { get, post, put } from "../api"
import Cards from "../components/Cards"
import ModalPopup from "../components/ModalPopup"
import { toast } from "react-toastify"
import Botao from "../components/Botao"
import Campo from "../components/Campo"
import Spinner from "../components/Spinner/Spinner"
import { logos } from "../components/utils/constants"
import ListaSuspensaImg from "../components/ListaSuspensaImg"

function Comps() {

    const user = localStorage.getItem('user')
    const navigate = useNavigate()
    const[data, setData] = useState(null)
    const[error, setError] = useState(null)
    const[sigla, setSigla] = useState('')
    const[name, setName] = useState('')
    const[img, setImg] = useState('')
    const[isFetching, setIsFetching] = useState(false)
    const[buttonPopup, setButtonPopup] = useState(false);
    

    useEffect(() => {
        if(!user) {
            navigate('/login')
        }

        /*if(user.role != "admin") {
            navigate('/')
        }*/


    }, [user, navigate])

    useEffect(() => {
        get("api/competicoes", setData, setError, setIsFetching)
    }, [])

    if(isFetching) {
        return <Spinner />
    }

    const criarComp = async (e) => {
        e.preventDefault()
        alert("Competição criada com sucesso!")
        setButtonPopup(false)
        
        const body = {
            name, sigla, img
        }

        try{
            if(!name || !sigla) {
                toast.error("Preencha todos os campos")
            } else {
                post('api/competicoes', body, setData)
                
            }
        } catch (error) {
            console.error('Erro ao editar o usuário', error)
        } 
    }

    

    return (
        <>
        <Header/>
        <div className='div1'>
                <button className='btn btn-block3' onClick={() => setButtonPopup(true)}>Adicionar nova competição</button>

        </div> 
         
        <div className='lista-comps'>
                    { 
                    data?.map((comp) => (
                        <Cards key={comp._id} competicao={comp} setComp={setData}/>
                    ))
                    }           
        </div>

        <ModalPopup trigger={buttonPopup} setTrigger={setButtonPopup}>
                <form className='formulario' onSubmit={(event) => criarComp(event)}> 
                    <Campo 
                        required
                        label="Nome"
                        type='size-input1'
                        placeholder="Nome da competição"
                        valor={name}
                        aoAlterado={valor => setName(valor)}
                    />
                    <Campo 
                        required
                        label="Sigla"
                        type='size-input1'
                        placeholder="Sigla da Competição"
                        valor={sigla}
                        aoAlterado={valor => setSigla(valor)}
                    />
                    <ListaSuspensaImg 
                        required={false} 
                        label="Logo da Competição" 
                        itens={logos}
                        valor={img}
                        aoAlterado={valor => setImg(valor)}
                    /> 
                    <div className='div1'>
                        <Botao texto='Criar competição' />
                    </div>
                </form>
        </ModalPopup>

        
        </>
        
    )

}

export default Comps