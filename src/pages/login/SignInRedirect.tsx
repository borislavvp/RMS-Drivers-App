import React, { useEffect } from 'react';
import { useHistory } from 'react-router';
import { useStoreActions } from '../../store';

export const SignInRedirect: React.FC = () => {
    const handleLoginCallback = useStoreActions((state) => state.authenticationService.handleLoginCallback)
    const history = useHistory();
    useEffect(() => {
        (async () => {
            try {
                await handleLoginCallback();
                history.push("/")
            } catch (error) {
                history.push("/")
            }
        })()
    }, []);
    
    return (null);
};
