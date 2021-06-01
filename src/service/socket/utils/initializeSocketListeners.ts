import { SocketMessagesListeners } from "../types/SocketMessageListneners"

export const initializeSocketListeners = (): SocketMessagesListeners => {
    return {
        OrderReadyForPickup: () => null,
    }
}