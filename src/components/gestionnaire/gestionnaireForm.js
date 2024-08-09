import { useEffect, useState } from "react"

export function FormGestionnaire({addBerger,berger}){
    const [name,setName] = useState('')
    const [price,setPrice] = useState('')
    const [picture,setPicture] = useState('')
    const [description,setDescription] = useState('')

    const handleClear = ()=>{
        setDescription('')
        setName('')
        setPicture('')
        setPrice('')
    }

    const handleAdd = (e)=>{
        e.preventDefault()
        if (name.trim() != "") {
            const b = { id: berger ? berger[0].id : undefined, name, price, description, picture }
            console.log(berger);
            addBerger(b);
            handleClear();
        }
    }

    useEffect(()=>{
        if (berger != null) {
            const b = berger[0]
            setDescription(b.description)
            setName(b.name)
            setPrice(b.price)
        }
    },[berger])

    return(
        <div>
            <form className="container mt-4">
                <div className="card">
                    <h1 className="bg-dark text-info p-3 text-center"> Ajout des Berger</h1>
                    <div className="card-body">
                        <div className="mb-3" >
                            <label htmlFor="name" className="form-label">Nom</label>
                            <input className="form-control" value={name} name="name" type="text" id="name" onChange={(e)=>setName(e.target.value)}/>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="price" className="form-label">Prix</label>
                            <input value={price} className="form-control" name="price" type="text" id="price"  onChange={(e)=>setPrice(e.target.value)}/>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="description" className="form-label">Description</label>
                            <textarea value={description} className="form-control" name="description" type="text" id="description" onChange={(e)=>setDescription(e.target.value)}/>
                        </div>
                        <button type="submit" className={`btn btn-${berger ? 'warning' : 'success'} col-3 offset-4`} onClick={(event)=>handleAdd(event)}>{berger ? 'Modifier' : 'Sauvegarder'} </button>
                    </div>
                </div>
            </form>
        </div>
    )
}