import React, {Fragment, useCallback, useMemo} from "react";
import {FormattedMessage} from "react-intl";
import {useModal} from "utils/modal";
import {IconButton, MenuItem} from "@mui/material";
import {isEmpty} from "lodash";
import Dropdown from "components/Dropdown";
import LoadingIcon from "components/LoadingIcon";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ViewStock from "./ViewStock";
import AddStock from "./AddStock";
import AddBoxIcon from "@mui/icons-material/AddBox";
import VisibilityIcon from "@mui/icons-material/Visibility";

const GiftcardMenu = ({giftcard, reloadTable, ...props}) => {
    const [modal, modalElements] = useModal();

    const addStock = useCallback(() => {
        modal.confirm({
            title: giftcard.title,
            content: <AddStock giftcard={giftcard} reloadTable={reloadTable} />,
            rootProps: {fullWidth: true}
        });
    }, [modal, giftcard, reloadTable]);

    const viewStock = useCallback(() => {
        modal.confirm({
            title: giftcard.title,
            content: <ViewStock giftcard={giftcard} />,
            rootProps: {fullWidth: true}
        });
    }, [modal, giftcard]);

    const menuItems = useMemo(() => {
        const items = [];

        items.push(
            <MenuItem key={0} onClick={addStock}>
                <AddBoxIcon sx={{mr: 2}} />
                <FormattedMessage defaultMessage="Add Stock" />
            </MenuItem>
        );

        items.push(
            <MenuItem key={1} onClick={viewStock}>
                <VisibilityIcon sx={{mr: 2}} />
                <FormattedMessage defaultMessage="View Stock" />
            </MenuItem>
        );

        return items;
    }, [viewStock, addStock]);

    if (isEmpty(menuItems)) {
        return null;
    }

    return (
        <Fragment>
            <Dropdown menuItems={menuItems} component={IconButton} {...props}>
                <LoadingIcon component={MoreVertIcon} />
            </Dropdown>

            {modalElements}
        </Fragment>
    );
};

export default GiftcardMenu;
