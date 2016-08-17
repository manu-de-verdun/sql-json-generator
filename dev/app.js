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
            'column1a',
            'column1b',
            {
                $inner : 'table2',
                $using : 'column2a',
                $fields : [
                    'column2a',
                    'column2b',
                ]
            }
        ]
    }
};

var sqlQuery = sqlGenerator.select(sqlParams);

console.log(' ');
console.log('Query: ', sqlQuery);
