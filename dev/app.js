/**
 * Created by manu on 12/08/2016.
 */
var SQLGenerator = require('../index');


var sqlGenerator = new SQLGenerator({debug: true});
var sqlParams = {};

sqlParams = {
    $from : 'mi_itens_inventarios',
    $fields : [
        'id_mi_item_inventario',
        'id_modelo_insumo'
    ],
    $where : {
        'deleted' : 0,
        'arquivado' : 0
    },
    $limit : {
        $offset: 10,
        $rows: 10
    }
};

var sqlQuery = sqlGenerator.select(sqlParams);

console.log(' ');
console.log('Query: ', sqlQuery);
