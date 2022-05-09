import React, {useCallback, useEffect, useMemo, useState} from "react";
import HeaderBreadcrumbs from "components/HeaderBreadcrumbs";
import {Alert, Box, Card, Container, Stack} from "@mui/material";
import {keys} from "lodash";
import {errorHandler, route, useRequest} from "services/Http";
import {defineMessages, FormattedMessage, useIntl} from "react-intl";
import Table from "components/Table";
import {useSearchDebounce} from "hooks/useSearchDebounce";
import ActionBar from "./components/ActionBar";
import TranslationEdit from "./components/TranslationEdit";

const messages = defineMessages({
    key: {defaultMessage: "Key"},
    searchPlaceholder: {defaultMessage: "Search text..."},
    publishSuccess: {defaultMessage: "Publish was successful."},
    updateSuccess: {defaultMessage: "Translation was updated."},
    locales: {defaultMessage: "Locales"},
    editTranslation: {defaultMessage: "Edit Translation"}
});

const routeName = "admin.locale.group.get";

const ManageGroup = ({group}) => {
    const intl = useIntl();
    const [locales, setLocales] = useState([]);
    const [search, setSearch] = useState();
    const [translations, setTranslations] = useState([]);
    const [request, loading] = useRequest();
    const [url, setUrl] = useState(() => route(routeName, {group}));
    const [changed, setChanged] = useState(0);

    const searchFunc = useCallback(
        (search) => {
            setUrl(route(routeName, {group, search}));
        },
        [group]
    );

    const clearFunc = useCallback(() => {
        setUrl(route(routeName, {group}));
    }, [group]);

    useSearchDebounce(search, searchFunc, clearFunc);

    const fetchGroup = useCallback(() => {
        request
            .get(url)
            .then((data) => {
                setLocales(data.locales);
                setTranslations(data.translations);
                setChanged(data.changed);
            })
            .catch(errorHandler());
    }, [request, url]);

    useEffect(() => {
        fetchGroup();
    }, [fetchGroup]);

    const columns = useMemo(
        () => [
            {
                field: "key",
                minWidth: 200,
                flex: 0.5,
                headerName: intl.formatMessage(messages.key)
            },
            {
                field: "en",
                minWidth: 200,
                flex: 1,
                renderCell: ({value}) => value[0]?.value
            },
            {
                field: "keys",
                minWidth: 200,
                flex: 0.5,
                headerName: intl.formatMessage(messages.locales),
                renderCell: ({row}) => {
                    return keys(row)
                        .filter((key) => key !== "key")
                        .join(", ");
                }
            },
            {
                field: "action",
                minWidth: 100,
                flex: 0.5,
                headerAlign: "right",
                renderHeader: () => <span />,
                align: "right",
                renderCell: ({row: translation}) => {
                    return (
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <TranslationEdit
                                locales={locales}
                                reloadTable={fetchGroup}
                                translation={translation}
                                group={group}
                            />
                        </Stack>
                    );
                }
            }
        ],
        [intl, fetchGroup, locales, group]
    );

    return (
        <Container>
            <HeaderBreadcrumbs />

            <Card>
                <ActionBar
                    changed={changed}
                    group={group}
                    reloadTable={fetchGroup}
                    onSearchChange={setSearch}
                    search={search}
                />

                <Box sx={{px: 3, pb: 3}}>
                    <Alert severity="warning" sx={{mb: 2}}>
                        <FormattedMessage
                            defaultMessage="The words in the form of {one} and {two}, are placeholders and must not be changed across all locales."
                            values={{
                                one: <b>{`:word`}</b>,
                                two: <b>{`{word}`}</b>
                            }}
                        />
                    </Alert>
                </Box>

                <Table
                    columns={columns}
                    getRowId={(row) => row.key}
                    rows={translations}
                    loading={loading}
                />
            </Card>
        </Container>
    );
};

export default ManageGroup;
