import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { getTrades } from 'redux/selectors';
import { TRADE, TRADE_PROPS } from 'redux/model';
import { renderTable } from 'utils/renderingUtils';


const MAX_TRADES = 25;

function mapStateToProps(state) {
  return {
    trades: getTrades(state),
  };
}

export default connect(mapStateToProps)(class extends React.PureComponent {
  static propTypes = {
    trades: PropTypes.arrayOf(PropTypes.shape(TRADE_PROPS)).isRequired,
  };

  render() {
    const { trades } = this.props;
    const lastTrades = trades.slice(trades.length - MAX_TRADES).reverse();
    const renderedTrades = lastTrades.map(trade => (
      <tr key={trade[TRADE.ID]} className={trade[TRADE.AMOUNT] > 0 ? 'green-row' : 'red-row'}>
        <th>{new Date(trade[TRADE.TIMESTAMP]).toISOString().substr(11, 8)}</th>
        <th>{trade[TRADE.PRICE]}</th>
        <th>{Math.abs(trade[TRADE.AMOUNT].toFixed(2))}</th>
      </tr>
    ));
    return renderTable('Trades:', 'Time', 'Price', 'Amount', renderedTrades);
  }
});

