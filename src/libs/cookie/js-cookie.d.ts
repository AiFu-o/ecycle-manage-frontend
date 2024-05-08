declare module 'js-cookie' {
    interface CookiesStatic {
        set(name: string, value: any, options?: Cookies.CookieAttributes): void;
        get(name: string): string | undefined;
        remove(name: string, options?: Cookies.CookieAttributes): void;
    }

    const cookies: CookiesStatic;
    export = cookies;
}
