import { ActionCreator } from "easy-peasy"
import { OrderReadyForPickupMessage } from "../messages/server/OrderReadyForPickupMessage"
import { OrderStatusChangeMessage } from "../messages/server/OrderStatusChangeMessage"
import { SocketMessagesListeners } from "../types/SocketMessageListneners"

export const initializeSocketListeners = (
    orderReadyForPickupListener?: ActionCreator<OrderReadyForPickupMessage>,
    orderStatusChangedListener?: ActionCreator<OrderStatusChangeMessage>): SocketMessagesListeners => {
    
    return {
        OrderReadyForPickup: orderReadyForPickupListener!,
        OrderStatusChange: orderStatusChangedListener!,
    }
}