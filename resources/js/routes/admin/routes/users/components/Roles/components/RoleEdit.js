import React, {Fragment, useCallback, useEffect, useState} from "react";
import {
    Chip,
    Grid,
    IconButton,
    Stack,
    Typography,
    Box,
    Alert
} from "@mui/material";
import {useModal} from "utils/modal";
import EditIcon from "@mui/icons-material/Edit";
import Form, {Checkbox, TextField} from "components/Form";
import {defineMessages, FormattedMessage, useIntl} from "react-intl";
import {errorHandler, route, useFormRequest, useRequest} from "services/Http";
import {notify} from "utils/index";
import Spin from "components/Spin";
import {isEmpty, lowerCase} from "lodash";
import {LoadingButton} from "@mui/lab";

const messages = defineMessages({
    name: {defaultMessage: "Name"},
    success: {defaultMessage: "Role was updated."},
    editRole: {defaultMessage: "Edit Role"},
    rank: {defaultMessage: "Rank"}
});

const RoleEdit = ({role, reloadTable, ...props}) => {
    const intl = useIntl();
    const [modal, modalElements] = useModal();

    const editRole = useCallback(() => {
        modal.confirm({
            title: intl.formatMessage(messages.editRole),
            content: <EditForm role={role} reloadTable={reloadTable} />,
            rootProps: {fullWidth: true}
        });
    }, [modal, intl, role, reloadTable]);

    return (
        <Fragment>
            <IconButton {...props} onClick={editRole}>
                <EditIcon />
            </IconButton>
            {modalElements}
        </Fragment>
    );
};

const EditForm = ({closeModal, role, reloadTable}) => {
    const [form] = Form.useForm();
    const intl = useIntl();
    const [permissions, setPermissions] = useState([]);
    const [formRequest, formLoading] = useFormRequest(form);
    const [request, loading] = useRequest();

    const fetchPermissions = useCallback(() => {
        request
            .get(route("admin.role.get-permissions"))
            .then((data) => setPermissions(data))
            .catch(errorHandler());
    }, [request]);

    useEffect(() => {
        fetchPermissions();
    }, [fetchPermissions]);

    const submitForm = useCallback(
        (values) => {
            const params = {role: role.id};
            formRequest
                .put(route("admin.role.update", params), values)
                .then(() => {
                    reloadTable?.();
                    notify.success(intl.formatMessage(messages.success));
                    closeModal?.();
                })
                .catch(errorHandler());
        },
        [closeModal, formRequest, intl, role, reloadTable]
    );

    useEffect(() => {
        if (!isEmpty(role)) {
            form.resetFields();
        }
    }, [role, form]);

    const selected = useCallback(
        (name) => {
            return role.permissions?.findIndex((p) => p.name === name) >= 0;
        },
        [role]
    );

    return (
        <Form form={form} onFinish={submitForm}>
            <Spin spinning={loading}>
                <Grid container spacing={1}>
                    <Grid item xs={8}>
                        <Form.Item
                            rules={[{required: true}]}
                            label={intl.formatMessage(messages.name)}
                            name="name"
                            initialValue={role.name}>
                            <TextField disabled={role.protected} fullWidth />
                        </Form.Item>
                    </Grid>
                    <Grid item xs={4}>
                        <Form.Item
                            normalize={(v) => parseInt(v) || 0}
                            label={intl.formatMessage(messages.rank)}
                            rules={[{required: true, type: "number"}]}
                            name="rank"
                            initialValue={role.rank}>
                            <TextField disabled={role.protected} fullWidth />
                        </Form.Item>
                    </Grid>
                </Grid>

                <Alert severity="info" sx={{mt: 1}}>
                    <FormattedMessage defaultMessage="Rank is used to set the priority of roles, with the lesser value having greater priority." />
                </Alert>

                {!isEmpty(permissions) && (
                    <Stack spacing={1} sx={{mt: 3}}>
                        <Typography
                            sx={{color: "text.secondary"}}
                            variant="overline">
                            <FormattedMessage defaultMessage="Permissions" />
                        </Typography>
                        <Box>
                            {permissions.map((p) => (
                                <Grid key={p.id} container spacing={1}>
                                    <Grid item xs={8}>
                                        <Chip
                                            label={lowerCase(p.name)}
                                            size="small"
                                        />
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Form.Item
                                            valuePropName="checked"
                                            initialValue={selected(p.name)}
                                            name={["permissions", p.name]}>
                                            <Checkbox />
                                        </Form.Item>
                                    </Grid>
                                </Grid>
                            ))}
                        </Box>
                    </Stack>
                )}

                <Stack direction="row" justifyContent="flex-end" sx={{my: 2}}>
                    <LoadingButton
                        variant="contained"
                        disabled={loading}
                        type="submit"
                        loading={formLoading}>
                        <FormattedMessage defaultMessage="Submit" />
                    </LoadingButton>
                </Stack>
            </Spin>
        </Form>
    );
};

export default RoleEdit;
