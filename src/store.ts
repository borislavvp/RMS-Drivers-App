import { createStore, createTypedHooks } from "easy-peasy";
import services, { StoreModel } from "./service";

import {SocketService} from './service/socket/SocketService';

export const socket = new SocketService();

const { useStoreActions, useStoreState, useStoreDispatch,useStore } = createTypedHooks<
  StoreModel
>();

export { useStoreActions, useStoreState, useStoreDispatch, useStore };
  
const store = createStore(services, {
  injections: socket
});

export default store;
