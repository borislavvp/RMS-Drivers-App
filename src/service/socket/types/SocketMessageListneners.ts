import { OrderReadyForPickupMessage } from "../messages/server/OrderReadyForPickupMessage";

export interface SocketMessagesListeners{
   OrderReadyForPickup: (orderReadyForPickupMessage:OrderReadyForPickupMessage) => void,
}