/**
 * Created by manu on 12/08/2016.
 */
var SQLGenerator = require('../index');


var sqlGenerator = new SQLGenerator(true);
var sqlParams = {};

sqlParams = {
    $select : {
        $from : 'mi_itens',
        $fields : [
            'id_mi_item',
            {
                $field: 'data',
                $dateFormat : '%Y-%m-%d',
                $as: 'data'
            },
        ]
    }
};

var sqlQuery = sqlGenerator.select(sqlParams);

console.log(' ');
console.log('Query: ', sqlQuery);
