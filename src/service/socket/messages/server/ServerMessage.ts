import { OrderReadyForPickupMessage } from "./OrderReadyForPickupMessage";
import { OrderStatusChangeMessage } from "./OrderStatusChangeMessage";

export type ServerMessage = OrderReadyForPickupMessage | OrderStatusChangeMessage