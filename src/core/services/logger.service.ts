import { Settings } from "./settings.service";
import winston, { level } from "winston";
import { format } from "url";
export class Logger {
    private static _logPath = Settings.logsPath;
    private static _logger: winston.Logger;

    public static ConfigureLogger() {
        try {
            const now = new Date();
            const filename = `${this._logPath.trace}/${now.getFullYear()}${this.pad(now.getMonth() + 1)}${now.getDate()}.${now.getHours()}.log`;
            this._logger = winston.createLogger({
                level: "info",
                format: winston.format.combine(winston.format.simple(), winston.format.splat(), winston.format.json()),
                transports: [
                    new winston.transports.File({ filename })
                ]
            });
            /*
            if (process.env.NODE_ENV !== "production") {
                this._logger.add(new winston.transports.Console({ format: winston.format.simple() }));
            }
            */
        }
        catch (error) {
            console.error (`Error occured while configuring application logger`);
        }
    }

    public static Info(obj: any): void {
        this.Log("info", obj);
    }
    public static Error(obj: any): void {
        this.Log("error", obj);
    }
    public static Warn(obj: any): void {
        this.Log("warn", obj);
    }

    private static Log(_level: string, message: string, options: any[] = []): void {
        this._logger.transports[0] = new winston.transports.File({filename: this.getTimedFileName});
        message = `${this.getCurrentTimeString} - ${message}`;
        switch (level) {
            case "info": this._logger.info(message, options); break;
            case "warn": this._logger.warn(message, options); break;
            case "error": this._logger.error(message, options); break;
            default: {
                this._logger.log(_level, message, options);
                break;
            }
        }
    }

    private static pad(n: number): string {
        return n > 10 ? n.toString() : "0" + n;
    }

    private static get getCurrentTimeString(): string {
        const now = new Date();
        return `${now.getFullYear()}-${this.pad(now.getMonth() + 1)}-${this.pad(now.getDate())} ${now.getHours()}.${now.getMinutes()}.${now.getSeconds()}.${now.getMilliseconds()}`;

    }

    private static get getTimedFileName(): string {
       const now = new Date();
       return  `${this._logPath.trace}/${now.getFullYear()}${now.getMonth()}${now.getDate()}.${now.getHours()}.log`;
    }
}
