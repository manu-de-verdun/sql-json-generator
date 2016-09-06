var should = require('chai').should();
var expect = require('chai').expect;

var SQLGenerator = require('../index');

describe('#delete - json errors', function () {

    var sqlGenerator = new SQLGenerator();
    var sqlParams;


    it('call without params', function () {

        expect(sqlGenerator.delete()).to.be.null;

    });


    it('call with missing $delete', function () {

        sqlParams = {
            $where: [{
                id_mi_item_inventario: 3
            }]
        };

        expect(sqlGenerator.delete(sqlParams)).to.be.null;

    });

});


describe('#delete - queries', function () {

    var sqlGenerator = new SQLGenerator();
    var sqlParams;


    it('simple delete', function () {

        sqlParams = {
            $delete: 'mi_itens_inventarios',
            $where: [{
                id_mi_item_inventario: 3
            }]
        };

        var expectedResult = 'DELETE FROM `mi_itens_inventarios` WHERE `id_mi_item_inventario` = \'3\'';

        sqlGenerator.delete(sqlParams).should.equal(expectedResult);
    });


    it('delete without where', function () {

        sqlParams = {
            $delete: 'loopback_usuarios'
        };

        var expectedResult = 'DELETE FROM `loopback_usuarios`';

        sqlGenerator.delete(sqlParams).should.equal(expectedResult);
    });

});