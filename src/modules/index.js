import { mapValues, pickBy } from "lodash";
import { combineReducers } from "redux";
import { routerReducer } from "react-router-redux";
import { reducer as formReducer } from "redux-form";
import {
  entitiesReducer,
  queriesReducer,
  errorsReducer
} from "redux-query/advanced";
import * as guests from "./guests";
import * as workers from "./workers";
import * as chats from "./chats";

const combine = params => ({
  selectors: mapValues(params, param => param.selectors),
  queries: mapValues(params, param => param.queries),
  actions: mapValues(params, param => param.actions),
  reducers: pickBy(mapValues(params, param => param.reducer), Boolean)
});

export const { selectors, queries, actions, reducers } = combine({
  guests,
  workers,
  chats
});

export default combineReducers({
  routing: routerReducer,
  entities: entitiesReducer,
  queries: queriesReducer,
  errors: errorsReducer,
  form: formReducer,
  ...reducers
});
