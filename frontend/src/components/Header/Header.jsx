import {FaSignInAlt, FaSignOutAlt, FaUser, FaListOl} from 'react-icons/fa'
import { AiOutlineUser } from 'react-icons/ai'
import {Link, useNavigate} from 'react-router-dom'
import { logout } from '../../features/auth/authService'

function Header() {

    const navigate = useNavigate()
    const user = JSON.parse(localStorage.getItem('user'))

    const onLogout = () => {
        logout()
        navigate('/')
    }

    return (
          <>
            {user ? (
                <>
                {user.role === 'user' ? (<header className='header'>
                    <div className='logo'>
                      <Link to='/'>Palpites</Link>
                    </div>
                    <ul>
                      <li>
                        <Link to='/user'>
                          <AiOutlineUser /> Perfil
                        </Link>
                      </li>
                      <li>
                        <Link to='/ranking'>
                            <FaListOl /> Ranking
                        </Link>
                      </li>
                      <li>
                        <button className='btn' onClick={onLogout}>
                        <FaSignOutAlt /> Sair
                        </button>
                      </li>
                    </ul>
                  </header>) 
                  : (<header className='header'>
                  <div className='logo'>
                    <ul>
                      <li>
                        <Link to='/'>Palpites</Link>
                      </li>
                      <li>
                        <Link to='/admin'>Jogos</Link>
                      </li>
                    </ul>
                    
                  </div>
                  <div>
                    
                  </div>
                  
                  <ul>
                    <li>
                      <Link to='/ranking'>
                          <FaListOl /> Ranking
                      </Link>
                    </li>
                    <li>
                      <button className='btn' onClick={onLogout}>
                      <FaSignOutAlt /> Sair
                      </button>
                    </li>
                  </ul>
                </header>)}
                  
                </>
            ) : (
              <>
              <header className='header'>
                <div className='logo'>
                </div>
                <ul>
                  <li>
                    <Link to='/login'>
                      <FaSignInAlt /> Login
                    </Link>
                  </li>
                  <li>
                    <Link to='/cadastrar'>
                      <FaUser /> Cadastrar
                    </Link>
                  </li>
                </ul>
              </header>
              </>
            )}
          
          </>
      )
}

export default Header