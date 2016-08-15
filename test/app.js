/**
 * Created by manu on 12/08/2016.
 */
var SQLGenerator = require('../index');


var sqlGenerator = new SQLGenerator();
var sqlParams = {};

sqlParams = {
    update: 'mytable',
    set: {
        field_c: 1,
        field_d: 1
    },
    where: {
    }
};

var sqlQuery = sqlGenerator.update(sqlParams);

console.log(' ');
console.log('Query: ', sqlQuery);


