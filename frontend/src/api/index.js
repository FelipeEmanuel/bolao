import axios from "axios";

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

export const post = (url, body, setData) => {
    api.post(url, body)
        .then(response => {
            setData(response?.data);
        })
        .catch((error) => {
            console.log(error);
        })
}

export const get = (url, setData, setError, setIsFetching) => {
    api.get(url)
        .then(response => {
            setData(response.data);
        })
        .catch((err) => {
            setError(err);
        })
        .finally(() => {
            setIsFetching(false);
        });
}

export const put = (url, body, setData, setError, aux) => {
    api.put(url, body)
        .then(response => {
            setData(response?.data);
            if(aux) {
                aux();
            } 
        })
        .catch((error) => {
            setError(error?.response?.data);
        })
}

export const remove = (url, setData, setError, setIsFetching) => {
    api.delete(url)
        .then(response => {
            setData(response?.data);
            console.log(response?.data)
        })
        .catch((err) => {
            setError(err);
        })
        .finally(() => {
            setIsFetching(false);
        });
}