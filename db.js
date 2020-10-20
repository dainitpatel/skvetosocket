var mysql = require('mysql');
var client = mysql.createConnection({
    user: 'root',
    password: '',
    host: 'localhost',
    database: 'skveto'
});
// -----------------------------------
exports.get_driver =  (callback) => {
    
    client.query("select latitude, longitude from driver where id=1", function (err, results, fields) {
        callback(results);
    });
}