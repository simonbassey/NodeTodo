import crypto from "crypto";
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
}
