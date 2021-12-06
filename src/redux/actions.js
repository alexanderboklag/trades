import * as types from 'redux/actionTypes';

export function setTrades(trades) {
  return {
    type: types.SET_TRADES,
    trades,
  };
}

export function addTrade(trade) {
  return {
    type: types.ADD_TRADE,
    trade,
  };
}

export function setWsState(wsState) {
  return {
    type: types.SET_WS_STATE,
    wsState,
  };
}