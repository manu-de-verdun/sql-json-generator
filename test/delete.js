var should = require('chai').should();
var expect = require('chai').expect;

var SQLGenerator = require('../index');

describe('#delete', function () {

    var sqlGenerator = new SQLGenerator();
    var sqlParams;

    it('simple delete', function () {

        sqlParams = {
            from: 'mi_itens_inventarios',
            where: {
                id_mi_item_inventario: 3
            }
        };

        expectedResult = 'DELETE FROM `mi_itens_inventarios` WHERE `id_mi_item_inventario` = \'3\'';

        sqlGenerator.delete(sqlParams).should.equal(expectedResult);
    });

});