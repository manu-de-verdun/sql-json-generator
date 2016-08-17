/**
 * Created by manu on 12/08/2016.
 */
var SQLGenerator = require('../index');


var sqlGenerator = new SQLGenerator();
var sqlParams = {};

sqlParams = {
    $select : {
        $from : 'usuarios',
        $fields : [
            'id_usuario',
            'nome',
            'sobrenome',
            'login',
            'admin'
        ]
    },
    $where : {
        login: 'admin',
        senha: '123456',
        ativo: 1
    }
};

var sqlQuery = sqlGenerator.select(sqlParams);

console.log(' ');
console.log('Query: ', sqlQuery);
