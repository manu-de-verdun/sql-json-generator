/**
 * Created by manu on 12/08/2016.
 */
var SQLGenerator = require('../index');


var sqlGenerator = new SQLGenerator();
var sqlParams = {};

sqlParams = {
    from: 'mi_itens_inventarios',
    where: {
        id_mi_item_inventario: 3
    }
};

var sqlQuery = sqlGenerator.delete(sqlParams);

console.log(' ');
console.log('Query: ', sqlQuery);


