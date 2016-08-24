/**
 * Created by manu on 12/08/2016.
 */
var SQLGenerator = require('../index');


var sqlGenerator = new SQLGenerator({debug: true});

var queryParams = {
    $from : 'mi_itens_inventarios',
    $fields : [
        'id_mi_item_inventario',
        'id_modelo_insumo'
    ],
    $where : {
        'deleted' : 0,
        'arquivado' : 0
    },
    $order : [
        'id_mi_item_inventario'
    ]
};


var sqlQuery = sqlGenerator.select(queryParams);

console.log(' ');
console.log('Query: ', sqlQuery);
