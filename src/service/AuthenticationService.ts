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
    redirecting: boolean;
    user: Thunk<IAuthenticationService, {}, {}, Promise<User | null>>,
    isLoggedIn : boolean,
    checkAuthState: Thunk<IAuthenticationService, void, ISocketService,{},Promise<boolean>>,
    userManager: UserManager,
    login: Thunk<IAuthenticationService, ILoginInput, {},{},Promise<void>>;
    handleLoginCallback: Thunk<IAuthenticationService, void, ISocketService,{},Promise<void>>;
    logout: Thunk<IAuthenticationService, void, {},Promise<void>>;
    handleLogoutCallback: Thunk<IAuthenticationService, void, ISocketService,{},Promise<void>>;
	initiateLoading: Action<IAuthenticationService>;
	finalizeLoading: Action<IAuthenticationService>;
	initiateRedirecting: Action<IAuthenticationService>;
	finalizeRedirecting: Action<IAuthenticationService>;
}

export const authenticationService: IAuthenticationService = {
    loading: false,
    redirecting: false,
    isLoggedIn:false,
    userManager: new UserManager({
      authority: "https://localhost:5001",
      client_id: "MOBILE_APP_ID",
      redirect_uri:  window.location.protocol + "//" + window.location.host + "/signin-oidc",
      response_type: "code",
      scope: "openid profile proepdriversgateway.fullaccess",
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
                        state.injections.connect("ws://localhost:3333", user!.access_token)
                    } else {
                        state.injections.disconnect();
                    }
                }
                state.getState().isLoggedIn = IsLoggedIn;
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
                .then(r => actions.initiateRedirecting())
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
            actions.initiateRedirecting();
            state.getState().userManager
                .signinRedirectCallback()
                .then(() => {
                    const manager = state.getState().userManager;
                    manager.getUser()
                    .then((user) =>{
                        axios.defaults.headers.common["Authorization"] = "Bearer " + user!.access_token;
                        state.injections.connect("ws://localhost:3333", user!.access_token)
                        state.getState().isLoggedIn = true;
                        resolve()
                    })
                    .catch(() => reject())
                    .finally(() => actions.finalizeRedirecting());
                })
                .catch(() => reject())
                .finally(() => actions.finalizeRedirecting());
        })
    }),
    logout: thunk((actions, _,state) : Promise<void> => {
        return new Promise<void>((resolve, reject) => {
            actions.initiateLoading();
             state.getState().userManager
                .signoutRedirect()
                .then(() => resolve())
                .catch(() => reject())
                .finally(() => actions.finalizeLoading())
            })
    }),
    handleLogoutCallback : thunk((actions,_,state) : Promise<void> => {
        return new Promise<void>((resolve, reject) => {
            actions.initiateRedirecting();
            state.getState().userManager
                .signoutRedirectCallback()
                .then(() => {
                    axios.defaults.headers = null;
                    state.getState().isLoggedIn = false;
                    state.injections.disconnect();
                    resolve();
                })
                .catch(() => reject())
                .finally(() => actions.finalizeRedirecting());
        })
    }),
	initiateLoading: action((state) => {
		state.loading = true;
	}),
	finalizeLoading: action((state) => {
		state.loading = false;
	}),
	initiateRedirecting: action((state) => {
		state.redirecting = true;
	}),
	finalizeRedirecting: action((state) => {
		state.redirecting = false;
	}),
};
