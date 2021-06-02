import { OrderReadyForPickupMessage } from "../messages/server/OrderReadyForPickupMessage";
import { OrderStatusChangeMessage } from "../messages/server/OrderStatusChangeMessage";
import { ServerMessage } from "../messages/server/ServerMessage";
import { ServerMessageType } from "../messages/server/ServerMessageType";
import { SocketMessagesListeners } from "../types/SocketMessageListneners";

const IsMessage = (message: ServerMessage, expected: ServerMessageType) => message.type === expected;

export const handleSocketMessage = (message: ServerMessage, socketListeners: SocketMessagesListeners) => {
    if (IsMessage(message, ServerMessageType.ORDER_READY_FOR_PICKUP)) {
        socketListeners.OrderReadyForPickup?.(message as OrderReadyForPickupMessage);
    }
    if (IsMessage(message, ServerMessageType.ORDER_STATUS_CHANGE)) {
        socketListeners.OrderStatusChange?.(message as OrderStatusChangeMessage);
    }
}