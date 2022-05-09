import React, {isValidElement, useCallback} from "react";
import {CSSTransition, TransitionGroup} from "react-transition-group";
import {usePrevious} from "utils";
import {experimentalStyled as styled} from "@mui/material/styles";

const StepsContent = ({children, current, ...otherProps}) => {
    const prevCurrent = usePrevious(current);
    const isBackward = prevCurrent > current;

    const childFactory = useCallback(
        (child) =>
            React.cloneElement(child, {
                classNames: isBackward ? "page-backward" : "page-forward"
            }),
        [isBackward]
    );

    const onEntered = useCallback((node) => {
        node.parentNode.style.overflow = null;
    }, []);

    const onEnter = useCallback((node) => {
        node.parentNode.style.overflow = "hidden";
    }, []);

    return (
        <BaseStyle {...otherProps}>
            <TransitionGroup childFactory={childFactory} component={null}>
                <CSSTransition
                    key={current}
                    classNames="page-forward"
                    onEnter={onEnter}
                    onEntered={onEntered}
                    timeout={300}>
                    {React.Children.toArray(children).find((child, k) => {
                        return isValidElement(child) && k === current;
                    })}
                </CSSTransition>
            </TransitionGroup>
        </BaseStyle>
    );
};

const BaseStyle = styled("div")({position: "relative"});

export default StepsContent;
