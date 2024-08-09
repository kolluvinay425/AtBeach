// @flow

import {createActions, createReducer} from 'reduxsauce';
import R from 'ramda';

/* ------------- Types and Action Creators ------------- */

const {Types, Creators} = createActions({
  increaseRuns: null,
});

export const AppPersistedTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = {
  runs: 0,
};

const increaseRuns = (state: Object) =>
  R.evolve(
    {
      runs: () => {
        return state.runs + 1;
      },
    },
    state,
  );

export const reducer = createReducer(INITIAL_STATE, {
  [Types.INCREASE_RUNS]: increaseRuns,
});
