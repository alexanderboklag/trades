import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import connectWs from 'api/bitfinexApi';
import { addTrade, setTrades, setWsState } from 'redux/actions';
import { getWsState } from 'redux/selectors';
import { TRADE, WS_STATE, WS_STATE_PROPS } from 'redux/model';

function getSubscribeMessage(channel, fields) {
  return ({
    ...fields,
    event: 'subscribe',
    symbol: 'tBTCUSD',
    channel,
  });
}

function mapStateToProps(state) {
  return {
    wsState: getWsState(state),
  };
}

export default connect(mapStateToProps)(class extends React.PureComponent {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    wsState: WS_STATE_PROPS,
  };

  componentWillMount() {
    this.setState({
      ws: null,
      tradesChannelId: 0,
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.wsState !== this.props.wsState) {
      if (nextProps.wsState === WS_STATE.CLOSING) {
        this.closeWebsocket();
      } else if (nextProps.wsState === WS_STATE.CONNECTING) {
        this.connectWebsocket();
      }
    }
  }

  componentWillUnmount() {
    if (this.props.wsState === WS_STATE.CONNECTED) {
      this.closeWebsocket();
    }
  }

  connectWebsocket = () => {
    const newWs = connectWs(this.onWsOpen, this.onWsMessage, this.onWsClosed);
    this.setState({ ws: newWs });
  }

  closeWebsocket = () => {
    this.state.ws.close();
  }

  onWsOpen = () => {
    const { ws } = this.state;
    this.props.dispatch(setWsState(WS_STATE.CONNECTED));

    ws.send(JSON.stringify(getSubscribeMessage('trades')));
  }

  onWsMessage = (message) => {
    const data = JSON.parse(message.data);
    const { event } = data;
    if (event === 'subscribed') {
      this.handleSubscribedEvent(data);
    } else if (Array.isArray(data)) {
      const channelId = data[0];
      const { tradesChannelId } = this.state;
      if (channelId === tradesChannelId) {
        this.handleTradeEvent(data);
      }
    }
  }

  onWsClosed = () => {
    this.props.dispatch(setWsState(WS_STATE.NOT_CONNECTED));
    this.setState({
      tradesChannelId: 0,
    });
  }

  handleSubscribedEvent = (data) => {
    const { chanId } = data;
    this.setState({ tradesChannelId: chanId });
  }

  handleTradeEvent = (data) => {
    const deserializeTrade = (tradeArray => ({
      [TRADE.ID]: tradeArray[0],
      [TRADE.TIMESTAMP]: tradeArray[1],
      [TRADE.AMOUNT]: tradeArray[2],
      [TRADE.PRICE]: tradeArray[3],
    }));
    if (data.length === 3 && data[1] === 'te') {
      // update
      const tradeArray = data[2];
      const trade = deserializeTrade(tradeArray);
      this.props.dispatch(addTrade(trade));
    } else if (data.length === 2 && Array.isArray(data[1])) {
      // snapshot
      const trades = data[1].map(trade => deserializeTrade(trade));
      this.props.dispatch(setTrades(trades));
    }
  }

  render() {
    return null;
  }
});
