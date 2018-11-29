import React, {Component} from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import './App.css';
import PendingOrders from './components/PendingOrders/PendingOrders';

class App extends Component {

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <Router>
                        <Route path={"/"} component={PendingOrders}/>
                    </Router>
                </header>
            </div>
        );
    }

}

export default App;
