import React, {useCallback, useEffect, useState} from "react";
import {errorHandler, route, useRequest} from "services/Http";
import {get} from "lodash";
import {usePrivateBroadcast} from "services/Broadcast";
import {useAuth} from "models/Auth";
import {Box, CircularProgress} from "@mui/material";

const Balance = () => {
    const [balance, setBalance] = useState(0);
    const auth = useAuth();
    const broadcast = usePrivateBroadcast("Auth.User." + auth.user.id);
    const [request, loading] = useRequest();

    const fetchBalance = useCallback(() => {
        request
            .get(route("wallet.account.total-available-price"))
            .then((data) => setBalance(data.formattedPrice))
            .catch(errorHandler());
    }, [request]);

    useEffect(() => {
        fetchBalance();
    }, [fetchBalance]);

    useEffect(() => {
        const channel = "TransferRecordSaved";

        broadcast.listen(channel, (e) => {
            if (get(e, "confirmed")) {
                fetchBalance();
            }
        });
        return () => {
            broadcast.stopListening(channel);
        };
    }, [broadcast, fetchBalance]);

    return <Box>{loading ? <CircularProgress size="0.5em" /> : balance}</Box>;
};

export default Balance;
