import React, { ReactElement, useEffect, useState } from 'react';
import {  IonText, IonPage, IonContent, IonButton, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonItem, IonLabel} from '@ionic/react';
import { socket, useStoreActions, useStoreState } from '../store';
import { OrderStatus } from '../service/socket/messages/server/OrderStatusChangeMessage';

export interface Order {
    id: number;
    firstName: string;
    lastName: string;
    address: string;
    phone: string;
    status: OrderStatus;
}

export const Main: React.FC = () => {
    const removeOrderFromStack = useStoreActions(actions => actions.ordersService.removeOrderFromStack);
    const pushOrderToStack = useStoreActions(actions => actions.ordersService.pushOrderToStack);
    const fetchOrders = useStoreActions(actions => actions.ordersService.fetchDailyOrders);
    const notifyDelivered = useStoreActions(actions => actions.ordersService.notifyDelivered);
    const notifyPickup = useStoreActions(actions => actions.ordersService.notifyPickup);

    const orderAvailable = useStoreState(state => state.ordersService.orderAvailable);

    const [orderPicked,setOrderPicked] = useState(false);

    useEffect(() => {
        socket.on.OrderReadyForPickup = pushOrderToStack;
        socket.on.OrderStatusChange = removeOrderFromStack;
        (async () => {
            try {
                await fetchOrders();
            } catch (error) {
                
            }
        })();
    }, [pushOrderToStack, removeOrderFromStack]);
    
    const handleAction = () => {
        if (orderPicked) {
            notifyDelivered();
            setOrderPicked(false);
        } else {
            notifyPickup();
            setOrderPicked(true);
        }
    }
    const orderComponent = () : ReactElement => {
        return (
            <div className="relative p-6 ">
                <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-b from-yellow-800 to-yellow-500 shadow-lg transform skew-y-6 sm:skew-y-0 sm:rotate-6 rounded-3xl 2xl:skew-y-4 2xl:rotate-4"
                    ></div>
                    <div className="relative w-full">
                        <div className="flex relative flex-col bg-white rounded-xl shadow-lg pt-4">
                            <div className="py-2">
                                <span>Order Number: {orderAvailable.id}</span>
                            </div>
                            <div className="py-2">
                                <span>Addres: {orderAvailable.address}</span>
                            </div>
                            <div className="py-2">
                                <span>Customer Name: {orderAvailable.firstName} {orderAvailable.lastName}</span>
                            </div>
                            <div className="py-2">
                                <span>Phone: {orderAvailable.phone}</span>
                            </div>
                            <div>
                                <button
                                    onClick={handleAction}
                                    className="px-4 w-full py-2 shadow-md rounded-md font-semibold text-gray-800 mt-4 bg-gradient-to-b from-gray-100 to-gray-200"
                                >{orderPicked ? "Order Delivered" : 'Pick Order'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
	return (
        <IonPage>
            <IonContent class="ion-text-center">
                <div className="flex flex-col justify-center h-full">
                    {
                        orderAvailable.id === undefined
                            ? <IonText>Waiting for new orders to come...</IonText>
                            :
                            orderComponent()
                    }
                </div>
            </IonContent>
        </IonPage>
	);
};
