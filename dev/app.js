/**
 * Created by manu on 12/08/2016.
 */
var colors = require('colors');
var SQLGenerator = require('../index');

var sqlGenerator = new SQLGenerator({ debug: true, escaped: true });

var queryParams = {
            $from: 'pessoas_fisicas',
            $fields: [
                'data_nascimento',
                {
                    $field: 'data_nascimento',
                    $count: 1,
                    $as: 'count'
                }
            ],
            $where: [{
                $table: "pessoas_fisicas",
                $field: "nome",
                $like: "%joao%"
            },
            {
                $as: 'count',
                $gt: 1
            }],
            $group: [
                { $as: 'count' }
            ],
            $having: [
                { 
                   $raw: "`count` > 1"
                }
            ]
            };


var sqlQuery = sqlGenerator.select(queryParams);

