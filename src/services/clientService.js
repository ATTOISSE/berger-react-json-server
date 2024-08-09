import axios from "axios";

export const postClient = (client)=> axios.post('http://localhost:8000/clients', client)