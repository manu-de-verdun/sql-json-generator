/**
 * Created by manu on 12/08/2016.
 */
var SQLGenerator = require('../index');


var sqlGenerator = new SQLGenerator();
var sqlParams = {};

sqlParams = {
    update: 'mytable',
    set: {
        field_c: 1,
        field_d: 1
    },
    where: {
        $or : [
            {
                $or : [
                    {field_a: { $gte : 8 }},
                    {field_a: { $lt : 10 }},
                ]

            },
            {
                $and : [
                    {field_b: 3.15},
                    {field_d: { $ne: 'ERR'}}
                ]

            }
        ]
    }
};

var sqlQuery = sqlGenerator.update(sqlParams);

console.log(' ');
console.log('Query: ', sqlQuery);


