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
        field_a: {
            $gt: 1
        },
        field_b: {
            $gt: 1
        }
    }
};

var sqlQuery = sqlGenerator.update(sqlParams);

console.log(' ');
console.log('Query: ', sqlQuery);


