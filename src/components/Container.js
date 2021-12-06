import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import WebsocketClient from 'components/WebsocketClient';
import Trades from 'components/Trades';

import { setWsState } from 'redux/actions';
import { getWsState, } from 'redux/selectors';
import { WS_STATE, WS_STATE_PROPS } from 'redux/model';

function renderButton(onClick, label, disabled) {
  return (
    <button onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
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

  toggleConnectionButton = () => {
    const { wsState } = this.props;
    if (wsState === WS_STATE.CONNECTED) {
      this.props.dispatch(setWsState(WS_STATE.CLOSING));
    } else {
      this.props.dispatch(setWsState(WS_STATE.CONNECTING));
    }
  }

  render() {
    const { wsState } = this.props;

    const connectionButtonDisabled = (wsState === WS_STATE.CONNECTING || wsState === WS_STATE.CLOSING);
    let connectionButtonLabel = 'Wait...';
    if (wsState === WS_STATE.NOT_CONNECTED) {
      connectionButtonLabel = 'Connect';
    } else if (wsState === WS_STATE.CONNECTED) {
      connectionButtonLabel = 'Disconnect';
    }

    return (
      <div>
        <WebsocketClient />
        {renderButton(this.toggleConnectionButton, connectionButtonLabel, connectionButtonDisabled)}
        <div className="tables-container">
          <Trades />
        </div>
      </div>
    );
  }
});
