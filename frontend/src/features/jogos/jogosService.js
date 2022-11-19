import axios from 'axios'

const API_URL = '/api/palpites/'

const getJogos = async (token) => {
    const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
    }
    const response = await axios.get(API_URL, config)
  
    return response.data
}


const palpiteService = {
    getJogos
  }
  
  export default palpiteService