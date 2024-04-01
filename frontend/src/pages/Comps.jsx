import { useNavigate } from "react-router-dom"
import Header from "../components/Header/Header"
import { useEffect, useState } from "react"
import { get, post } from "../api"
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
    const[ano, setAno] = useState('')
    const[name, setName] = useState('')
    const[img, setImg] = useState('')
    const[campeonato, setCampeonato] = useState(null)
    const[isFetching, setIsFetching] = useState(true)
    const[buttonPopup, setButtonPopup] = useState(false);
    const[campData, setCampData] = useState(null)
    const[campError, setCampError] = useState(null)
    const[campIsFetching, setCampIsFetching] = useState(true)
    

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

    useEffect(() => {
        get("api/campeonatos", setCampData, setCampError, setCampIsFetching)
    }, [])

    if(isFetching || campIsFetching) {
        return <Spinner />
    }

    const criarComp = async (e) => {
        e.preventDefault()
        alert("Competição criada com sucesso!")
        setButtonPopup(false)
        
        const body = {
            name, ano, campeonato, img,
        }

        try{
            if(!name || !ano || !campeonato) {
                toast.error("Preencha todos os campos")
            } else {
                post('api/competicoes', body, setData)
                setAno('')
                setImg('')
                setName('')
                setCampeonato('')
            }
        } catch (error) {
            console.error('Erro ao editar o usuário', error)
        } 
    }

    function organizaCampeonato(value) {
        setCampeonato(value)
        campData.forEach(e => {
            if(e._id === value) {
                setName(e.name)
            }
        });
        
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
                        comp.ativa === true &&
                        <Cards key={comp._id} competicao={comp} setComp={setData} campeonato={campeonato}/>
                    ))
                    }           
        </div>

        <ModalPopup trigger={buttonPopup} setTrigger={setButtonPopup}>
                <form className='formulario' onSubmit={(event) => criarComp(event)}> 
                    <div className="lista-suspensa">
                        <label>Campeonato</label>
                        <select required={true} value={campeonato} onChange={evento => organizaCampeonato(evento.target.value)} >
                            <option />
                            {campData?.map(campeonato => {
                                return <option key={campeonato?._id} value={campeonato?._id}>{campeonato?.name}</option>
                            })}    
                        </select>
                    </div>
                    <Campo 
                        required
                        label="Ano"
                        type='size-input1'
                        placeholder="Ano da Competição"
                        valor={ano}
                        aoAlterado={valor => setAno(valor)}
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