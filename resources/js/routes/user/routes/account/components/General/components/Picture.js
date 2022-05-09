import React, {useCallback} from "react";
import UploadPhoto from "components/UploadPhoto";
import {defineMessages, useIntl} from "react-intl";
import {Card} from "@mui/material";
import {route} from "services/Http";
import {useAuth} from "models/Auth";
import {fetchUser} from "redux/slices/auth";
import {useDispatch} from "react-redux";

const messages = defineMessages({
    caption: {defaultMessage: "Allowed *.jpeg, *.jpg, *.png"}
});

const Picture = (props) => {
    const auth = useAuth();
    const dispatch = useDispatch();
    const intl = useIntl();

    const onUploadSuccess = useCallback(() => {
        dispatch(fetchUser());
    }, [dispatch]);

    return (
        <Card sx={{py: 10, px: 3}} {...props}>
            <UploadPhoto
                action={route("user.upload-picture")}
                caption={intl.formatMessage(messages.caption)}
                onSuccess={onUploadSuccess}
                preview={auth.user.getProfilePicture()}
            />
        </Card>
    );
};

export default Picture;
