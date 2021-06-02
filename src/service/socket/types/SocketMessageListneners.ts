import { ActionCreator } from "easy-peasy";
import { OrderReadyForPickupMessage} from "../messages/server/OrderReadyForPickupMessage";
import { OrderStatusChangeMessage } from "../messages/server/OrderStatusChangeMessage";

export interface SocketMessagesListeners{
   OrderReadyForPickup:ActionCreator<OrderReadyForPickupMessage>,
   OrderStatusChange: ActionCreator<OrderStatusChangeMessage>,
}