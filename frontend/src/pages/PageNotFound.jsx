import React from 'react'
import { useNavigate } from 'react-router-dom'


function PageNotFound() {

    const navigate = useNavigate();
    const goBack = () => {
        navigate(-1)
    }

  return (
    <section>
        <div className='not-found'>
            <h1>Ops! Página não encontrada!</h1>
            <button className='btn btn-block3' onClick={goBack}>
                Voltar
            </button>
            
            
        </div>
    </section>
  )
}

export default PageNotFound