const fileHelper = require('./src/core/services/file.helper.service');
console.log(`*** Welcome to Node lesson 1 ***\n\n\n`);

const filePath = '/Users/simonbassey/Downloads';
console.log(`Reading all files in ${filePath}`);
fileHelper.getFiles(filePath).then(
    (filesRes) => {
        console.log(`There are ${filesRes.length} files in ${filePath}`);
        console.log(filesRes);
    },
    (err) => {
        console.log(`We encountered an error while reading director \n${err}`);
    }
);