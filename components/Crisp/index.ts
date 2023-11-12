import React, { Component } from 'react';
import { Crisp as CrispSDK } from 'crisp-sdk-web';

class Crisp extends Component {
    componentDidMount() {
        CrispSDK.configure(`${process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID}`);
    }
    render () {
        return null;
    }
}

export default Crisp;