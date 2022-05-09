import React, {Fragment, useCallback, useRef, useState, useMemo} from "react";
import {ListItemIcon, ListItemText, MenuItem} from "@mui/material";
import useLocales from "hooks/useLocales";
import MenuPopover from "../MenuPopover";
import ActionButton from "../ActionButton";
import {values} from "lodash";
import FlagIcon from "../FlagIcon";

const Language = () => {
    const anchorRef = useRef(null);
    const {supportedLocales, currentLocale, onChangeLocale} = useLocales();
    const [open, setOpen] = useState(false);

    const changeLocale = useCallback(
        (value) => {
            onChangeLocale(value);
            setOpen(false);
        },
        [onChangeLocale]
    );

    const locales = useMemo(() => {
        return values(supportedLocales);
    }, [supportedLocales]);

    return (
        <Fragment>
            <ActionButton
                ref={anchorRef}
                onClick={() => setOpen(true)}
                sx={{p: 1, width: 40, height: 40}}
                active={open}>
                <FlagIcon code={currentLocale?.region} />
            </ActionButton>

            <MenuPopover
                open={open}
                onClose={() => setOpen(false)}
                anchorEl={anchorRef.current}
                sx={{py: 1}}>
                {locales.map((option) => (
                    <MenuItem
                        key={option.locale}
                        selected={option.locale === currentLocale?.locale}
                        onClick={() => changeLocale(option.locale)}
                        sx={{py: 1, px: 2}}>
                        <ListItemIcon>
                            <FlagIcon code={option.region} />
                        </ListItemIcon>
                        <ListItemText
                            primaryTypographyProps={{variant: "body2"}}>
                            {option.name}
                        </ListItemText>
                    </MenuItem>
                ))}
            </MenuPopover>
        </Fragment>
    );
};

export default Language;
