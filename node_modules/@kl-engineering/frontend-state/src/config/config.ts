export interface ConfigParameters {
    cookieDomain: string;
}

export class Config {
    constructor (params: ConfigParameters) {
        this.localCookieDomain = params.cookieDomain;
    }

    private localCookieDomain: string;

    get cookieDomain () {
        return this.localCookieDomain;
    }
}

let config: Config;

export const getConfig = () => config;
export const setConfig = (newConfig: Config) => config = newConfig;
