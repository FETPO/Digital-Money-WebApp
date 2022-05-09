import {useEffect, useState} from "react";
import {dayjs} from "utils/index";

const Clock = () => {
    const [date, setDate] = useState(() => dayjs());

    useEffect(() => {
        const timer = setInterval(() => setDate(dayjs()), 30000);
        return () => {
            clearInterval(timer);
        };
    });

    return date.format("LL");
};

export default Clock;
