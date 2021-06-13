import React, { useEffect } from 'react';
import { useHistory } from 'react-router';
import { useStoreActions } from '../../store';

export const SignOutRedirect: React.FC = () => {
    const handleLogoutCallback = useStoreActions((state) => state.authenticationService.handleLogoutCallback)
    const history = useHistory();
    
    useEffect(() => {
        (async () => {
            try {
                await handleLogoutCallback();
                history.push("/")
            } catch (error) {
                history.push("/")
            }
        })()
    }, []);
    
    return (null);
};
