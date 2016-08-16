/**
 * Created by manu on 12/08/2016.
 */
var SQLGenerator = require('../index');


var sqlGenerator = new SQLGenerator();
var sqlParams = {};

sqlParams = {
    $select: id_modelo_insumo,
    $from : 'mi_itens_inventarios'
};

var sqlQuery = sqlGenerator.select(sqlParams);

console.log(' ');
console.log('Query: ', sqlQuery);


