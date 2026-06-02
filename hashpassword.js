const bcrypt = require('bcrypt');

async function hashPassword() {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash('owner1234', salt);
    console.log(hash);
}

hashPassword();