import { createStore, applyMiddleware, compose } from "redux";
import { routerMiddleware } from "react-router-redux";
import thunk from "redux-thunk";
import createHistory from "history/createBrowserHistory";
import rootReducer from "./modules";
import { queryMiddlewareAdvanced } from "redux-query/advanced";

export const history = createHistory();

const networkInterface = (url, method, { headers }) => {
  let timeout;

  const execute = cb => {
    timeout = setTimeout(() => {
      cb(null, 200, headers.fakeResponse, JSON.stringify(headers.fakeResponse));
    }, 300);
  };

  const abort = () => clearTimeout(timeout);

  return {
    execute,
    abort
  };
};

const initialState = {};
const enhancers = [];
const middleware = [
  thunk,
  routerMiddleware(history),
  queryMiddlewareAdvanced(networkInterface)(
    state => state.queries,
    state => state.entities
  )
];

if (process.env.NODE_ENV === "development") {
  const { logger } = require(`redux-logger`);

  middleware.push(logger);

  const devToolsExtension = window.devToolsExtension;

  if (typeof devToolsExtension === "function") {
    enhancers.push(devToolsExtension());
  }
}

const composedEnhancers = compose(applyMiddleware(...middleware), ...enhancers);

const store = createStore(rootReducer, initialState, composedEnhancers);

export default store;
