import axios from "axios";

export const getBergers = ()=> axios.get('http://localhost:8000/burgers')
export const postBerger = (berg)=> axios.post('http://localhost:8000/burgers', berg)
export const putBerger = (id,berg)=> axios.put(`http://localhost:8000/burgers/`+id, berg)