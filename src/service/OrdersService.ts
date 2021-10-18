import { action, Action, thunk, Thunk } from 'easy-peasy';
import { OrderReadyForPickupMessage } from './socket/messages/server/OrderReadyForPickupMessage';
import { OrderStatus, OrderStatusChangeMessage } from './socket/messages/server/OrderStatusChangeMessage';
import { Order } from '../pages/Main';
import { environtments } from '../environments';
import { axiosInstance } from '../store';
import { authenticationService } from './AuthenticationService';

export interface IOrdersService {
    orders: Order[],
    orderAvailable: Order,
    currentPickedOrder: Order,
    fetchDailyOrders: Thunk<IOrdersService, void, Promise<void>>;
    notifyPickup: Thunk<IOrdersService, void,IOrdersService,{}, Promise<void>  >;
    notifyDelivered: Thunk<IOrdersService, void, IOrdersService, {}, Promise<void>>;
    saveOrders: Action<IOrdersService, Order[]>;
    pushOrderToStack: Action<IOrdersService, OrderReadyForPickupMessage>;
    removeOrderFromStack: Action<IOrdersService, OrderStatusChangeMessage>;
    loading: boolean;
	setPickedOrder: Action<IOrdersService,Order>;
	initiateLoading: Action<IOrdersService>;
	finalizeLoading: Action<IOrdersService>;
}

export const ordersService: IOrdersService = {
    orders: [],
    orderAvailable: {} as Order,
    currentPickedOrder: {} as Order,
    fetchDailyOrders: thunk((actions,_, state): Promise<void> => {
        return new Promise<void>((resolve) => {
            authenticationService.userManager.getUser().then(user => {
                axiosInstance.defaults.headers.common["Authorization"] = "Bearer " + user!.access_token;
                axiosInstance.get<Order[]>(`${environtments.ORDERS_SERVICE}/today`)
                    .then(data => {
                        const list = data.data.filter(order => order.status === OrderStatus.Prepared) as Order[];
                        if (list.length > 0) {
                            actions.saveOrders(list);
                            state.getState().orderAvailable = state.getState().orders[0];
                        }
                        resolve();
                    }).catch(() => resolve())
            })
        })
    }),
    notifyPickup: thunk((actions,_, state): Promise<void> => {
        return new Promise<void>((resolve, reject) => {
            authenticationService.userManager.getUser().then(user => {
                axiosInstance.defaults.headers.common["Authorization"] = "Bearer " + user!.access_token;
                actions.setPickedOrder(state.getState().orderAvailable);
                axiosInstance.patch<void>(`${environtments.ORDERS_SERVICE}`, { id: state.getState().orderAvailable.id, status: 4 })
                    .then(() => {
                        resolve();
                    })
                    .catch(() => {
                        actions.setPickedOrder({} as Order);
                        reject();
                    })
            }).catch(() => reject())
        })
    }),
    notifyDelivered: thunk((actions,_, state): Promise<void> => {
        return new Promise<void>((resolve, reject) => {
            authenticationService.userManager.getUser().then(user => {
                axiosInstance.defaults.headers.common["Authorization"] = "Bearer " + user!.access_token;
                axiosInstance.patch<void>(`${environtments.ORDERS_SERVICE}`, { id: state.getState().orderAvailable.id, status: 5 })
                    .then(() => {
                        state.getState().orderAvailable = {} as Order;
                        actions.setPickedOrder({} as Order);
                        resolve();
                    }).catch(() => reject())
            }).catch(() => reject())
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
                state.orders.splice(orderIndex, 1);
                if (state.currentPickedOrder.id !== state.orderAvailable.id) {
                    state.orderAvailable = state.orders.length > 0 ? state.orders[0] : {} as Order;
                }
            }
        }
    }),
    loading: false,
	setPickedOrder: action((state,payload) => {
		state.currentPickedOrder = payload;
	}),
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
