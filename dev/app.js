/**
 * Created by manu on 12/08/2016.
 */
var colors = require('colors');
var SQLGenerator = require('../index');

var sqlGenerator = new SQLGenerator({debug: true});

var queryParams = {
            $from: 'chamados_logs',
            $fields: [ {
                $field: 'id_chamado_log',
                $min: 1,
                $as: 'total'
            }]
};


var sqlQuery = sqlGenerator.select(queryParams);

