import React from "react";
import {Icon} from "@iconify/react";
import homeFill from "@iconify-icons/ri/layout-grid-fill";
import ActionButton from "components/ActionButton";
import {Link as RouterLink} from "react-router-dom";
import {router} from "utils/index";

const UserArea = () => {
    return (
        <ActionButton component={RouterLink} to={router.generatePath("home")}>
            <Icon icon={homeFill} />
        </ActionButton>
    );
};

export default UserArea;
