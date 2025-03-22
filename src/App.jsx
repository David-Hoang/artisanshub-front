import "./App.scss";
import { createBrowserRouter } from "react-router-dom";
import Homepage from './pages/Homepage';
import AppRouters from "./routes/AppRoutes";
import Header from "./components/Header";


function App() {

    return (
        <>
            <Header />
            <AppRouters />
        </>
    );
}

export default App;
