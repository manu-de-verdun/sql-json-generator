/**
 * Created by manu on 12/08/2016.
 */
var SQLGenerator = require('../index');


var sqlGenerator = new SQLGenerator();
var sqlParams = {};

sqlParams = {
    update: 'mytable',
    set : {
        field_c: 1,
        field_d: 1
    },
    where: {
        field_a: 1,
        field_b: 1
    }
}

sqlGenerator.update( sqlParams , function ( err, result ) {
    console.log( 'sqlParams' , sqlParams)
    console.log( 'err:' , err);
    console.log( 'result:' , result);
})

