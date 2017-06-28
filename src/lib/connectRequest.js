import { connect } from "react-redux";
import { compose } from "recompose";
import {
  connectRequest as rqConnectRequest,
  querySelectors
} from "redux-query";

export default function connectRequest(propsToConfig, name = "query") {
  return compose(
    connect((state, props) => {
      const query = propsToConfig(props, state);

      return {
        [name]: {
          query,
          isLoading: querySelectors.isPending(state.queries, query)
        }
      };
    }),
    rqConnectRequest(props => props[name].query)
  );
}
