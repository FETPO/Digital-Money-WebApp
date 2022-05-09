import React from "react";
import SearchTextField from "components/SearchTextField";
import {StyledToolbar} from "styles/toolbar.style";
import {defineMessages, useIntl} from "react-intl";

const messages = defineMessages({
    searchPlaceholder: {defaultMessage: "Search user..."}
});

const TransferActionBar = ({search, onSearchChange}) => {
    const intl = useIntl();

    return (
        <StyledToolbar>
            <SearchTextField
                onSearchChange={onSearchChange}
                search={search}
                placeholder={intl.formatMessage(messages.searchPlaceholder)}
                sx={{mr: 2}}
            />
        </StyledToolbar>
    );
};

export default TransferActionBar;
