import "./App.scss";

import AppRouters from "./routes/AppRoutes.jsx";
import Header from "./components/layout/Header.jsx";
import Footer from './components/layout/Footer.jsx';


function App() {

    return (
        <>
            <Header />
            <AppRouters />
            <Footer />
        </>
    );
}

export default App;
