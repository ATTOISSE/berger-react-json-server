import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const OrderStatsContext = createContext();

export const OrderStatsProvider = ({ children }) => {
    const [stats, setStats] = useState({
        annule: 0,
        enCours: 0,
        valide: 0,
        paye: 0
    });

    useEffect(() => {
        // Récupérer les statistiques depuis le json-server au chargement du composant
        axios.get('http://localhost:8000/stats')
            .then(response => {
                setStats(response.data);
            })
            .catch(error => {
                console.error("Erreur lors de la récupération des statistiques:", error);
            });
    }, []);

    const incrementStat = (statType) => {
        const updatedStats = {
            ...stats,
            [statType]: stats[statType] + 1
        };
        setStats(updatedStats);

        axios.put('http://localhost:8000/stats', updatedStats)
            .then(response => {
                console.log("Statistiques mises à jour:", response.data);
            })
            .catch(error => {
                console.error("Erreur lors de la mise à jour des statistiques:", error);
            });
    };

    return (
        <OrderStatsContext.Provider value={{ stats, incrementStat }}>
            {children}
        </OrderStatsContext.Provider>
    );
};

export const useOrderStats = () => useContext(OrderStatsContext);
