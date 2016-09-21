/**
 * Created by manu on 12/08/2016.
 */
var colors = require('colors');
var SQLGenerator = require('../index');

var sqlGenerator = new SQLGenerator({debug: true});

var queryParams = { $from : 'table1',
    $fields : [
        'column1a',
        'column1b',
        {
            $inner : 'table2',
            $on: {
                $parent : 'table2ForeignKey',
                $child : 'primaryKey'
            },
            $fields : [
                'column2a',
                'column2b',
            ]
        }
    ]
};


var sqlQuery = sqlGenerator.select(queryParams);

