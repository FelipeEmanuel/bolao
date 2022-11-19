import axios from 'axios'

const API_URL = '/api/palpites/'

const getPalpites = async (token) => {
    const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
    }
    const response = await axios.get(API_URL + '/userPalpites', config)
  
    return response.data
}

const doPalpite = async (palpiteData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await axios.post(API_URL, palpiteData, config)
}

const palpiteService = {
    getPalpites, doPalpite
  }
  
  export default palpiteService