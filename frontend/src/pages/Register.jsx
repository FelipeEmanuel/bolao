import {useState, useEffect} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {useNavigate} from 'react-router-dom'
import {toast} from 'react-toastify'
import {FaUser} from 'react-icons/fa'
import {register, reset} from '../features/auth/authSlice'
import Spinner from '../components/Spinner'

function Register() {

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
  })

  const {name, email, password, password2} = formData

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  )

  useEffect(() => {
    if (isError) {
      toast.error(message)
    }

    if (isSuccess || user) {
      navigate('/')
    }

    dispatch(reset())
  }, [user, isError, isSuccess, message, navigate, dispatch])

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

      dispatch(register(userData))
    }
  }

  if (isLoading) {
    return <Spinner />
  }
  
  return (
    <>
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