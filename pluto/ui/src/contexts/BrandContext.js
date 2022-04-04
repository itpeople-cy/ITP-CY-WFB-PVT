import React from 'react';
import { getDetails, getProductDetails } from '../services/ManufacturerService';

let BrandContext;

const {
    Provider,
    Consumer
} = (BrandContext = React.createContext());

class BrandProvider extends React.Component {
    state = {
        isLoggedIn: false,
        loggedInUser: '',
        manufacturerDetails: null
    };

    componentDidMount() {

    }
    getManufacturingDetails = async () => {
        const data = await getDetails();        
        this.setState({ manufacturerDetails: data });
    };
    handleLogin = (user) => {
        this.setState({ loggedInUser: user, isLoggedIn: true });
    }
    render() {
        return (
            <Provider
                value={{
                    ...this.state,
                    getManufacturingDetails: this.getManufacturingDetails,
                    onLogin: this.handleLogin
                }}
            >
                {this.props.children}
            </Provider>
        );
    }
}

export {
    BrandProvider,
    Consumer as UserConsumer,
    BrandContext
};