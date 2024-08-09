import axios from "axios";

export const postOrder = (order)=> axios.post('http://localhost:8000/orders', order)