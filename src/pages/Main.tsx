import React, { useEffect } from 'react';
import {  IonText, IonPage, IonContent, IonAlert,} from '@ionic/react';
import { socket, useStoreActions, useStoreState } from '../store';

export const Main: React.FC = () => {
    const removeOrderFromStack = useStoreActions(actions => actions.ordersService.removeOrderFromStack);
    const pushOrderToStack = useStoreActions(actions => actions.ordersService.pushOrderToStack);
    
    const orderAvailable = useStoreState(state => state.ordersService.orderAvailable);

    useEffect(() => {
        socket.on.OrderReadyForPickup = pushOrderToStack;
        socket.on.OrderStatusChange = removeOrderFromStack;
    }, [pushOrderToStack,removeOrderFromStack]);

	return (
        <IonPage>
            <IonContent>
                <IonText>
                    Chorba Driver 
                </IonText>
                <IonAlert
                    isOpen={orderAvailable.orderNumber !== undefined}
                    header="Order available!"
                    cssClass="rounded-lg shadow-lg"
                    message={`${orderAvailable.orderNumber}`}
                    buttons={['OK']}
                />
            </IonContent>
        </IonPage>
	);
};
