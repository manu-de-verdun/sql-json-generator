/**
 * Created by manu on 12/08/2016.
 */
var colors = require('colors');
var SQLGenerator = require('../index');

var sqlGenerator = new SQLGenerator({showSQL: true});

var queryParams = {
    $from: 'setores',
    $fields: [],
    $where: [],
    $sqlCalcFoundRows: false,
    $limit: {
        $rows: 20,
        $offset: 0
    }
};


var sqlQuery = sqlGenerator.select(queryParams);

