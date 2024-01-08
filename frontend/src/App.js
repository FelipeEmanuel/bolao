import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Register from './pages/Register'
import Ranking from './pages/Ranking'
import Admin from './pages/Admin'
import NovoJogo from './pages/NovoJogo'
import Perfil from './pages/Perfil'
import PageNotFound from './pages/PageNotFound'
import EditJogo from './pages/EditJogo'


function App() {
 
  return (
    <>
      <Router>
        <div className='container'>
          <Routes>
            <Route path='/' element={<Dashboard/>}/>
            <Route path='/login' element={<Login/>}/>
            <Route path='/cadastrar' element={<Register/>}/>
            <Route path='/ranking' element={<Ranking/>}/>
            <Route path='/admin' element={<Admin/>}/>
            <Route path='/novojogo' element={<NovoJogo/>} />
            <Route path='/perfil' element={<Perfil />}/>
            <Route path='*' element={<PageNotFound/>}/>
            <Route path='/:id' element={<EditJogo />} />
          </Routes>
        </div>
      </Router>
      <ToastContainer/>
    </>
    
  );
}

export default App;
