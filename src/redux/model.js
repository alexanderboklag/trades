import PropTypes from 'prop-types';

export const TRADE = {
  ID: 'id',
  TIMESTAMP: 'timestamp',
  AMOUNT: 'amount',
  PRICE: 'price',
};

export const TRADE_PROPS = {
  [TRADE.ID]: PropTypes.number,
  [TRADE.TIMESTAMP]: PropTypes.number,
  [TRADE.AMOUNT]: PropTypes.number,
  [TRADE.PRICE]: PropTypes.number,
};

export const WS_STATE = {
  NOT_CONNECTED: 'NOT_CONNECTED',
  CONNECTING: 'CONNECTING',
  CONNECTED: 'CONNECTED',
  CLOSING: 'CLOSING',
};

export const WS_STATE_PROPS = PropTypes.oneOf(Object.keys(WS_STATE).map(key => WS_STATE[key]));
