import React from "react";
import ReactDOM from "react-dom";
import registerServiceWorker from "./registerServiceWorker";

import store, { history } from "./store";
import Root from "./containers/Root";

import "./index.scss";

ReactDOM.render(
  <Root store={store} history={history} />,
  document.getElementById("root")
);
registerServiceWorker();
