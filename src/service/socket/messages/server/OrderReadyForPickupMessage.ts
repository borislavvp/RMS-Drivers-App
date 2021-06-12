import { Order } from "../../../../pages/Main";
import { Message } from "../Message";
import { ServerMessageType } from "./ServerMessageType";

export interface OrderReadyForPickupPayload {
  orderNumber: number;
  orderDate: string,
  customerName: string,
  customerPhone: string,
  location: string,
  amount: number,
}

export class OrderReadyForPickupMessage implements Message {
  type = ServerMessageType.ORDER_READY_FOR_PICKUP;
  payload: OrderReadyForPickupPayload;
  constructor(payload: OrderReadyForPickupPayload) {
    this.payload = payload;
  }
}
