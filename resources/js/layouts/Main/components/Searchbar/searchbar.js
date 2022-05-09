import React, {useState} from "react";
import {Icon} from "@iconify/react";
import searchFill from "@iconify/icons-eva/search-fill";
import {
    Box,
    Button,
    ClickAwayListener,
    IconButton,
    Input,
    InputAdornment,
    Slide
} from "@mui/material";
import {SearchbarStyle} from "./searchbar.style";
import {defineMessages, FormattedMessage, useIntl} from "react-intl";
import SearchIcon from "@mui/icons-material/Search";

const messages = defineMessages({placeholder: {defaultMessage: "Search…"}});

const Searchbar = () => {
    const [isOpen, setOpen] = useState(false);
    const intl = useIntl();

    return (
        <ClickAwayListener onClickAway={() => setOpen(false)}>
            <Box>
                {!isOpen && (
                    <IconButton onClick={() => setOpen(true)}>
                        <Icon icon={searchFill} width={20} height={20} />
                    </IconButton>
                )}

                <Slide direction="down" in={isOpen} mountOnEnter unmountOnExit>
                    <SearchbarStyle>
                        <Input
                            autoFocus
                            placeholder={intl.formatMessage(
                                messages.placeholder
                            )}
                            fullWidth
                            sx={{
                                mr: 1,
                                fontWeight: "fontWeightBold"
                            }}
                            disableUnderline
                            startAdornment={
                                <InputAdornment position="start">
                                    <SearchIcon color="text.disabled" />
                                </InputAdornment>
                            }
                        />
                        <Button
                            onClick={() => setOpen(false)}
                            variant="contained">
                            <FormattedMessage defaultMessage="Search" />
                        </Button>
                    </SearchbarStyle>
                </Slide>
            </Box>
        </ClickAwayListener>
    );
};

export default Searchbar;
