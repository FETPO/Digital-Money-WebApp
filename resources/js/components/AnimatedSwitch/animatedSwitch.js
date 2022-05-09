import React, {useCallback} from "react";
import {CSSTransition, TransitionGroup} from "react-transition-group";
import {Switch, useHistory, useLocation} from "react-router-dom";
import {experimentalStyled as styled} from "@mui/material/styles";

const AnimatedSwitch = (props) => {
    const history = useHistory();
    const isBackward = history.action === "POP";
    const location = useLocation();

    const childFactory = useCallback(
        (child) =>
            React.cloneElement(child, {
                classNames: isBackward ? "page-backward" : "page-forward"
            }),
        [isBackward]
    );

    const onEnter = useCallback((node) => {
        node.parentNode.style.overflow = "hidden";
    }, []);

    const onEntered = useCallback((node) => {
        node.parentNode.style.overflow = null;
    }, []);

    return (
        <BaseStyle>
            <TransitionGroup childFactory={childFactory} component={null}>
                <CSSTransition
                    key={location.pathname}
                    onEnter={onEnter}
                    onEntered={onEntered}
                    classNames="page-forward"
                    timeout={300}>
                    <Switch {...props} location={location} />
                </CSSTransition>
            </TransitionGroup>
        </BaseStyle>
    );
};

const BaseStyle = styled("div")({
    position: "relative",
    height: "100%"
});

export default AnimatedSwitch;
