import React, { useEffect, useState } from 'react';
import {  IonText, IonPage, IonContent, IonAlert, IonIcon, IonButton, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonCardSubtitle, IonItem, IonLabel} from '@ionic/react';
import { socket, useStoreActions, useStoreState } from '../store';
import { OrderStatus } from '../service/socket/messages/server/OrderStatusChangeMessage';
import axios from 'axios';
import { authenticationService } from '../service/AuthenticationService';

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

    const orderAvailable = useStoreState(state => state.ordersService.orderAvailable);
    const orders = useStoreState(state => state.ordersService.orders);

    useEffect(() => {
        fetchOrders({})
    }, [])

    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

    useEffect(() => {
        socket.on.OrderReadyForPickup = pushOrderToStack;
        socket.on.OrderStatusChange = removeOrderFromStack;
    }, [pushOrderToStack,removeOrderFromStack]);
    
    const pickUp = () => {
        setSelectedOrder(orders[0]);
        authenticationService.userManager.getUser().then(user => {
            axios.defaults.headers.common["Authorization"] = "Bearer " + user!.access_token;
            axios.patch("https://localhost:5052/orders", {id: orders[0].id, status: 4});
        })
    } 
    
    const deliver = () => {
        axios.patch("https://localhost:5052/orders", {id: selectedOrder?.id, status: 5});
        setSelectedOrder(null)
    }

	return (
        <IonPage>
            <IonContent class="ion-text-center">
            {(orders[0] !== undefined && !selectedOrder) && 
                <>
                    <IonCard>
                        <IonCardHeader>
                            <IonCardTitle>Order Number {orders[0].id.toString()}</IonCardTitle>
                        </IonCardHeader>
                        <IonCardContent>
                            <IonItem>
                                <IonLabel>Addres: {orders[0].address.toString()}</IonLabel>
                            </IonItem>
                            <IonItem>
                                <IonLabel>Customer Name: {orders[0].firstName.toString()} {orders[0].lastName.toString()}</IonLabel>
                            </IonItem>
                            <IonItem>
                                <IonLabel>Phone: {orders[0].phone.toString()}</IonLabel>
                            </IonItem>
                            <div className="ion-text-center">  
                                <IonButton onClick={() => pickUp()}>Notify Pick-Up</IonButton>
                            </div>
                        </IonCardContent>
                    </IonCard>
                </>
            }
            {selectedOrder && 
                <>
                    <IonCard>
                        <IonCardHeader>
                            <IonCardTitle>Order Number {selectedOrder.id.toString()}</IonCardTitle>
                        </IonCardHeader>
                        <IonCardContent>
                            <IonItem>
                                <IonLabel>Addres: {selectedOrder.address.toString()}</IonLabel>
                            </IonItem>
                            <IonItem>
                                <IonLabel>Customer Name: {selectedOrder.firstName.toString()} {selectedOrder.lastName.toString()}</IonLabel>
                            </IonItem>
                            <IonItem>
                                <IonLabel>Phone: {selectedOrder.phone.toString()}</IonLabel>
                            </IonItem>
                            <div className="ion-text-center">  
                                <IonButton onClick={() => deliver()}>Deliver</IonButton>
                            </div>
                        </IonCardContent>
                    </IonCard>
                </>
            }
            {(orders[0] === undefined && !selectedOrder) && 
                <IonText>Waiting for new orders to come...</IonText>
            }
            <IonAlert
                isOpen={orderAvailable.id !== undefined && !selectedOrder}
                header="Order available!"
                cssClass="rounded-lg shadow-lg"
                message={`${orderAvailable.id}`}
                buttons={['OK']}
            />
            </IonContent>
        </IonPage>
	);
};
