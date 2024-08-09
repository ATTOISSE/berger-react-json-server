import { useEffect, useState } from "react"
import { useLocation, useNavigate } from 'react-router-dom'
import { postClient } from "../../services/clientService";
import { postOrder } from "../../services/orderService";

export function FormClient() {

    const location = useLocation();
    const { orders } = location.state || { orders: [] };
    const [name, setName] = useState('')
    const [lastName, setLastName] = useState('')
    const [telephone, setTelephone] = useState('')
    const [client, setClient] = useState(null)
    const [clientOrders, setClientOrders] = useState([])

    const handleClear = () => {
        setTelephone('')
        setName('')
        setLastName('')
    }

    const addClient = (e) => {
        e.preventDefault()
        if (name.trim() != '' && telephone.trim() != '' && lastName.trim() != '') {
            const id = client != null ? Math.max(...client.map(cl => cl.id)) + 1 : 1;
            const customer = { id, name, lastName, telephone }
            postClient(customer)
                .then(response => {
                    setClient({ ...client, ...response.data });
                });
            handleClear()
        }
    }

    useEffect(() => {
        if (client && orders.length > 0) {
            setClientOrders([...clientOrders,{orders:orders,client:client,etat:false}])
        }
    }, [client, orders])

    useEffect(() => {
        if (clientOrders && clientOrders.length > 0) {
            goToOrdersClient()
        }
    }, [clientOrders])

    const navigate = useNavigate()
    const goToOrdersClient = () => {
        navigate('/orders', { state: { clientOrders } });
    };

    return (
        <div>
            <form className="container mt-5">
                <div className="card">
                    <h1 className="bg-dark text-info p-3 text-center"> Enregistrement d'un client</h1>
                    <div className="card-body">
                        <div className="mb-3" >
                            <label htmlFor="name" className="form-label">Nom</label>
                            <input className="form-control" value={name} name="name" type="text" id="name" onChange={(e) => setName(e.target.value)} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="price" className="form-label">Prenom</label>
                            <input value={lastName} className="form-control" name="lastName" type="text" id="lastName" onChange={(e) => setLastName(e.target.value)} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="description" className="form-label">Telephone</label>
                            <input value={telephone} className="form-control" name="telephone" type="text" id="telephone" onChange={(e) => setTelephone(e.target.value)} />
                        </div>
                        <button type="submit" className="btn btn-primary col-3 offset-4" onClick={(event) => addClient(event)}>Valider une commande</button>
                    </div>
                </div>
            </form>
        </div>
    )
}