/**
 * Created by manu on 12/08/2016.
 */
var colors = require('colors');
var SQLGenerator = require('../index');

var sqlGenerator = new SQLGenerator({ debug: true, pgSQL: true });

var queryParams = {
    $from: 'estoques',
    $fields: [
        'id_estoque',
        {
            $inner: 'estoques_departamentos',
            $using: 'id_estoque',
            $fields: [
                {
                    $field: 'id_categoria_insumo_departamento',
                    $groupConcat: 1,
                    $as: 'departamentos'
                }
                
            ]
        }
    ],
    $where: []
};


var sqlQuery = sqlGenerator.select(queryParams);

