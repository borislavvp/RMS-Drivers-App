import { Message } from "../Message";
import { ServerMessageType } from "./ServerMessageType";

export enum OrderStatus{
    New = "New",
    Preparing = "Preparing",
    Prepared = "Prepared",
    Delivering = "Delivering",
    Delivered = "Delivered"
}

interface OrderStatusChangePayload {
  orderNumber: number;
  orderStatus: OrderStatus
}

export class OrderStatusChangeMessage implements Message {
  type = ServerMessageType.ORDER_STATUS_CHANGE;
  payload: OrderStatusChangePayload;
  constructor(payload: OrderStatusChangePayload) {
    this.payload = payload;
  }
}
