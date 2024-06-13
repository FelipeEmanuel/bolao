import { useState, useEffect } from 'react'
import { FaSignInAlt } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { login } from '../features/auth/authService'
import Spinner from '../components/Spinner/Spinner'
import Header from '../components/Header/Header'


function Login() {

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const { email, password } = formData

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
    e.preventDefault();
    
    const userData = {
      email,
      password,
    };

    login(userData)
      .then((response) => {
        if(response.data) {
          alert('Login efetuado com sucesso!')
          localStorage.setItem("user", JSON.stringify(response.data));
          navigate("/");
        } else {
          alert('Dados incorretos!')
        }
      })
      .catch((error) => {
        alert('Dados incorretos!')
      });
    
  }

  return (
    <>
      <Header />
      <section className='heading'>
        <h1>
          <FaSignInAlt /> Login
        </h1>
        <p>Faça login e comece a palpitar!</p>
      </section>

      <section className='form'>
        <form onSubmit={onSubmit}>
          <div className='form-group'>
            <input
              type='email'
              className='form-control'
              id='email'
              name='email'
              value={email}
              placeholder='Coloque seu email'
              onChange={onChange}
            />
          </div>
          <div className='form-group'>
            <input
              type='password'
              className='form-control'
              id='password'
              name='password'
              value={password}
              placeholder='Coloque sua senha'
              onChange={onChange}
            />
          </div>

          <div className='form-group'>
            <button type='submit' className='btn btn-block'>
              Entrar
            </button>
          </div>
        </form>
      </section>
    </>
  )
}

export default Login