import './Dashboard.scss';
import { useContext } from 'react';
import { AuthContext } from "../context/AuthContext.jsx";

import Spinner from '../components/ui/SpinLoader.jsx';

import AdminDashboard from '../components/dashboard/admin/Dashboard.jsx';
import ClientDashboard from '../components/dashboard/client/Dashboard.jsx';
import CraftsmanDashboard from '../components/dashboard/craftsman/Dashboard.jsx';

function Dashboard() {

    const {userDatas, userRole} = useContext(AuthContext);

    const dashboard = () => {
        switch (userRole) {
            case 'admin':
                return <AdminDashboard />;
            case 'client':
                return <ClientDashboard />;
            case 'craftsman':
                return <CraftsmanDashboard />;
            default:
                return <Spinner />
        }
    }

    return ( 
        <main className="main-dashboard">
            <section className="dashboard-title">
                <h1>Bienvenue sur votre tableau de bord</h1>
                <h2>Accedez à vos informations, gérez vos messages et vos projets</h2>
            </section>

            {dashboard()}
            
        </main>
    );
}

export default Dashboard;