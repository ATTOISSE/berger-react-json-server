import { Home } from './components/home';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Catalog } from './components/orders/catalog';
import { OrderDetails } from './components/orders/detail';
import { FormClient } from './components/client/clientForm';
import { Outlet, NavLink, createBrowserRouter } from "react-router-dom";
import { Orders } from './components/gestionnaire/ordres';
import { Statistic } from './components/statistic/statistic';
import { OrderStatsProvider } from './components/statistic/provider';
import { FormGestionnaire } from './components/gestionnaire/gestionnaireForm';
import { ListGestionnaire } from './components/gestionnaire/gestionnaireList';



export const router = createBrowserRouter([
    {
        path: '/',
        element: <OrderStatsProvider><Root /></OrderStatsProvider>,
        errorElement: <PageError />,
        children: [
            {
                path: 'detail-commande',
                element: <OrderDetails />
            },
            {
                path: '',
                element: <Home />
            },
            {
                path: 'catalogue',
                element: <Catalog />
            },
            {
                path: 'client-info',
                element: <FormClient />
            },
            {
                path: 'orders',
                element: <Orders />
            },
            {
                path: 'statistique',
                element: <Statistic />
            }
        ]
    }
])


function PageError() {
    return <>
        <div className="alert alert-danger">
            <h1>Page n'existe pas 404</h1>
        </div>
    </>
}
export function Root() {
    return <>
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <a className="navbar-brand offset-1" href="#"> <b> CINAYE BURGER</b></a>
            <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav">
                    <li className="nav-item active">
                        <NavLink to="/" className="nav-link mx-3 ">Home</NavLink>
                    </li>
                    <li className="nav-item ">
                        <NavLink to="/catalogue" className="nav-link mx-3 ">Catalogue</NavLink>
                    </li>
                    <li className="nav-item ">
                        <NavLink to="/statistique" className="nav-link mx-3 ">Statistique</NavLink>
                    </li>

                </ul>
            </div>
        </nav>
        <div>
            <Outlet />
        </div>
    </>
}

export default { router }