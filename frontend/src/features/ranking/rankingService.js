import axios from 'axios'

const API_URL = '/api/ranking/'

const getRanking = async (token) => {
    const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
    }
    const response = await axios.get(API_URL, config)
  
    return response.data
}


const rankingService = {
  getRanking
}
  
  export default rankingService