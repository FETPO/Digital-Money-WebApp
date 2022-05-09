import React from "react";
import {useInstallerState} from "hooks/settings";
import Install from "./Install";
import Register from "./Register";

const Installer = () => {
    const {installed} = useInstallerState();
    return installed ? <Register /> : <Install />;
};

export default Installer;
