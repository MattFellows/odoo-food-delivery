import React, {Component} from 'react';
import {BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom';
import './App.css';
import PendingOrders from './components/PendingOrders/PendingOrders';
import AcceptedOrders from "./components/AcceptedOrders/AcceptedOrders";
import OutForDeliveryOrders from "./components/OutForDeliveryOrders/OutForDeliveryOrders";
import NavLink from "./components/NavLink/NavLink";

class App extends Component {

    render() {
        return (
            <div className="App">
                <Router>
                    <div>
                        <header className="App-header">
                            <div className={"navbar"}>
                                <Link to={"/"} className="nav-item" activeClassName={"active"}>Pending Orders</Link>
                                <Link to={"/accepted"} className="nav-item" activeClassName={"active"}>Accepted
                                    Orders</Link>
                                <Link to={"/delivering"} className="nav-item" activeClassName={"active"}>Orders out for
                                    Delivery</Link>
                            </div>
                        </header>
                        <div className="App-body">
                            <Switch>
                                <Route exact path={"/"} component={PendingOrders}/>
                                <Route path={"/accepted"} component={AcceptedOrders}/>
                                <Route path={"/delivering"} component={OutForDeliveryOrders}/>
                            </Switch>
                        </div>
                    </div>
                </Router>
            </div>
        );
    }

}

export default App;
