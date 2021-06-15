import React, { useEffect } from 'react';
import { Route, Router } from 'react-router-dom';
import { IonApp, IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Main } from './pages/Main';
import { Login } from './pages/login/Login';
import history from './history';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import { SignInRedirect } from './pages/login/SignInRedirect';
import { useStoreActions, useStoreState } from './store';

const App: React.FC = () => {
	const isLoggedIn = useStoreState(state => state.authenticationService.isLoggedIn)
	const loading = useStoreState(state => state.authenticationService.loading)
	const redirecting = useStoreState(state => state.authenticationService.redirecting)
	const checkAuth = useStoreActions(actions => actions.authenticationService.checkAuthState);
	 useEffect(() => {
        (async () => {
			try {
				if (!loading && !redirecting) {
					await checkAuth();
				}
            } catch (error) {
                console.log(error)
            }
        })()
	 }, []);
	
	const getMainComponent = () => isLoggedIn ? Main : Login;
	return (
		<IonApp class="bg-gray-100 ">
			<IonReactRouter>
				<IonRouterOutlet animated={false} class="justify-center flex">
					<Router history={history}>
						<Route path="/" component={getMainComponent()} exact={true} />
						<Route path="/signin-oidc" component={SignInRedirect} exact={true} />
						<Route path="/signout-callback-oidc" component={SignInRedirect} exact={true} />
						<Route path="/login" component={Login} exact={true} />
					</Router>
				</IonRouterOutlet>
			</IonReactRouter>
		</IonApp>
	);
};

export default App;
