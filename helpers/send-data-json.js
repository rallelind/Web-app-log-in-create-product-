const fs = require('fs');

const sendUsersJSON = (() => {
    const usersJSON = JSON.stringify(users, null, 2);

    fs.writeFile("./dataJSON/users.json", usersJSON, 'utf8', (err) => {
        if (err) return console.log(err);
    }); 
})

const sendProductJSON = (() => {
    const productJSON = JSON.stringify(product, null, 2); //null 2 for at få det i linjer

    fs.writeFile("./dataJSON/product.json", productJSON, 'utf8', (err) => {
        if (err) return console.log(err);
    }); 
})

module.exports = sendProductJSON
module.exports = sendUsersJSON
