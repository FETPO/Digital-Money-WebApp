import Echo from "./echo";
import {useMemo} from "react";

/**
 * Use Broadcast
 *
 * @param channel
 * @returns {Channel}
 */
export function useBroadcast(channel) {
    return useMemo(() => Echo.channel(channel), [channel]);
}

/**
 * Use Private Broadcast
 *
 * @param channel
 * @returns {Channel}
 */
export function usePrivateBroadcast(channel) {
    return useMemo(() => Echo.private(channel), [channel]);
}
