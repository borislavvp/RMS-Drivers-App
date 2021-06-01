import { createStore, createTypedHooks } from "easy-peasy";
import model, { StoreModel } from "./models";

import {SocketService} from './service/socket/SocketService';

export const socket = new SocketService();

const { useStoreActions, useStoreState, useStoreDispatch,useStore } = createTypedHooks<
  StoreModel
>();

export { useStoreActions, useStoreState, useStoreDispatch, useStore };
  
const store = createStore(model, {
  injections: socket
});

export default store;
