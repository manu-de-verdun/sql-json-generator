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
            {
                $field : 'field_b',
                $as : 'newFieldName'
            },
            'field_c'
        ]
    },
    $where : {
        field_d: 1
    }
};

var sqlQuery = sqlGenerator.select(sqlParams);

console.log(' ');
console.log('Query: ', sqlQuery);
