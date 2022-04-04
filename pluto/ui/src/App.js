import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import AppProvider from './contexts/AppProvider';
import AppContext from './contexts/AppContext';
import Navigation from './components/Navigation';
import { UserProvider } from './contexts/UserContext';
import { BrandProvider } from './contexts/BrandContext';
import AddProduct from './components/Manufacturer/AddProduct';
import UntaggedProducts from './components/Factory/UntaggedProducts';
import UnassignedTags from './components/Factory/UnassignedTags';
import UnshippedProducts from './components/Factory/UnshippedProducts';
import ViewScans from './components/Factory/ViewScans';


const App = () => (
  <div>
    <AppProvider>
      <UserProvider>
        <BrandProvider>
          <Router>
            <div className="App">
              <ToastContainer />
              <Navigation />
              <div className="container-fluid">
                <div className="row offset-md-1 mt-4">
                  <div className="col-md-11">
                    <AppContext.Consumer>
                      {context => (
                        <Switch>
                          {context.state.views.map(view => <Route exact key={view.viewId} path={view.path} component={view.component} />)}
                          <Route exact path="/manufacturer/addProduct" component={AddProduct} />
                          <Route exact path="/factory/untaggedProducts" component={UntaggedProducts} />
                          <Route exact path="/factory/unassignedTags" component={UnassignedTags} />
                          <Route exact path="/factory/unshippedProducts" component={UnshippedProducts} />
                          <Route exact path="/factory/viewScans" component={ViewScans} />
                        </Switch>
                      )}
                    </AppContext.Consumer>
                  </div>
                </div>
              </div>
            </div>
          </Router>
        </BrandProvider>
      </UserProvider>
    </AppProvider>
  </div>
);
export default App;
