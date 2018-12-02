import React, { Component } from 'react';
import moment from 'moment';
import './AcceptedOrders.css';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import Bottleneck from "bottleneck";
import OrderComponent from "../OrderComponent/OrderComponent";

class AcceptedOrders extends OrderComponent {

    constructor() {
        super();
        this.temporaryOrders = {};
        this.state = {orders: {orders: []}, loading: false};

        this.limiter = new Bottleneck({
            maxConcurrent: 10,
            minTime: 50
        });

        this.orderUrl = '/api/accepted-orders';

        this.deliverOrder = this.deliverOrder.bind(this);
    }

    render() {
        return (
            <div>
                <h1>Accepted Orders {this.state.loading ? <object data={'/Double Ring-1s-40px.svg'}/> : ''}</h1>
                <div className="acceptedOrdersContainer">
                    {this.state.orders.orders.map((o) => {
                        console.log('orderLines', o.orderLines);
                        return (<div key={o.id} className={"acceptedOrder"} data-order-id={o.id} onClick={this.deliverOrder}>
                            Order: {o.name}<br/>
                            Ordered {moment(o.confirmation_date).fromNow()}<br/>
                            <p><button className={"btn btn-primary printButton"}>Send Out for Delivery</button></p>
                            Items: {o.orderLines ? o.orderLines.map((ol) => {
                            return (<p key={ol.id}>{ol.name}</p>);
                        }) : ""}
                        </div>);
                    })}
                </div>
            </div>);
    }

    deliverOrder(event) {
        if (!event.target.className.match(/.*printButton.*/)) {
            console.log(`${event.target.className} !~= printButton`);
            return;
        }
        let target = event.target;
        while (target.parentElement && !target.parentElement.className.match(/.*acceptedOrder.*/)) {
            target = target.parentElement;
        }
        if (target.parentElement && target.parentElement.className.match(/.*acceptedOrder.*/)) {
            target = target.parentElement;
        }
        console.log(target);
        let orderId = target.attributes.getNamedItem('data-order-id').value;
        confirmAlert({
            title: 'Confirm to submit',
            message: 'Pass this order over to the delivery driver?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => {
                        fetch(`/api/deliver-order/${orderId}`, {
                            method: "PUT"
                        }).then((response) => {
                            return response.json()
                        }).then((response) => {
                            console.log(response);
                            this.updateOrders();
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
}

export default AcceptedOrders;
