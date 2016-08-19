/**
 * Created by manu on 12/08/2016.
 */
var SQLGenerator = require('../index');


var sqlGenerator = new SQLGenerator(true);
var sqlParams = {};

sqlParams = {
    $from : 'table1',
    $fields : [
        'field_a'
    ],
    $where : {
        field_d: 1
    }
};

var sqlQuery = sqlGenerator.select(sqlParams);

console.log(' ');
console.log('Query: ', sqlQuery);
