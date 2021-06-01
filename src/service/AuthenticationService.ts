import { action, thunk, Action, Thunk, ActionMapper } from 'easy-peasy';
import { User, UserManager } from 'oidc-client';
import axios from 'axios';
import { ISocketService } from './socket/SocketService';

export interface ILoginInput {
	email: string;
	password: string;
}

export interface IAuthenticationService {
    loading: boolean;
    user: Thunk<IAuthenticationService, {}, {}, Promise<User | null>>,
    isLoggedIn : boolean,
    checkAuthState: Thunk<IAuthenticationService, void, ISocketService,{},Promise<boolean>>,
    userManager: UserManager,
    login: Thunk<IAuthenticationService, ILoginInput, ISocketService,{},Promise<void>>;
    handleLoginCallback: Thunk<IAuthenticationService, void, ISocketService,{},Promise<void>>;
    logout: Thunk<IAuthenticationService, void, {},Promise<void>>;
    handleLogoutCallback: Thunk<IAuthenticationService, void, {},{},Promise<void>>;
	initiateLoading: Action<IAuthenticationService>;
	finalizeLoading: Action<IAuthenticationService>;
}

export const authenticationService: IAuthenticationService = {
    loading: false,
    isLoggedIn:false,
    userManager: new UserManager({
      authority: "https://localhost:5001",
      client_id: "MOBILE_APP_ID",
      redirect_uri:  window.location.protocol + "//" + window.location.host + "/signin-oidc",
      response_type: "code",
      scope: "openid profile proeprestaurantgateway.fullaccess",
      post_logout_redirect_uri: window.location.protocol + "//" + window.location.host + "/signout-callback-oidc",
      automaticSilentRenew: true,
      silent_redirect_uri: window.location.protocol + "//" + window.location.host + "/assets/silent-callback.html"
    }),
    user: thunk((actions,_,state) => {
        return new Promise<User | null>((resolve, reject) => {
            state.getState().userManager.getUser()
                .then(user => {
                resolve(user);
                }).catch(() => {
                    reject();
                })
            });
    }),
    checkAuthState: thunk((actions,_,state) => {
        return new Promise<boolean>(resolve => {
            actions.initiateLoading();
            state.getState().userManager.getUser()
            .then((user) => {
                const currentState = state.getState().isLoggedIn;
                const IsLoggedIn = user ? !user.expired : false;
                if (currentState !== IsLoggedIn) {
                    if (IsLoggedIn) {
                        console.log(state.injections)
                        state.injections.connect("ws://localhost:3333", user!.access_token)
                    }
                }
                        console.log("ASD" + IsLoggedIn)
                state.getState().isLoggedIn = IsLoggedIn;
                console.log(state)
                resolve(IsLoggedIn);
            })
            .catch(() => {
                state.getState().isLoggedIn = false;
                resolve(false);
            }).finally(() => actions.finalizeLoading())
        })
    }),
    login: thunk((actions, { email, password },state) : Promise<void> => {
        return new Promise<void>((resolve,reject) => {
            const manager = state.getState().userManager;
            actions.initiateLoading();
            axios.post("https://localhost:5001/api/login", { email, password }, {
                withCredentials:true
            })
                .then(r => console.log(r))
                .then(() => manager.signinRedirect()
                    .then(() => resolve())
                    .catch(() => reject())
                    .finally(() => actions.finalizeLoading()))
                .then(() => resolve())
                .catch(() => reject())
                .finally(() => actions.finalizeLoading())
        })
    }),
    handleLoginCallback : thunk((actions,_,state) : Promise<void> => {
        return new Promise<void>((resolve, reject) => {
            state.getState().userManager
                .signinRedirectCallback()
                .then(() => {
                    const manager = state.getState().userManager;
                    manager.getUser()
                    .then((user) =>{
                        console.log(user)
                        axios.defaults.headers.common["Authorization"] = "Bearer " + user!.access_token;
                        // manager.events.addUserSignedOut(() => state.injections.disconnect())
                        // manager.events.addAccessTokenExpired(() => state.injections.disconnect())
                        resolve()
                    })
                    .catch(() => reject());
                })
                .catch(() => reject());
        })
    }),
    logout: thunk((actions, _,state) : Promise<void> => {
        return new Promise<void>((resolve, reject) => {
             state.getState().userManager
                .signoutRedirect()
                .then(() => resolve())
                .catch(() => reject());
            })
    }),
    handleLogoutCallback : thunk((actions,_,state) : Promise<void> => {
        return new Promise<void>((resolve, reject) => {
            state.getState().userManager
                .signoutRedirectCallback()
                .then(() => {
                    axios.defaults.headers = null;
                    resolve();
                })
                .catch(() => reject());
        })
    }),
	initiateLoading: action((state) => {
		state.loading = true;
	}),
	finalizeLoading: action((state) => {
		state.loading = false;
	}),
};
