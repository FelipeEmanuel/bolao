import {FaSignInAlt, FaSignOutAlt, FaUser, FaListOl} from 'react-icons/fa'
import {Link, useNavigate} from 'react-router-dom'
import {useSelector, useDispatch} from 'react-redux'
import {logout, reset} from '../features/auth/authSlice'

function Header() {

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {user} = useSelector((state) => state.auth) 

    const onLogout = () => {
        dispatch(logout())
        dispatch(reset())
        navigate('/')
    }

    return (
        <header className='header'>
          <div className='logo'>
            <Link to='/'>Bolão da Copa</Link>
          </div>
          <ul>
            {user ? (
                <>
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
                </>
            ) : (
              <>
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
              </>
            )}
          </ul>
        </header>
      )
}

export default Header