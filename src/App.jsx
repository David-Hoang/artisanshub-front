import "./App.scss";

import AppRouters from "./routes/AppRoutes.jsx";
import Header from "./components/Header.jsx";
import Footer from './components/Footer.jsx';


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
