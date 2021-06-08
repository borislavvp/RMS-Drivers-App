import React, { useEffect } from 'react';
import {  IonText, IonPage, IonContent, IonAlert, IonButton, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonCardSubtitle, IonItem, IonLabel} from '@ionic/react';
import { socket, useStoreActions, useStoreState } from '../store';

export const Main: React.FC = () => {
    const removeOrderFromStack = useStoreActions(actions => actions.ordersService.removeOrderFromStack);
    const pushOrderToStack = useStoreActions(actions => actions.ordersService.pushOrderToStack);
    
    const orderAvailable = useStoreState(state => state.ordersService.orderAvailable);

    var pickedup = Boolean(false);
    var address = String("Eindhoven");
    var name = String("Thaqi");
    var phone = String("0123456789");

    useEffect(() => {
        socket.on.OrderReadyForPickup = pushOrderToStack;
        socket.on.OrderStatusChange = removeOrderFromStack;
    }, []);

	return (
        <IonPage>
            <IonContent>
                <IonCard>
                    <IonCardHeader>
                        <IonCardTitle>Order Number 1</IonCardTitle>
                    </IonCardHeader>

                    <IonCardContent>
                    <IonItem>
                        <IonLabel>Addres: {address}</IonLabel>
                    </IonItem>
                    <IonItem>
                        <IonLabel>Customer Name: {name}</IonLabel>
                    </IonItem>
                    <IonItem>
                        <IonLabel>Phone: {phone}</IonLabel>
                    </IonItem>
                       Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio, maxime!
                    </IonCardContent>
                </IonCard>
                {pickedup == false && <IonButton>
                    Notify Pick-Up
                </IonButton>}
                {pickedup == true && <IonButton>
                    Delivered
                </IonButton>}
                
                {orderAvailable.orderNumber !== undefined && <IonAlert
                    isOpen={true}
                    header="Order available!"
                    cssClass="rounded-lg shadow-lg"
                    message={`${orderAvailable.orderNumber}`}
                    buttons={['OK']}
                />}
            </IonContent>
        </IonPage>
	);
};
