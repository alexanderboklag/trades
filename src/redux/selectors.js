import { CURRENT_WS_STATE, TRADES } from './constants';

export const getTrades = state => state[TRADES];
export const getWsState = state => state[CURRENT_WS_STATE];
