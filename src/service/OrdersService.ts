import { action, Action, thunk, Thunk } from 'easy-peasy';
import axios from 'axios';

import { OrderReadyForPickupMessage } from './socket/messages/server/OrderReadyForPickupMessage';
import { OrderStatus, OrderStatusChangeMessage } from './socket/messages/server/OrderStatusChangeMessage';
import { authenticationService } from './AuthenticationService';
import { Order } from '../pages/Main';

export interface IOrdersService {
    orders: Order[],
    orderAvailable: Order,
    fetchDailyOrders: Thunk<IOrdersService, {}, Promise<void>>;
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
        return new Promise<void>(() => {
            authenticationService.userManager.getUser().then(user => {
            axios.defaults.headers.common["Authorization"] = "Bearer " + user!.access_token;
            axios.get<Order[]>('https://localhost:5052/orders')
                .then(data => {
                    var list = data.data.filter(order => order.status == OrderStatus.Prepared) as Order[];
                    actions.saveOrders(list);
                })
            }) 
        })
    }),
    pushOrderToStack: action((state, { payload }) => {
        console.log("PAYLOAD", payload)
        var order = {
            id: payload.orderNumber,
            firstName: payload.customerName.substr(0, payload.customerName.indexOf(' ')),
            lastName: payload.customerName.substr(payload.customerName.indexOf(' ') + 1),
            address: payload.location,
            phone: payload.customerPhone,
            status: OrderStatus.Prepared
        }
        console.log("ORDER", order)
        // state.orderAvailable = payload;
        state.orders.push(order as Order);
        console.log("ORDERS", state.orders)
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
