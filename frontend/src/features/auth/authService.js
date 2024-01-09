import axios from 'axios'
const API_URL = '/api/users/'

const api = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL_API,
    headers: {
        Authorization : ""
    }
});

api.interceptors.request.use(
    (config) =>  {
        
        const user = JSON.parse(localStorage.getItem("user"))
        
        config.headers.Authorization = user ? `Bearer ${user?.token}` : "";
        
        return config;
    }, 
    (error) => {
        console.log(error);
        return;
    }
);

// Register user
export const register = async (userData) => {
    const response = await axios.post(API_URL, userData)
  
    if (response.data) {
      localStorage.setItem('user', JSON.stringify(response.data))
    }
  
    return response.data
}

//login user
export const login = async (userData) => {
    const response = await axios.post(API_URL + 'login', userData)
  
    if (response.data) {
      localStorage.setItem('user', JSON.stringify(response.data))
    }
  
    return response.data
}

//logout user
export const logout = () => {
    localStorage.removeItem('user')
}
