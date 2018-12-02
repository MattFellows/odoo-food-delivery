import React, { Component } from 'react';

class PrintOrder extends Component {
    render() {
        return (<div>
                <div>Order {this.props.order.name}</div>
                <div>Items: {this.props.order.orderLines ? this.props.order.orderLines.map((ol) => {
                return (<p key={ol.id}>{ol.name}</p>);
                }) : ""} </div>
                <div>Address: {this.props.order.partnerDetails && this.props.order.partnerDetails.length > 0 ? this.props.order.partnerDetails[0].contact_address.split('\n').map((line) => {
                    return (<p key={line} className={"reduceHeight"}>{line}</p>);
                }) : ""} </div>
            </div>);
    }
}

export default PrintOrder
