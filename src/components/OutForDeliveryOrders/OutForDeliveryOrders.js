import React, { Component } from 'react';
import moment from 'moment';
import './OutForDeliveryOrders.css';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import Bottleneck from "bottleneck";
import OrderComponent from "../OrderComponent/OrderComponent";

class OutForDeliveryOrders extends OrderComponent {

    constructor() {
        super();
        this.temporaryOrders = {};
        this.state = {orders: {orders: []}, loading: false};

        this.limiter = new Bottleneck({
            maxConcurrent: 10,
            minTime: 50
        });

        this.orderUrl = '/api/out-for-delivery-orders';

        this.deliverOrder = this.deliverOrder.bind(this);
    }

    render() {
        return (
            <div>
                <h1>Out For Delivery Orders <object className={this.state.loading ? '' : 'invisible'} data={'/Double Ring-1s-40px.svg'}/></h1>
                <div className="outForDeliveryOrdersContainer">
                    {this.state.orders.orders.map((o) => {
                        console.log('orderLines', o.orderLines);
                        return (<div key={o.id} className={"outForDeliveryOrder"} data-order-id={o.id} onClick={this.deliverOrder}>
                            Order: {o.name}<br/>
                            Ordered {moment(o.confirmation_date).fromNow()}<br/>
                            <p><a href="#" className={"btn btn-primary printButton"}>Confirm Delivered</a></p>
                            Items: {o.orderLines ? o.orderLines.map((ol) => {
                            return (<p key={ol.id}>{ol.name}</p>);
                        }) : ""}
                            <div>Address: {o.partnerDetails && o.partnerDetails.length > 0 ? o.partnerDetails[0].contact_address.split('\n').map((line) => {
                                return (<p key={line} className={"reduceHeight"}>{line}</p>);
                            }) : ""} </div>
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
        while (target.parentElement && !target.parentElement.className.match(/.*outForDeliveryOrder.*/)) {
            target = target.parentElement;
        }
        if (target.parentElement && target.parentElement.className.match(/.*outForDeliveryOrder.*/)) {
            target = target.parentElement;
        }
        console.log(target);
        let orderId = target.attributes.getNamedItem('data-order-id').value;
        confirmAlert({
            title: 'Confirm to submit',
            message: 'Confirm delivery of this order?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => {
                        fetch(`/api/complete-order/${orderId}`, {
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

export default OutForDeliveryOrders;
