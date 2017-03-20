/**
 * Created by manu on 12/08/2016.
 */
var colors = require('colors');
var SQLGenerator = require('../index');

var sqlGenerator = new SQLGenerator({ debug: true, escaped: true });

var queryParams = {
                $from: 'mi_itens_inventarios',
                $fields: ['id_mi_item_inventario',  {
                    $raw: "MAX(`fieldA`) as max"
                }, {
                    $raw: "MIN(`fieldA`) as min"
                }]
            };


var sqlQuery = sqlGenerator.select(queryParams);

