import {useState, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import {toast} from 'react-toastify'
import {FaUser} from 'react-icons/fa'
import {register} from '../features/auth/authService'
import Spinner from '../components/Spinner/Spinner'
import Header from '../components/Header/Header'

function Register() {

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
  })

  const {name, email, password, password2} = formData

  const navigate = useNavigate()

  const user = JSON.parse(localStorage.getItem('user'))

  useEffect(() => {
    if(user) {
      navigate('/')
    }

  }, [user, navigate])

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }))
  }

  const onSubmit = (e) => {
    e.preventDefault()

    if (password !== password2) {
      toast.error('Senhas diferentes!')
    } else {
      const userData = {
        name,
        email,
        password,
      }

      register(userData)
      alert('Usuário cadastrado com sucesso')
      navigate('/')
    }
  }

  /*if (isLoading) {
    return <Spinner />
  }*/
  
  return (
    <>
      <Header />
      <section className='heading'>
        <h1>
          <FaUser /> Cadastre-se
        </h1>
        <p>Crie uma conta!</p>
      </section>

      <section className="form">
        <form onSubmit={onSubmit}>
          <div className='form-group'>
            <input type="text" className="form-control" id="name" 
            name="name" value={name} placeholder='Coloque seu nome'
            onChange={onChange}
            />
          </div>
          <div className='form-group'>
            <input type="email" className="form-control" id="email" 
            name="email" value={email} placeholder='Coloque seu e-mail'
            onChange={onChange}
            />
          </div>
          <div className='form-group'>
            <input type="password" className="form-control" id="password" 
            name="password" value={password} placeholder='Coloque sua senha'
            onChange={onChange}
            />
          </div>
          <div className='form-group'>
            <input type="password" className="form-control" id="password2" 
            name="password2" value={password2} placeholder='Confirme sua senha'
            onChange={onChange}
            />
          </div>
          <div className='form-group'>
            <button type='submit' className='btn btn-block'>
              Cadastrar
            </button>
          </div>
        </form>
      </section>
    </>
  )
}

export default Register