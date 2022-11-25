import axios from "axios";
import { useEffect, useState } from "react";



const api = axios.create({
    baseURL: process.env.BASE_URL_API,
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

export default function useApi(url) {

    const [data, setData] = useState(null);
    const [isFetching, setIsFetching] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
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

    }, [url]);

    return { data, error, isFetching };
}