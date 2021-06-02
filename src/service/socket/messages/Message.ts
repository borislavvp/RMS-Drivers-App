export interface Message {
  type: string | number;
  payload: Record<string, any>;
}