import { action, Action, thunk, Thunk } from 'easy-peasy';
import axios from 'axios';

import { OrderReadyForPickupMessage } from './socket/messages/server/OrderReadyForPickupMessage';
import { OrderStatus, OrderStatusChangeMessage } from './socket/messages/server/OrderStatusChangeMessage';
import { Order } from '../pages/Main';
import { environtments } from '../environments';

export interface IOrdersService {
    orders: Order[],
    orderAvailable: Order,
    fetchDailyOrders: Thunk<IOrdersService, void, Promise<void>>;
    notifyPickup: Thunk<IOrdersService, void,IOrdersService, Promise<void>  >;
    notifyDelivered: Thunk<IOrdersService, void,IOrdersService, Promise<void>>;
    saveOrders: Action<IOrdersService, Order[]>;
    pushOrderToStack: Action<IOrdersService, OrderReadyForPickupMessage>;
    removeOrderFromStack: Action<IOrdersService, OrderStatusChangeMessage>;
    loading: boolean;
	initiateLoading: Action<IOrdersService>;
	finalizeLoading: Action<IOrdersService>;
}

export const ordersService: IOrdersService = {
    orders: [],
    orderAvailable: {} as Order,
    fetchDailyOrders: thunk((actions, state): Promise<void> => {
        return new Promise<void>((resolve) => {
            axios.get<Order[]>(`${environtments.ORDERS_SERVICE}/today`)
                .then(data => {
                    const list = data.data.filter(order => order.status === OrderStatus.Prepared) as Order[];
                    actions.saveOrders(list);
                    resolve();
                }).catch(() => resolve())
        })
    }),
    notifyPickup: thunk((actions,_, state): Promise<void> => {
        return new Promise<void>((resolve) => {
            axios.patch<void>(`${environtments.ORDERS_SERVICE}`, {id:state.getState().orderAvailable.id, status: 4})
                .then(() => {
                    resolve();
                }).catch(() => resolve())
        })
    }),
    notifyDelivered: thunk((actions,_, state): Promise<void> => {
        return new Promise<void>((resolve) => {
            axios.patch<void>(`${environtments.ORDERS_SERVICE}`, {id:state.getState().orderAvailable.id, status: 5})
                .then(() => {
                    state.getState().orderAvailable = {} as Order;
                    resolve();
                }).catch(() => resolve())
        })
    }),
    pushOrderToStack: action((state, { payload }) => {
        const order:Order = {
            id: payload.orderNumber,
            firstName: payload.customerName.substr(0, payload.customerName.indexOf(' ')),
            lastName: payload.customerName.substr(payload.customerName.indexOf(' ') + 1),
            address: payload.location,
            phone: payload.customerPhone,
            status: OrderStatus.Prepared
        }
        state.orders.push(order);
        if (state.orders.length === 1) {
            console.log(order)
            state.orderAvailable = order;
        }
    }),
    removeOrderFromStack: action((state, {payload}) => {
        if (payload.orderStatus === OrderStatus.Delivering) {
            const orderIndex = state.orders.findIndex(o => o.id === payload.orderNumber)
            if (orderIndex !== -1) {
                state.orders.splice(orderIndex,1);
                state.orderAvailable = state.orders.length > 0 ? state.orders[0] : {} as Order;
            }
        }
    }),
    loading: false,
	initiateLoading: action((state) => {
		state.loading = true;
	}),
	finalizeLoading: action((state) => {
		state.loading = false;
	}),
    saveOrders: action((state, orders) => {
        state.orders = orders;
    })
};
