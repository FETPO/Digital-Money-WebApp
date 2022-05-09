import context from "context";
import Echo from "laravel-echo";

let config = {};

const {driver, connection} = context.broadcast;

if (typeof window === "object") {
    const host = window.location.hostname;
    switch (driver) {
        case "pusher":
            config = {
                broadcaster: "pusher",
                key: connection.key,
                forceTLS: document.location.protocol === "https:",
                wsHost: window.location.hostname,
                wsPort: connection.port,
                wssPort: connection.port,
                cluster: connection.cluster,
                disableStats: true
            };
            break;
        case "redis":
            config = {
                broadcaster: "socket.io",
                host: host + ":6001"
            };
    }
}

export default new Echo(config);
