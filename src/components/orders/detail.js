import { useEffect, useState } from "react"
import { useLocation,useNavigate } from 'react-router-dom'
import { useOrderStats } from "../statistic/provider";
import Swal from 'sweetalert2';

export function OrderDetails() {
  const location = useLocation();
//   const { commandes } = location.state || { commandes: [] };
const [orders,setOrders] = useState([])
const { commandes: initialCommandes } = location.state || { commandes: [] };
const [commandes, setCommandes] = useState(initialCommandes);
const [quantites, setQuantites] = useState(
      commandes.reduce((acc, commande) => {
          acc[commande.id] = 1;
          return acc;
      }, {})
  );
  const {incrementStat} = useOrderStats()

  const navigate = useNavigate()
  const goToOrders = () => {
     navigate('/client-info', { state:{orders} });
    };

    // const goToStatisticAnnule = () => {
    //     localStorage.setItem('numberAnnule', numberAnnule);
    //     navigate('/statistique');
    // };


  useEffect(()=>{
        if (commandes.length > 0) {
            setOrders([...orders,{commandes:commandes,quantites:quantites}])
        }
    },[quantites,commandes])

  const incrementQte = (id) => {
      addQte(id)
  };

  const addQte = (id)=>{
      setQuantites(prevQuantites => ({
          ...prevQuantites,
          [id]: (prevQuantites[id] || 0) + 1
      }));
  }

  const decrementQte = (id) => {
      setQuantites(prevQuantites => ({
          ...prevQuantites,
          [id]: Math.max((prevQuantites[id] || 1) - 1, 1) 
      }));
  };

  useEffect(()=>{
      const thead = document.getElementById('thead')
      if (commandes.length == 0)  
          thead.setAttribute('hidden','')
      else
          thead.removeAttribute('hidden')
  },[commandes])

  const removeProduct = (id) => {
    Swal.fire({
        title: "Voulez-vous retirer ce produit ?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Oui, Supprime le"
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: "Retiré !",
            text: "votre produit a été retiré",
            icon: "success"
          });
          setCommandes(prevCommandes => prevCommandes.filter(commande => commande.id !== id));
        }
      });
  };

  const handleAnnule = (e)=>{
    e.preventDefault()
    setCommandes([])
    incrementStat('annule')
  }


    return (
        <div className="container mt-4">
        <table className="table table-responsive">
            <thead >
                <tr key="" id="thead">
                    <th>N°</th>
                    <th>Nom</th>
                    <th>Prix</th>
                    <th>Description</th>
                    <th>Quantité</th>
                    <th>Montant</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {commandes.length > 0 ? (

                    commandes.map((commande, index) => (
                        <tr key={index} >
                            <td>{commande.id}</td>
                            <td>{commande.name}</td>
                            <td>{commande.price} € </td>
                            <td>{commande.description}</td>
                            <td>
                                <button className="btn btn-danger" onClick={() => decrementQte(commande.id)}>-</button>
                                <input type="text" className="mx-1 App-input" min="1" value={quantites[commande.id] || 1} readOnly />
                                <button className="btn btn-primary" onClick={() => incrementQte(commande.id)}>+</button>
                            </td>
                            <td>{((quantites[commande.id] || 1) * commande.price).toFixed(2)} €</td>
                            <td>
                                <button className="btn btn-outline-danger mx-2" onClick={()=>removeProduct(commande.id)}><i>Retirer</i> </button>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr key="">
                        <td colSpan="7" className="alert alert-info">Aucune commande effectuée</td>
                    </tr>
                )}

                {commandes.length > 0 && (
                    <tr>
                        <th colSpan="2" className="text-center">Total</th>
                        <th colSpan="3" className="text-center">{(commandes.reduce((total, commande) => total + (quantites[commande.id] || 1) * commande.price, 0)).toFixed(2)} €
                        </th>
                        <td><a href="" className="btn btn-secondary" onClick={(event)=>handleAnnule(event)}>Annuler</a></td>
                        <td><a href="/client-info" className="btn btn-primary" onClick={goToOrders}>Commander</a></td>
                    </tr>
                )}
            </tbody>
        </table>
    </div>
    )
}