/**
 * Created by manu on 12/08/2016.
 */
var SQLGenerator = require('../index');


var sqlGenerator = new SQLGenerator();
var sqlParams = {};

sqlParams = {
    $select : {
        $from: 'table1',
        $fields: [
            {
                $field: 'column_a',
                $as: "new_column_a"
            },
            {
                $field: 'column_b',
                $as: "new_column_b"
            }
        ]
    }
};

var sqlQuery = sqlGenerator.select(sqlParams);

console.log(' ');
console.log('Query: ', sqlQuery);
