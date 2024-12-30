
import { localeState } from "../state";
import React,
{ useEffect } from "react";
import { useCookies } from "react-cookie";
import { useSetRecoilState } from "recoil";

interface LocaleProviderProps {
}

const LocaleProvider: React.FC<LocaleProviderProps> = (props) => {
    const [ cookies ] = useCookies([ `locale` ]);
    const setLocale = useSetRecoilState(localeState);

    useEffect(() => {
        if (!cookies.locale) return;
        setLocale(cookies.locale);
    }, [ cookies.locale, setLocale ]);

    return (
        <>
            {props.children}
        </>
    );
};

export default LocaleProvider;
