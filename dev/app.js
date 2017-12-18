/**
 * Created by manu on 12/08/2016.
 */
var colors = require('colors');
var SQLGenerator = require('../index');

var sqlGenerator = new SQLGenerator({ debug: true, escaped: true });

var queryParams = {
    $from: 'table1',
    $fields: [{
        $field: 'column_a',
        $as: "new_column_a",
        $function: "upper"
    }, {
        $field: 'column_b',
        $as: "new_column_b",
        $function: "lower"
    }]
};


var sqlQuery = sqlGenerator.select(queryParams);

