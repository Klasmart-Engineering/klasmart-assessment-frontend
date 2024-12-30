
import {
    Config,
    setConfig,
} from "../config";
import LocaleProvider from "../LocaleProvider";
import React,
{ useEffect } from "react";
import { RecoilRoot } from "recoil";

interface StateProviderProps {
    cookieDomain: string;
}

const StateProvider: React.FC<StateProviderProps> = (props) => {
    useEffect(() => {
        const config = new Config({
            cookieDomain: props.cookieDomain,
        });
        setConfig(config);
    }, [ props.cookieDomain ]);

    return (
        <RecoilRoot>
            <LocaleProvider>
                {props.children}
            </LocaleProvider>
        </RecoilRoot>
    );
};

export default StateProvider;
