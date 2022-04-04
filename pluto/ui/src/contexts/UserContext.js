import React from 'react';

let UserContext;

const {
    Provider,
    Consumer
} = (UserContext = React.createContext());

class UserProvider extends React.Component {
    state = {
        isLoggedIn: false,
        loggedInUser: window.localStorage.getItem('login-email') ,
        userRole: ''
    };

    componentDidMount() {
     const token = window.localStorage.getItem('x-access-token');
     if (token)
     this.setState({isLoggedIn:true});
    }
    handleLogout = () => {
        this.setState({ loggedInUser: null, isLoggedIn: false });
    };
    handleLogin = (user) => {
        this.setState({ loggedInUser: user, isLoggedIn: true });
        window.localStorage.setItem('login-email', user);

    }
    render() {
        return (
            <Provider
                value={{
                    ...this.state,
                    onLogout: this.handleLogout,
                    onLogin: this.handleLogin
                }}
            >
                {this.props.children}
            </Provider>
        );
    }
}

export {
    UserProvider,
    Consumer as UserConsumer,
    UserContext
};