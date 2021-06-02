import { authenticationService,IAuthenticationService } from '../service/AuthenticationService';
import { ordersService,IOrdersService } from './OrdersService';
export interface StoreModel {
    authenticationService: IAuthenticationService,
    ordersService:IOrdersService
}

const model: StoreModel = {
    authenticationService,
    ordersService
};

export default model;
