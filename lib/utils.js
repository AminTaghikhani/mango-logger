const fs = require('fs');
class Utils {
    checkDirSync(name) {
        if (!fs.existsSync(name)) {
            fs.mkdirSync(name);
        }
    }

    createFileSync(path, body) {
        fs.writeFileSync(path, body, {
            flag: 'a'
        });
    }
}

module.exports = new Utils();