import React, {
    Fragment,
    useCallback,
    useEffect,
    useMemo,
    useState
} from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {IconButton, MenuItem, Stack} from "@mui/material";
import Dropdown from "components/Dropdown";
import {intersection, isEmpty, map} from "lodash";
import {defineMessages, FormattedMessage, useIntl} from "react-intl";
import {useAuth} from "models/Auth";
import User from "models/User";
import {useModal} from "utils/modal";
import Form, {DateTimePicker, MultiSelect} from "components/Form";
import {errorHandler, route, useFormRequest, useRequest} from "services/Http";
import Spin from "components/Spin";
import {LoadingButton} from "@mui/lab";
import {notify} from "utils/index";
import {normalizeDates} from "utils/form";
import GavelIcon from "@mui/icons-material/Gavel";
import SettingsBackupRestoreIcon from "@mui/icons-material/SettingsBackupRestore";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import LoadingIcon from "components/LoadingIcon";

const messages = defineMessages({
    assignRole: {defaultMessage: "Assign Role"},
    deactivateUser: {defaultMessage: "Deactivate User"},
    roles: {defaultMessage: "Roles"},
    until: {defaultMessage: "Until"},
    deactivated: {defaultMessage: "User was deactivated."},
    activated: {defaultMessage: "User was activated."},
    success: {defaultMessage: "User was updated."}
});

const UserMenu = ({user, reloadTable, ...props}) => {
    const auth = useAuth();
    const [modal, modalElements] = useModal();
    const [request, loading] = useRequest();
    const intl = useIntl();

    const assignRole = useCallback(() => {
        modal.confirm({
            title: intl.formatMessage(messages.assignRole),
            content: <AssignRole user={user} reloadTable={reloadTable} />,
            rootProps: {fullWidth: true}
        });
    }, [modal, user, intl, reloadTable]);

    const deactivateUser = useCallback(() => {
        modal.confirm({
            title: intl.formatMessage(messages.deactivateUser),
            content: <DeactivateUser user={user} reloadTable={reloadTable} />
        });
    }, [modal, user, intl, reloadTable]);

    const activateUser = useCallback(() => {
        const params = {user: user.id};
        request
            .post(route("admin.user.activate", params))
            .then(() => {
                notify.success(intl.formatMessage(messages.activated));
                reloadTable?.();
            })
            .catch(errorHandler());
    }, [request, user, intl, reloadTable]);

    const menuItems = useMemo(() => {
        const items = [];

        if (user.updatable && auth.user.isSuperAdmin()) {
            items.push(
                <MenuItem key={0} onClick={assignRole}>
                    <AdminPanelSettingsIcon sx={{mr: 2}} />
                    <FormattedMessage defaultMessage="Assign Role" />
                </MenuItem>
            );
        }

        if (user.updatable) {
            const data = User.use(user);

            if (data.isActive()) {
                items.push(
                    <MenuItem key={1} onClick={deactivateUser}>
                        <GavelIcon sx={{mr: 2}} />
                        <FormattedMessage defaultMessage="Deactivate" />
                    </MenuItem>
                );
            } else {
                items.push(
                    <MenuItem key={1} onClick={activateUser}>
                        <SettingsBackupRestoreIcon sx={{mr: 2}} />
                        <FormattedMessage defaultMessage="Activate" />
                    </MenuItem>
                );
            }
        }

        return items;
    }, [user, auth, assignRole, deactivateUser, activateUser]);

    if (isEmpty(menuItems)) {
        return null;
    }

    return (
        <Fragment>
            <Dropdown menuItems={menuItems} component={IconButton} {...props}>
                <LoadingIcon component={MoreVertIcon} loading={loading} />
            </Dropdown>

            {modalElements}
        </Fragment>
    );
};

const AssignRole = ({closeModal, user, reloadTable}) => {
    const [form] = Form.useForm();
    const intl = useIntl();
    const [request, loading] = useRequest();
    const [formRequest, formLoading] = useFormRequest(form);
    const [roles, setRoles] = useState([]);

    const fetchRoles = useCallback(() => {
        request
            .get(route("admin.role.all"))
            .then((data) => setRoles(data))
            .catch(errorHandler());
    }, [request]);

    useEffect(() => {
        fetchRoles();
    }, [fetchRoles]);

    const submitForm = useCallback(
        (values) => {
            const params = {user: user.id};
            formRequest
                .post(route("admin.role.assign", params), values)
                .then(() => {
                    reloadTable?.();
                    notify.success(intl.formatMessage(messages.success));
                    closeModal?.();
                })
                .catch(errorHandler());
        },
        [closeModal, formRequest, intl, user, reloadTable]
    );

    useEffect(() => {
        if (!isEmpty(roles) && !isEmpty(user)) {
            form.resetFields();
        }
    }, [user, form, roles]);

    const initialRoles = useMemo(() => {
        return intersection(user.all_roles, map(roles, "name"));
    }, [user, roles]);

    return (
        <Form form={form} onFinish={submitForm}>
            <Spin spinning={loading}>
                <Form.Item
                    name="roles"
                    label={intl.formatMessage(messages.roles)}
                    initialValue={initialRoles}>
                    <MultiSelect fullWidth sx={{minWidth: 200}}>
                        {roles.map((role) => {
                            return (
                                <MenuItem key={role.id} value={role.name}>
                                    {role.name}
                                </MenuItem>
                            );
                        })}
                    </MultiSelect>
                </Form.Item>

                <Stack direction="row" justifyContent="flex-end" sx={{my: 2}}>
                    <LoadingButton
                        variant="contained"
                        disabled={loading || isEmpty(roles)}
                        type="submit"
                        loading={formLoading}>
                        <FormattedMessage defaultMessage="Submit" />
                    </LoadingButton>
                </Stack>
            </Spin>
        </Form>
    );
};

const DeactivateUser = ({closeModal, user, reloadTable}) => {
    const [form] = Form.useForm();
    const intl = useIntl();
    const [formRequest, formLoading] = useFormRequest(form);

    const submitForm = useCallback(
        (values) => {
            normalizeDates(values, ["date"]);
            const params = {user: user.id};
            formRequest
                .post(route("admin.user.deactivate", params), values)
                .then(() => {
                    reloadTable?.();
                    notify.success(intl.formatMessage(messages.deactivated));
                    closeModal?.();
                })
                .catch(errorHandler());
        },
        [closeModal, formRequest, intl, user, reloadTable]
    );

    return (
        <Form form={form} onFinish={submitForm}>
            <Form.Item
                name="date"
                label={intl.formatMessage(messages.until)}
                rules={[{required: true}]}>
                <DateTimePicker fullWidth />
            </Form.Item>

            <Stack direction="row" justifyContent="flex-end" sx={{my: 2}}>
                <LoadingButton
                    variant="contained"
                    type="submit"
                    loading={formLoading}>
                    <FormattedMessage defaultMessage="Submit" />
                </LoadingButton>
            </Stack>
        </Form>
    );
};

export default UserMenu;
