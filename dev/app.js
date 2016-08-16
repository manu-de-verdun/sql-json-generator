/**
 * Created by manu on 12/08/2016.
 */
var SQLGenerator = require('../index');


var sqlGenerator = new SQLGenerator();
var sqlParams = {};

sqlParams = {
    delete: 'mi_itens_inventarios',
    values: {

    }
};

var sqlQuery = sqlGenerator.insert(sqlParams);

console.log(' ');
console.log('Query: ', sqlQuery);


