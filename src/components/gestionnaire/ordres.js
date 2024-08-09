import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useOrderStats } from "../statistic/provider";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { postOrder } from "../../services/orderService";

export function Orders() {
    const location = useLocation();
    const { clientOrders: initialClientOrders } = location.state || { clientOrders: [] };
    const [clientOrders, setClientOrders] = useState(Array.isArray(initialClientOrders) ? initialClientOrders : []);
    const notify = () => toast("La commande est Prête !!!")
    const notifyPaye = () => toast.success("La commande a ete payé avec success !")

    const [customers, setCustomers] = useState(null);
    const [qtes, setQtes] = useState({});
    const [etat, setEtat] = useState(false);
    const [valid, setValid] = useState(false);
    const [command, setCommand] = useState([]);
    const [commands, setCommands] = useState([]);
    const {incrementStat} = useOrderStats()


    useEffect(() => {
        if (Array.isArray(clientOrders) && clientOrders.length > 0) {
            const allCommandsSet = new Set(); 
            const allQuantities = {};
            let customerData = null;

            clientOrders.forEach(cl => {
                if (cl && cl.client && Array.isArray(cl.orders)) {
                    customerData = cl.client;
                    cl.orders.forEach(order => {
                        if (order && Array.isArray(order.commandes)) {
                            order.commandes.forEach(commande => {
                                allCommandsSet.add(commande);
                            });
                            if (order.quantites) {
                                Object.assign(allQuantities, order.quantites);
                            }
                        }
                    });
                }
            });

            setCommand([...allCommandsSet]);
            setQtes(allQuantities);
            setCustomers(customerData);
        }
    }, [clientOrders]);

    useEffect(() => {
        if (etat) {
            setClientOrders(prevClientOrders => 
                prevClientOrders.map(order => ({ ...order, etat: true }))
            );
        }
    }, [etat]);

    useEffect(() => {
        if (clientOrders.length > 0) {
            console.log(clientOrders);
        }
    }, [clientOrders]);

    const isEtat = (e) => {
        e.preventDefault();
        setEtat(true);
        incrementStat('enCours')
        notify()
        const btn = (document.getElementById("btn"))
        btn.setAttribute('disabled','')
    };

    const isValid = (e) => {
        e.preventDefault();
        setValid(true);
       incrementStat('valide')
    };

    const handlePaye = ()=>{
        incrementStat('paye')
        const id = commands.length > 0 ? Math.max(...commands.map(cl => cl.id)) + 1 : 1;
            const order = { id: id, orders: command, client: customers, etat: true }
            postOrder(order)
                .then(response => {
                    setClientOrders([...commands, response.data]);
                });
        notifyPaye()
        const btn = (document.getElementById("btnPaye"))
        btn.setAttribute('disabled','')
    }

    return (
        <div className="container mt-4 col-10">
            {customers ? (
                <div className="card bg-info">
                    <div className="card-header">
                        <h2 className="text-center">
                            {customers.name} - {customers.lastName} - {customers.telephone}
                        </h2>
                    </div>
                </div>
            ) : null}
            <table className="table table-responsive">
                <thead>
                    <tr key="" id="thead">
                        <th>N°</th>
                        <th>Nom</th>
                        <th>Prix</th>
                        <th>Quantité</th>
                        <th>Montant</th>
                    </tr>
                </thead>
                <tbody>
                    {command.length > 0 ? (
                        command.map((commande, index) => (
                            <tr key={index}>
                                <td>{commande.id}</td>
                                <td>{commande.name}</td>
                                <td>{commande.price} €</td>
                                <td>{qtes[commande.id]}</td>
                                <td>{(qtes[commande.id] * commande.price).toFixed(2)} €</td>
                            </tr>
                        ))
                    ) : (
                        <tr key="">
                            <td colSpan="7" className="alert alert-info">Aucune commande effectuée</td>
                        </tr>
                    )}
                    {command.length > 0 && (
                        <tr>
                            <th colSpan="2" className="text-center">Total</th>
                            <th colSpan="2" className="text-center">
                                {command.reduce((total, commande) => total + (qtes[commande.id] || 1) * commande.price, 0).toFixed(2)} €
                            </th>
                            <td>
                                {valid ? (
                                <button id="btn" className={`btn btn-outline-${etat ? 'success' : 'secondary'}`} onClick={(event) => isEtat(event)}>
                                    {etat ? 'Terminer' : 'En cours'}
                                </button>
                                ):(
                                    <a href="" className="btn btn-outline-info" onClick={(event) => isValid(event)}>
                                    Prendre en charge
                                </a>
                                )}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
            {etat &&(
            <center>
                <button id="btnPaye" className="btn btn-outline-primary" onClick={(event)=>handlePaye(event)}>Payer une commande</button>
            </center>
        )}   
      <ToastContainer />
        </div>
    );
}

export default Orders;
