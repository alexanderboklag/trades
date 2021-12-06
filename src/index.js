import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import Container from 'components/Container';
import Store from 'redux/Store';

import 'scss/_all.scss';

const store = Store.configure();
render((
  <Provider store={store}>
    <Container />
  </Provider>
), document.getElementById("root"));
