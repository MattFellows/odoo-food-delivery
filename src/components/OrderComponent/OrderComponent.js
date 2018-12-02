import React, { Component } from 'react';
import { confirmAlert } from 'react-confirm-alert';
import Bottleneck from "bottleneck";

class OrderComponent extends Component {

    constructor() {
        super();
        this.controller = new AbortController();
        this.temporaryOrders = {};
        this.orderUrl = '';
    }


    componentWillMount() {
        this.updateOrders();
        this.interval = setInterval(() => this.updateOrders(), 10000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
        this.controller.abort();
    }

    updateOrders() {
        this.setState({loading: true});
        fetch(this.orderUrl, {signal: this.controller.signal})
            .then((result) => {
                return result.json();
            })
            .then((orders) => {
                if (orders.orders.length === 0) {
                    this.setState({orders: {orders: []}});
                    this.setState({loading: false});
                    return;
                }
                this.temporaryOrders = orders;

                let promises = [];
                for (let orderInd in orders.orders) {
                    let order = orders.orders[orderInd];
                    promises.push(this.limiter.schedule(() => fetch(`/api/partner/${order.partner_id[0]}`, {signal: this.controller.signal})));
                }
                return Promise.all(promises);
            }).then((response) => {
            if (!response) {
                return;
            }
            console.log("Response from partner: ", this.limiter.jobs().length);
            return Promise.all(response.map((r) => {
                return r.json();
            }));
        }).then((partners) => {
            if (!partners) {
                return;
            }
            for (let partner of partners) {
                for (let tempOrder of this.temporaryOrders.orders) {
                    if (tempOrder.partner_id[0] === partner[0].id) {
                        tempOrder.partnerDetails = partner;
                    }
                }
            }

            let promises = [];
            for (let orderInd in this.temporaryOrders.orders) {
                let order = this.temporaryOrders.orders[orderInd];
                promises.push(this.limiter.schedule(() => fetch(`/api/order-lines/${order.id}`, {signal: this.controller.signal})));
            }
            return Promise.all(promises);
        }).then((response) => {
            if (!response) {
                return;
            }
            console.log("Response from order-lines: ", this.limiter.jobs().length);
            return Promise.all(response.map((r) => {
                return r.json();
            }));
        }).then((orderlinesArr) => {
            if (!orderlinesArr) {
                return;
            }
            for (let orderlines of orderlinesArr) {
                for (let orderLineInd in orderlines.orderLines) {
                    let orderLine = orderlines.orderLines[orderLineInd];
                    this.temporaryOrders.orders.map((o) => {
                        if (o.id === orderLine.order_id[0]) {
                            if (!o.orderLines) {
                                o.orderLines = [];
                            }
                            o.orderLines.push(orderLine);
                        }
                        return o;
                    })
                }
            }

            console.log(`Temp Orders: `, this.temporaryOrders);
            this.setState({orders: this.temporaryOrders});
            this.setState({loading: false});
        }).catch((err) => {
            console.error(err);
        });
    }

}

export default OrderComponent
