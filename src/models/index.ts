import { authenticationService,IAuthenticationService } from '../service/AuthenticationService';
import { ISocketService } from '../service/socket/SocketService';
export interface StoreModel {
	authenticationService: IAuthenticationService,
}

const model: StoreModel = {
	authenticationService,
};

export default model;
