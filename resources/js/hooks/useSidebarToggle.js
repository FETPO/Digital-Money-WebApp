import {useCallback} from "react";
import {setCollapsedSidebar} from "redux/slices/layout";
import {useDispatch, useSelector} from "react-redux";
import {get} from "lodash";

export function useSidebarToggle() {
    const dispatch = useDispatch();

    const open = useCallback(() => {
        dispatch(setCollapsedSidebar(false));
    }, [dispatch]);

    const state = useSelector((state) => {
        return !get(state, "layout.collapsedSidebar", false);
    });

    const close = useCallback(() => {
        dispatch(setCollapsedSidebar(true));
    }, [dispatch]);

    return [state, open, close];
}
