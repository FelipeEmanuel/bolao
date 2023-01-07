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

export const put = (url, body, setData) => {
    api.put(url, body)
        .then(response => {
            setData(response?.data);
        })
        .catch((error) => {
            console.log(error);
        })
}

export const remove = (url, setData, setError, setIsFetching) => {
    api.delete(url)
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