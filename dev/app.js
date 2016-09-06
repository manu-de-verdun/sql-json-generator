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
        $or: [{
            $or: [{
                $field: "field_a",
                $gte: 8
            }, {
                $field: "field_a",
                $lt: 10
            }]

        }, {
            $and: [{field_b: 3.15}, {
                $field: 'field_d',
                $ne: 'ERR'
            }]
        }]
    }]
};


var sqlQuery = sqlGenerator.update(queryParams);

console.log(' ');
console.log(colors.cyan('%s'), sqlQuery);
