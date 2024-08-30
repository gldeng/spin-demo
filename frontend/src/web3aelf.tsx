
import { WebLoginProvider, init } from '@aelf-web-login/wallet-adapter-react';

import aelfConfig from "./AelfConfig";

export function AelfWeb3Provider({ children }) {
    const bridgeAPI = init(aelfConfig);
    return (
        <WebLoginProvider bridgeAPI={bridgeAPI}>
            {children}
        </WebLoginProvider>
    );
}
