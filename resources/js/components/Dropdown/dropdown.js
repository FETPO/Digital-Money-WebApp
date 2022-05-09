import {Button, Menu} from "@mui/material";
import React, {
    createElement,
    Fragment,
    useCallback,
    useState,
    cloneElement
} from "react";

const Dropdown = ({
    component = Button,
    menuItems,
    menuProps,
    ...otherProps
}) => {
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClose = useCallback(() => {
        setAnchorEl(null);
    }, []);

    const handleClick = useCallback((e) => {
        setAnchorEl(e.currentTarget);
    }, []);

    return (
        <Fragment>
            {createElement(component, {
                ...otherProps,
                onClick: handleClick
            })}

            {createElement(
                Menu,
                {
                    ...menuProps,
                    open: Boolean(anchorEl),
                    onClose: handleClose,
                    anchorEl
                },
                menuItems?.map((item) => {
                    return cloneElement(item, {
                        onClick: () => {
                            item.props.onClick?.();
                            handleClose();
                        }
                    });
                })
            )}
        </Fragment>
    );
};

export default Dropdown;
