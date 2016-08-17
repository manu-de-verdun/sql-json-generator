/**
 * Created by manu on 12/08/2016.
 */
var SQLGenerator = require('../index');


var sqlGenerator = new SQLGenerator();
var sqlParams = {};

sqlParams = {
    $select : {
        $from : 'table1',
        $fields : [
            'field_a',
            'field_b',
            'field_c'
        ]
    }
};

var sqlQuery = sqlGenerator.select(sqlParams);

console.log(' ');
console.log('Query: ', sqlQuery);
