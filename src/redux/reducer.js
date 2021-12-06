import { CURRENT_WS_STATE, TRADES } from './constants';
import * as types from './actionTypes';
import { WS_STATE } from './model';

const initialState = {
  [TRADES]: [],
  [CURRENT_WS_STATE]: WS_STATE.NOT_CONNECTED,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case types.SET_TRADES:
      return {
        ...state,
        [TRADES]: action.trades,
      };
    case types.ADD_TRADE:
      return {
        ...state,
        [TRADES]: [...state[TRADES], action.trade],
      };
    case types.SET_WS_STATE:
      return {
        ...state,
        [CURRENT_WS_STATE]: action.wsState,
      };
    default:
      return state;
  }
}
