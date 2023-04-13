import axios from "axios"


export const makeRequest = axios.create({
    baseURL:"https://api.socio-social.ml/api/",
    withCredentials: true
})