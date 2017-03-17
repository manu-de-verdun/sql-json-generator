/**
 * Created by manu on 12/08/2016.
 */
var colors = require('colors');
var SQLGenerator = require('../index');

var sqlGenerator = new SQLGenerator({ debug: true, escaped: true });

var queryParams = {
                $from: 'table1',
                $fields: ['field_a'],
                $where: [{
                    $raw: "field_a = 12"
                }]
            };


var sqlQuery = sqlGenerator.select(queryParams);

