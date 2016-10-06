/**
 * Created by manu on 12/08/2016.
 */
var colors = require('colors');
var SQLGenerator = require('../index');

var sqlGenerator = new SQLGenerator({ debug: true, escaped: true });

var queryParams = {
    $update: 'mytable',
    $set: {
        field_a: "string",
        field_b: "string n' roses",
        field_c: 1
    },
    $where: [{
        field_a: 1
    }]
};


var sqlQuery = sqlGenerator.update(queryParams);

