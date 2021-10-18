import React, { ReactElement, useEffect, useState } from 'react';
import {  IonText, IonPage, IonContent} from '@ionic/react';
import { socket, useStoreActions, useStoreState } from '../store';
import { OrderStatus } from '../service/socket/messages/server/OrderStatusChangeMessage';
import { GoogleMap, withScriptjs, withGoogleMap,Marker, InfoWindow  } from "react-google-maps"

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
    
    const handleAction = async () => {
        if (orderPicked) {
            try {
                await notifyDelivered();
                setOrderPicked(false);
            } catch (error) {
                alert("Something went wrong, please try again!")
            }
        } else {
             try {
                await notifyPickup();
                setOrderPicked(true);
            } catch (error) {
                alert("Something went wrong, please try again!")
            }
        }
    }
    const [markerInfo, toggleMarkeInfo] = useState(true);
    function Map(){
        return(
            <GoogleMap
            defaultZoom={10}
            defaultCenter={{ lat: 51.4445061, lng:5.4700953}}    
            >
                {orderAvailable.id !== undefined &&
                    <Marker
                        onClick={() => toggleMarkeInfo(true)}
                        position={{ lat: 51.4445061, lng: 5.4700953 }
                    }> {markerInfo &&
                        <InfoWindow onCloseClick={() => toggleMarkeInfo(false)}>
                        <button
                                className="font-semibold text-blue-600 underline"
                                onClick={() => window.open("https://maps.google.com?q=" + 51.4445061 + "," + 5.4700953)}
                            >
                                View in Google Maps
                            </button>
                        </InfoWindow>}
                    </Marker>
                }
            </GoogleMap>
        )
    }
    const WrappedMap: any = withScriptjs(withGoogleMap(Map));
    
    const noOrdersComponent = (): ReactElement => {
        return (
            <div
                className={`fixed flex flex-col justify-between bottom-0 shadow-lg rounded-t-xl overflow-hidden bg-white w-full`}
                style={{ height: '9vh', zIndex: 99999 }}
            >
                <div className="py-6 h-full shadow-lg rounded-xl justify-center font-semibold">
                    <IonText>Waiting for new orders to come...</IonText>
                </div>
            </div>
        )
    }
    const orderPickupComponent = (): ReactElement => {
        return (
            <div
                className={`fixed flex flex-col justify-between bottom-0 shadow-lg rounded-t-xl overflow-hidden w-full`}
                style={{ height: '30vh', zIndex: 99999 }}
            >
                    <div className="flex flex-auto px-6 flex-col bg-white pt-6">
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
                    </div>
                    <div className="rounded-t-xl overflow-hidden">
                        <button
                            onClick={handleAction}
                        className={`p-4 w-full text-base shadow-md font-semibold text-white bg-gradient-to-r 
                            from-${orderPicked ? 'blue-800' : 'yellow-800'} to-${orderPicked ? 'blue-600' : 'yellow-500'}`}
                        >{orderPicked ? "Finish Order" : 'Pick Order'}
                        </button>
                    </div>
                </div>
        )
    }
    
	return (
        <IonPage className="overflow-hidden">
            <IonContent class="ion-text-center">
                <div style={{width: '100%', height:orderAvailable.id !== undefined ? '72vh' : '93vh' }}>
                        <WrappedMap 
                        googleMapURL={'https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=AIzaSyAy1MbbVLsvv_grlc3MXhwwZ3WaoeXWko4'}
                        loadingElement={<div style={{ height: `100%` }} />}
                        containerElement={<div style={{ height: `100%` }} />}
                        mapElement={<div style={{ height: `100%` }} />}
                        />
                </div>
                {orderAvailable.id === undefined ? noOrdersComponent() : orderPickupComponent()}
            </IonContent>
        </IonPage>
	);
};
