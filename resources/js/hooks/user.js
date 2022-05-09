import {useSelector} from "react-redux";
import {get} from "lodash";

export function useVerification() {
    return useSelector((state) => {
        return get(state, "user.verification");
    });
}
