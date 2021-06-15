import { createStore, createTypedHooks } from "easy-peasy";
import services, { StoreModel } from "./service";
import axios from 'axios';

import {SocketService} from './service/socket/SocketService';

export const socket = new SocketService();

export const axiosInstance = axios.create();

const { useStoreActions, useStoreState, useStoreDispatch,useStore } = createTypedHooks<
  StoreModel
>();

export { useStoreActions, useStoreState, useStoreDispatch, useStore };
  
const store = createStore(services, {
  injections: socket
});

export default store;
