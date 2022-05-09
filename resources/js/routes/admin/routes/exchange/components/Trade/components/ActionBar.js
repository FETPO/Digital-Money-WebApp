import React from "react";
import {defineMessages, useIntl} from "react-intl";
import {StyledToolbar} from "styles/toolbar.style";
import SearchTextField from "components/SearchTextField";

const messages = defineMessages({
    searchPlaceholder: {defaultMessage: "Search user..."}
});

const ActionBar = ({search, onSearchChange}) => {
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

export default ActionBar;
