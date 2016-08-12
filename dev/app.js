/**
 * Created by manu on 12/08/2016.
 */
sqlGenerator = require('../index');


var sqlParams = {};

sqlParams = {
    update: 'mytable',
    set : {
        field_b: 1
    },
    where: {
        field_a: 1
    }
}

sqlGenerator.update( sqlParams , function ( err, result ) {
    console.log( 'sqlParams' , sqlParams)
    console.log( 'err:' , err);
    console.log( 'result:' , result);
})

