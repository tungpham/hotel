import React from "react";
import { Provider } from "react-redux";
import { ConnectedRouter as Router } from "react-router-redux";
import { IntlProvider } from "react-intl";

import App from "./App";

export const Root = ({ store, history }) =>
  <IntlProvider locale="en">
    <Provider store={store}>
      <Router history={history}>
        <App />
      </Router>
    </Provider>
  </IntlProvider>;

export default Root;
