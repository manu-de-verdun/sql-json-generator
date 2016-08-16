/**
 * Created by manu on 12/08/2016.
 */
var SQLGenerator = require('../index');


var sqlGenerator = new SQLGenerator();
var sqlParams = {};

sqlParams = {
    $insert: 'mytable',
    $values : {
        field_a: 1,
        field_b: 1
    }
};

var sqlQuery = sqlGenerator.insert(sqlParams);

console.log(' ');
console.log('Query: ', sqlQuery);


