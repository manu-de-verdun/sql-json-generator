/**
 * Created by manu on 12/08/2016.
 */
var colors = require('colors');
var SQLGenerator = require('../index');

var sqlGenerator = new SQLGenerator({debug: true});

var queryParams = {
    $update: 'mytable',
    $set: {
        field_c: 1,
        field_d: 1
    },
    $where: [{
        $field: 'field_a',
        $gt: 1
    }]
};


var sqlQuery = sqlGenerator.update(queryParams);

console.log(' ');
console.log(colors.cyan('%s'), sqlQuery);
