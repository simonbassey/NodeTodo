const fs = require("fs");
module.exports = {
    getFiles: function (path) {
    return new Promise((resolve, reject) => {
        fs.readdir(path, (err, files) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(files);
        });
    });
}
};