import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Register from './pages/Register'
import Ranking from './pages/Ranking'
import Admin from './pages/Admin'
import Header from './components/Header/Header'
import NovoJogo from './pages/NovoJogo'

function App() {
  return (
    <>
      <Router>
        <div className='container'>
          <Header />
          <Routes>
            <Route path='/' element={<Dashboard/>}/>
            <Route path='/login' element={<Login/>}/>
            <Route path='/cadastrar' element={<Register/>}/>
            <Route path='/ranking' element={<Ranking/>}/>
            <Route path='/admin' element={<Admin/>}/>
            <Route path='/novojogo' element={<NovoJogo/>} />
          </Routes>
        </div>
      </Router>
      <ToastContainer/>
    </>
    
  );
}

export default App;
