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
import Comps from './pages/Comps'
import Rankings from './components/Rankings'
import RankingInativos from './pages/RankingInativos'
import RankingSemanal from './pages/RankingSemanal'
import UserProfile from './pages/UserProfile'

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
            <Route path='/comps' element={<Comps />}/>
            <Route path='/getPontuacao/:id' element={<Rankings />}/>
            <Route path='/ranking/inativos' element={<RankingInativos />}/>
            <Route path='/ranking/semanal' element={<RankingSemanal />}/>
            <Route path='/user/:id' element={<UserProfile />}/>
          </Routes>
        </div>
      </Router>
      <ToastContainer/>
    </>
    
  );
}

export default App;
