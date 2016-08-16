/**
 * Created by manu on 12/08/2016.
 */
var SQLGenerator = require('../index');


var sqlGenerator = new SQLGenerator();
var sqlParams = {};

sqlParams = {
    delete: 'loopback_usuarios'
};

var sqlQuery = sqlGenerator.delete(sqlParams);

console.log(' ');
console.log('Query: ', sqlQuery);


