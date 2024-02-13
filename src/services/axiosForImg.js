import axios from "axios";

const axiosInstanceForImg = axios.create({
    baseURL: 'http://localhost:8080',
    timeout: 5000,
    headers: {
        'Content-Type': 'multipart/form-data',
    },
});

export default  axiosInstanceForImg 