import React, {useMemo} from "react";
import {Stack, Typography} from "@mui/material";
import {useCountries, useSupportedCurrencies} from "hooks/global";

const CurrencyCell = ({currency, country}) => {
    const {countries} = useCountries();
    const {currencies} = useSupportedCurrencies();

    const countrySearch = useMemo(
        () =>
            countries.find((c) => {
                return c.code === country;
            }),
        [countries, country]
    );

    const currencySearch = useMemo(
        () =>
            currencies.find((c) => {
                return c.code === currency;
            }),
        [currencies, currency]
    );

    return (
        currencySearch && (
            <Stack sx={{minWidth: 0}}>
                <Typography variant="body2" noWrap>
                    {`${currencySearch.code} (${currencySearch.name})`}
                </Typography>

                {countrySearch && (
                    <Typography
                        variant="caption"
                        sx={{color: "text.secondary"}}
                        noWrap>
                        {countrySearch.name}
                    </Typography>
                )}
            </Stack>
        )
    );
};

export default CurrencyCell;
