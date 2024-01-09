import axios from 'axios'
const API_URL = '/api/users/'

const api = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL_API,
  headers: {
      Authorization : "COMO ISSO TA FUNCIONANDO"
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

export const login = (body) => {
    return api.post(API_URL + 'login', body);  
}

export const register = (body) => {
  return api.post(API_URL, body);
}


//logout user
export const logout = () => {
    localStorage.removeItem('user')
}
