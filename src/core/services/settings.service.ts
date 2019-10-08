import config from "config";

export class Settings {
    public static get logsPath() {
        return !config.has("Logs") ? null : config.get("Logs");
    }
}
