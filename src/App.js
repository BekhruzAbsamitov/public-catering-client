import {createContext, useState} from "react";
import Switch from "react-bootstrap/Switch";
import Login from "./pages/Login";
import {ToastContainer} from "react-toastify";
import Home from "./pages/Home";
import AdminMain from "./pages/AdminMain";
import {Route} from "react-router-dom";
import Reservation from "./pages/Reservation";
import UserMain from "./pages/UserMain";
import 'react-toastify/dist/ReactToastify.css'
import Register from "./pages/Register";
import Order from "./pages/Order";
import Tables from "./pages/Tables";
import Reservations from "./pages/Reservations";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import Header from "./component/Header";
import Payment from "./pages/Payment";
import Footer from "./component/Footer";
import Restaurants from "./pages/Restaurants";
import GroceryStores from "./pages/GroceryStores";

export const GlobalContext = createContext(undefined);


function App() {
    const [logged, setLogged] = useState(false)
    const [user, setUser] = useState('')
    return (
        <GlobalContext.Provider value={{logged: logged, setLogged: setLogged, user: user, setUser: setUser}}>
            <Header/>
            <div className={'container'}>
                <Switch>
                    <Route path={'/login'} component={Login} exact/>
                    <Route path={'/order/:id'} component={Order} exact/>
                    <Route path={"/admin-main"} component={AdminMain} exact/>
                    <Route path={'/user-main'} component={UserMain} exact/>
                    <Route path={'/register'} component={Register} exact/>
                    <Route path={'/reservation/:id/:reservation_id?'} component={Reservation} exact/>
                    <Route path={'/tables/:res_id'} component={Tables} exact/>
                    <Route path={'/product/store-id/:store_id'} component={Products} exact/>
                    <Route path={'/reservation-list/:res_id'} component={Reservations} exact/>
                    <Route path={'/orders/:id?'} component={Orders}/>
                    <Route path={'/payment'} component={Payment} exact/>
                    <Route path={'/restaurants'} component={Restaurants} exact/>
                    <Route path={'/grocery-stores'} component={GroceryStores} exact/>
                     <Route path={'/'} component={Home} exact/>
                </Switch>
                <ToastContainer/>
            </div>
            <Footer/>
        </GlobalContext.Provider>);
}

export default App