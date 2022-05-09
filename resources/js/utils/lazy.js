import React, {Component} from "react";
import loadable from "@loadable/component";
import LoadingScreen from "components/LoadingScreen";
import Result500 from "../components/Result500";

function lazy(ImportComponent, routeProps) {
    const LoadedComponent = loadable(ImportComponent, {
        fallback: <LoadingScreen />
    });

    class LazyLoadedComponent extends Component {
        constructor(props) {
            super(props);

            this.state = {hasError: false};
        }

        static getDerivedStateFromError(error) {
            console.error(error);
            return {hasError: true};
        }

        render() {
            return this.state.hasError ? (
                <Result500 />
            ) : (
                <LoadedComponent {...this.props} {...routeProps} />
            );
        }
    }

    return LazyLoadedComponent;
}

export default lazy;
