import React from "react";
import { connect } from "react-redux";
import { compose, branch, renderComponent } from "recompose";
import Halogen from "halogen";
import {
  connectRequest as rqConnectRequest,
  querySelectors
} from "redux-query";

export function spinnerOnLoading(name = "query") {
  return branch(
    props =>
      props[name] &&
      (props[name].isLoading === true || props[name].isFinished === false),
    renderComponent(() =>
      <div className="loading-container">
        <Halogen.PulseLoader color="#ccc" />
      </div>
    )
  );
}

export default function connectRequest(propsToConfig, name = "query") {
  return compose(
    connect((state, props) => {
      const query = propsToConfig(props, state);

      return {
        [name]: {
          query,
          isLoading: querySelectors.isPending(state.queries, query),
          isFinished: querySelectors.isFinished(state.queries, query)
        }
      };
    }),
    rqConnectRequest(props => props[name].query)
  );
}
