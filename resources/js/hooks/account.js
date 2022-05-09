import {useDispatch, useSelector} from "react-redux";
import {find, first, get} from "lodash";
import WalletAccount from "models/WalletAccount";
import PaymentAccount from "models/PaymentAccount";
import {useEffect, useMemo} from "react";
import {setActiveAccount} from "redux/slices/wallet";

export function useWalletAccounts() {
    return useSelector((state) => {
        return get(state, "wallet.accounts");
    });
}

/**
 * Get active selected account
 *
 * @returns {WalletAccount}
 */
export function useActiveWalletAccount() {
    const {data} = useWalletAccounts();

    const id = useSelector((state) => {
        return get(state, "wallet.activeAccount");
    });

    return useMemo(() => {
        const record = find(data, (o) => {
            return o.id === id;
        });
        return WalletAccount.use(record);
    }, [id, data]);
}

/**
 * Use payment account
 *
 * @returns {{loading, account}}
 */
export function usePaymentAccount() {
    const {data, loading} = useSelector((state) => {
        return get(state, "payment.account");
    });

    const account = useMemo(() => {
        return PaymentAccount.use(data);
    }, [data]);

    return {account, loading};
}

/**
 * Auto select first wallet
 */
export function useWalletAccountSelector() {
    const {data} = useWalletAccounts();
    const dispatch = useDispatch();
    const account = useActiveWalletAccount();

    useEffect(() => {
        if (data.length && account.isEmpty()) {
            dispatch(setActiveAccount(first(data).id));
        }
    }, [account, data, dispatch]);
}
