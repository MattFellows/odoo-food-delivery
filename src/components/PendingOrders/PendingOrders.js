import React, { Component } from 'react';
import moment from 'moment';
import './PendingOrders.css';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

class PendingOrders extends Component {

    constructor() {
        super();
        this.temporaryPendingOrders = {};
        this.state = {pendingOrders: {orders: []}};
    }

    render() {
        return (
            <div>
                <h1>Pending Orders</h1>
                <div className="pendingOrdersContainer">
                    {this.state.pendingOrders.orders.map((o) => {
                        return (<div key={o.id} className={"pendingOrder"} data-order-id={o.id} onClick={this.acceptOrder}>
                            Order: {o.name}<br/>
                            Ordered {moment(o.confirmation_date).fromNow()}<br/>
                            Items: {o.orderLines ? o.orderLines.map((ol) => {
                            return (<p key={ol.id}>{ol.name}</p>);
                        }) : ""}
                        </div>);
                    })}
                </div>
            </div>);
    }


    componentWillMount() {
        this.updateOrders();
        this.interval = setInterval(() => this.updateOrders(), 5000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    acceptOrder(event) {
        let orderId = event.target.attributes.getNamedItem('data-order-id').value;
        confirmAlert({
            title: 'Confirm to submit',
            message: 'Accept this order and print?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => {
                        fetch(`/api/accept-order/${orderId}`, {
                            method: "PUT"
                        }).then((response) => {
                            return response.json()
                        }).then((response) => {
                            console.log(response);
                        })
                    }
                },
                {
                    label: 'No',
                    onClick: () => {}
                }
            ]
        });
    }

    updateOrders() {
        fetch('/api/pending-orders')
        .then((result) => {
            return result.json();
        })
        .then((pendingOrders) => {
            if (pendingOrders.orders.length == 0) {
                this.setState({pendingOrders: {orders: []}});
            }
            for (let orderInd in pendingOrders.orders) {
                let order = pendingOrders.orders[orderInd];
                fetch(`/api/order-lines/${order.id}`).then((response) => {
                    response.json().then((orderlines) => {
                        let pendingOrders = this.temporaryPendingOrders;
                        for (let orderLineInd in orderlines.orderLines) {
                            let orderLine = orderlines.orderLines[orderLineInd];
                            pendingOrders.orders.map((o) => {
                                ;
                                if (o.id === orderLine.order_id[0]) {
                                    if (!o.orderLines) {
                                        o.orderLines = [];
                                    }
                                    o.orderLines.push(orderLine);
                                }
                                return o;
                            })
                        }
                        this.setState({pendingOrders: pendingOrders});
                    });
                })
            }
            this.temporaryPendingOrders = pendingOrders;
            console.log(this.temporaryPendingOrders);
        })
        .catch((err) => {
            console.error(err);
        });
    }
}

export default PendingOrders;
