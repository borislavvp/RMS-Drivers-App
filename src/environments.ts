export const environtments = {
    IDENTITY_AUTHORITY: process.env.NODE_ENV === "development"
        ? "https://localhost:5001"
        : "https://51.141.4.73/api/v1/identity",
    ORDERS_STATUS_SERVICE: process.env.NODE_ENV === "development"
        ? "ws://localhost:3333"
        : "wss://51.141.4.73/api/v1/orders-status-socket",
    ORDERS_SERVICE: process.env.NODE_ENV === "development"
        ? "https://localhost:5005"
        : "https://51.141.4.73/api/v1/drivers-gateway/api/orders"
}