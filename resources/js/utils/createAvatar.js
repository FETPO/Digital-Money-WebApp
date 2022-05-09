import {capitalize} from "lodash";

const PRIMARY_NAME = ["A", "N", "H", "L", "Q", "9", "8"];
const INFO_NAME = ["F", "G", "T", "I", "J", "1", "2", "3"];
const SUCCESS_NAME = ["K", "D", "Y", "B", "O", "4", "5"];
const WARNING_NAME = ["P", "E", "R", "S", "C", "U", "6", "7"];
const ERROR_NAME = ["V", "W", "X", "M", "Z"];

function getContent(name) {
    return capitalize(name && name.charAt(0));
}

function getAvatarColor(name) {
    if (PRIMARY_NAME.includes(getContent(name))) {
        return "primary";
    }
    if (INFO_NAME.includes(getContent(name))) {
        return "info";
    }
    if (SUCCESS_NAME.includes(getContent(name))) {
        return "success";
    }
    if (WARNING_NAME.includes(getContent(name))) {
        return "warning";
    }
    if (ERROR_NAME.includes(getContent(name))) {
        return "warning";
    }
    return "default";
}

export default function createAvatar(name) {
    return {
        content: getContent(name),
        color: getAvatarColor(name)
    };
}
