import React, {useEffect, useMemo, useState} from "react";
import {defineMessages, FormattedMessage, useIntl} from "react-intl";
import {Button, MenuItem, Stack, Typography} from "@mui/material";
import Dropdown from "components/Dropdown";
import {isNumber} from "lodash";

const messages = defineMessages({
    newest: {defaultMessage: "Newest"},
    oldest: {defaultMessage: "Oldest"},
    priceDesc: {defaultMessage: "Price: High - Low"},
    priceAsc: {defaultMessage: "Price: Low - High"}
});

const ShopSorter = ({applySorters}) => {
    const intl = useIntl();
    const [active, setActive] = useState(1);

    const options = useMemo(
        () => [
            {
                field: "created_at",
                sort: "asc",
                label: intl.formatMessage(messages.oldest)
            },
            {
                field: "created_at",
                sort: "desc",
                label: intl.formatMessage(messages.newest)
            },
            {
                field: "value",
                sort: "desc",
                label: intl.formatMessage(messages.priceDesc)
            },
            {
                field: "value",
                sort: "asc",
                label: intl.formatMessage(messages.priceAsc)
            }
        ],
        [intl]
    );

    useEffect(() => {
        const sorters = [];

        if (isNumber(active)) {
            sorters.push({
                field: options[active].field,
                sort: options[active].sort
            });
        }

        applySorters?.(sorters);
    }, [active, options, applySorters]);

    const menuItems = useMemo(() => {
        return options.map((option, key) => (
            <MenuItem
                selected={key === active}
                onClick={() => setActive(key)}
                sx={{typography: "body2"}}
                key={key}>
                {option.label}
            </MenuItem>
        ));
    }, [options, active]);

    return (
        <Dropdown
            color="inherit"
            menuItems={menuItems}
            menuProps={{keepMounted: true}}
            component={Button}
            disableRipple>
            <Stack direction="row" spacing={1}>
                <Typography variant="subtitle2" component="span">
                    <FormattedMessage defaultMessage="Sort By" />
                </Typography>

                {options[active] && (
                    <Typography
                        variant="subtitle2"
                        sx={{color: "text.secondary"}}
                        component="span">
                        {options[active].label}
                    </Typography>
                )}
            </Stack>
        </Dropdown>
    );
};

export default ShopSorter;
