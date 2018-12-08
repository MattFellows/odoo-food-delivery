import React, { Component } from 'react';
import moment from 'moment';
import './PendingOrders.css';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import PrintOrder from '../PrintOrder/PrintOrder';
import ReactToPrint from "react-to-print";
import Bottleneck from "bottleneck";
import OrderComponent from "../OrderComponent/OrderComponent";

class PendingOrders extends OrderComponent {

    constructor() {
        super();
        this.temporaryOrders = {};
        this.state = {orders: {orders: []}, loading: false};

        this.limiter = new Bottleneck({
            maxConcurrent: 10,
            minTime: 50
        });

        this.orderUrl = '/api/pending-orders';

        this.acceptOrder = this.acceptOrder.bind(this);
    }

    render() {
        return (
            <div>
                <h1>Pending Orders <object className={this.state.loading ? '' : 'invisible'} data={'/Double Ring-1s-40px.svg'}/></h1>
                <div className="pendingOrdersContainer">
                    {this.state.orders.orders.map((o) => {
                        return (<div key={o.id} className={"pendingOrder"} data-order-id={o.id} onClick={this.acceptOrder}>
                            Order: {o.name}<br/>
                            Ordered {moment(o.confirmation_date).fromNow()}<br/>
                            <p>
                                <ReactToPrint
                                    trigger={() => <a href="#" className={"btn btn-primary printButton"}>Accept this order!</a>}
                                    content={() => o.componentRef}
                                />
                            </p>
                            Items: <ul>{o.orderLines ? o.orderLines.map((ol) => {
                            return (<li key={ol.id}>{ol.name}</li>);
                        }) : ""}</ul>
                            <div className={"hidden"}>
                                <PrintOrder order={o} ref={el => (o.componentRef = el)}/>
                            </div>
                        </div>);
                    })}
                </div>
            </div>);
    }

    acceptOrder(event) {
        if (!event.target.className.match(/.*printButton.*/)) {
            console.log(`${event.target.className} !~= printButton`);
            return;
        }
        let target = event.target;
        while (target.parentElement && !target.parentElement.className.match(/.*pendingOrder.*/)) {
            target = target.parentElement;
        }
        if (target.parentElement && target.parentElement.className.match(/.*pendingOrder.*/)) {
            target = target.parentElement;
        }
        console.log(target);
        let orderId = target.attributes.getNamedItem('data-order-id').value;
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

export default PendingOrders;
