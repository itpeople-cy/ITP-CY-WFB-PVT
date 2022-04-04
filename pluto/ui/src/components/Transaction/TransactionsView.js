import React, { Component } from 'react';
import Card from '../Card';
import FabricNetwork from '../../services/FabricNetwork';
import Accordion from '../Accordion';

class TransactionsView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      blocks: [],
    };
    this.fabricNetwork = new FabricNetwork();
    this.setupView = this.setupView.bind(this);
  }

  componentDidMount() {
    this.setupView();
  }

  async setupView() {
    const getTransactionsResponse = await this.fabricNetwork.getTransactions();

    this.setState({
      blocks: getTransactionsResponse,
    });
  }
  render() {
    const { blocks } = this.state;
    return (
      <div>
        <div className="row">
          <div className="col-md-12">
            <h1>Blockchain Transactions</h1>
          </div>
        </div>
        <div className="row mt-3">
          <Card title="Blocks" className="col-md-12">
            <Accordion items={blocks} headerText="BlockNumber" />
          </Card>
        </div>
      </div>
    );
  }
}

export default TransactionsView;
