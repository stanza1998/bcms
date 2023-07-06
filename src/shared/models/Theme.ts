import { makeAutoObservable, toJS } from "mobx";
import AppStore from "../stores/AppStore";

export interface ISystemTheme {
    colors: {
        primary: string;
        secondary: string;
        accent: string;
    };
    logoUrl: string;
}

export default class SystemTheme {
    private theme: ISystemTheme;

    constructor(private store: AppStore, theme: ISystemTheme) {
        makeAutoObservable(this);
        this.theme = theme;
    }

    get asJson(): ISystemTheme {
        return toJS(this.theme);
    }
}