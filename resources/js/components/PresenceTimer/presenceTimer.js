import React, {useCallback} from "react";
import IdleTimer from "react-idle-timer";
import {errorHandler, route, useRequest} from "services/Http";
import {useAuth} from "models/Auth";

const PresenceTimer = () => {
    const [request] = useRequest();
    const auth = useAuth();

    const onIdle = useCallback(() => {
        if (auth.check()) {
            request.post(route("user.set-away")).catch(errorHandler());
        }
    }, [auth, request]);

    const onActive = useCallback(() => {
        if (auth.check()) {
            request.post(route("user.set-online")).catch(errorHandler());
        }
    }, [auth, request]);

    return (
        <IdleTimer
            onIdle={onIdle}
            onActive={onActive}
            timeout={1000 * 60}
            debounce={250}
        />
    );
};

export default PresenceTimer;
