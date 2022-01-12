/* const mongoose = require("mongoose");

const adminauth = require("../Model/adminauth")

mongoose.connect('localhost:27017/jatibuti')

const AdminAuth = [
    new adminauth({
        fullname: 'admin',
        role: 'Admin',
        number: '08132185887',
        email: 'admin@gmail.com'
    }),
    new adminauth({
        fullname: 'Publisher',
        role: 'Publisher',
        number: '08159598556',
        email: 'Publisher@gmail.com'
    }),
];


var done = 0;
for (var i = 0; i < AdminAuth.length; i++) {
    AdminAuth[i].save(function (err, result) {
        done++;
        if (done === AdminAuth.length) {
            exit;
        }
    });
}
const fetch = adminauth.find();
console.log(fetch);
function exit() {
    mongoose.disconnect();
}


 */