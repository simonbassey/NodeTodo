import fs from "fs";

export class FileHelperService {

    public static async getFiles(path: string): Promise<string[]> {
        return new Promise((resolve, reject) => {
            fs.readdir(path, (err: any, files: string[]) => {
                if (err) {
                    reject(err);
                }
                resolve(files);
            });
        });
    }
}
