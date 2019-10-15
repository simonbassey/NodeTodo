import crypto from "crypto";
import bcrypt from "bcrypt";
export class Util {
    public static Hash(algo: string, plainText: string, salt: string = ""): string {
        salt = salt ? salt : crypto.randomBytes(16).toString("base64");
        let hashAlogorithm: string = "";
        switch (algo) {
            case "sha512": hashAlogorithm = "sha512";
            case "sha256": hashAlogorithm = "sha256";
            default: hashAlogorithm = hashAlogorithm;
        }
        if (!hashAlogorithm) {
            throw new Error("Invalid hash algorithm requested");
        }
        return crypto.createHmac(algo, salt).update(plainText).digest("base64");
    }

    public static BcryptHash(plainText: string, rounds: number = 10): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            bcrypt.hash(plainText, rounds, (err, encryptedStr) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(encryptedStr);
            });
        });
    }

    public static BcryptCompare(plainText: string, encryptedhash: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            bcrypt.compare(plainText, encryptedhash, (err, result) => {
                if (err) {
                    reject (err);
                }
                resolve(result);
            });
        });
    }
}
