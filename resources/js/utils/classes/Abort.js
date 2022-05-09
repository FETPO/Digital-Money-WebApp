import {useVar} from "../index";
import {useEffect} from "react";

class Abort {
    reset() {
        this.controller = new AbortController();
    }

    isAborted() {
        return this.controller && this.controller.signal.aborted;
    }

    abort() {
        return this.controller && this.controller.abort();
    }
}

/**
 * Use Abort
 *
 * @returns {Abort}
 */
export function useAbort() {
    const abort = useVar(() => new Abort());

    useEffect(() => {
        abort.reset();
        return () => {
            abort.abort();
        };
    }, [abort]);

    return abort;
}
