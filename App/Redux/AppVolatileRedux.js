// @flow

import {createActions, createReducer} from 'reduxsauce';

/* ------------- Types and Action Creators ------------- */

const {Types, Creators} = createActions({
  dummy: '',
});

export const AppVolatileTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = {};

export const reducer = createReducer(INITIAL_STATE, {});
