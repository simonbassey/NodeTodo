import config from "config";

export class Settings {
    public static get logsPath(): any {
        return !config.has("Logs") ? null : config.get("Logs");
    }

    public static get authSecret(): any {
       return "Zk:)_3!P;9(Y?beP";
    }
}
