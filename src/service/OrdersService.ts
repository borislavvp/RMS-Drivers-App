import { action, thunk, Action, Thunk, ActionMapper } from 'easy-peasy';
import axios from 'axios';
import { ISocketService } from './socket/SocketService';

import { OrderReadyForPickupMessage, OrderReadyForPickupPayload } from './socket/messages/server/OrderReadyForPickupMessage';
import { OrderStatus, OrderStatusChangeMessage } from './socket/messages/server/OrderStatusChangeMessage';
export interface IOrdersService {
    orders: OrderReadyForPickupPayload[],
    orderAvailable: OrderReadyForPickupPayload,
    pushOrderToStack: Action<IOrdersService,OrderReadyForPickupMessage>;
    removeOrderFromStack: Action<IOrdersService,OrderStatusChangeMessage>;
    loading: boolean;
	initiateLoading: Action<IOrdersService>;
	finalizeLoading: Action<IOrdersService>;
}

export const ordersService: IOrdersService = {
    orders: [],
    orderAvailable: {} as OrderReadyForPickupPayload,
    pushOrderToStack: action((state, { payload }) => {
        state.orders.push(payload);
        if (state.orders.length === 1) {
            state.orderAvailable = payload;
        }
    }),
    removeOrderFromStack: action((state, {payload}) => {
        if (payload.orderStatus === OrderStatus.Delivering) {
            const orderIndex = state.orders.findIndex(o => o.orderNumber === payload.orderNumber)
            if (orderIndex !== -1) {
                state.orders.splice(orderIndex,1);
                state.orderAvailable = state.orders.length > 0 ? state.orders[0] : {} as OrderReadyForPickupPayload;
            }
        }
    }),
    loading: false,
	initiateLoading: action((state) => {
		state.loading = true;
	}),
	finalizeLoading: action((state) => {
		state.loading = false;
	})
};
