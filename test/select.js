var should = require('chai').should();
var expect = require('chai').expect;

var SQLGenerator = require('../index');

describe('#select - json errors', function () {

    var sqlGenerator = new SQLGenerator();
    var sqlParams;

    it('call without params', function () {

        expect(sqlGenerator.select()).to.be.null;

    });


    it('call with missing $select', function () {

        sqlParams = {
            $where: {
                id_mi_item_inventario: 3
            }
        };

        expect(sqlGenerator.select(sqlParams)).to.be.null;

    });

});


describe('#select - queries', function () {

    var sqlGenerator = new SQLGenerator();
    var sqlParams;


    it('simple select', function () {

        sqlParams = {
            $select : {
                $from : 'table1',
                $fields : [
                    'field_a',
                    'field_b',
                    'field_c'
                ]
            },
            $where : {
                field_d: 1
            }
        };

        expectedResult = 'SELECT `table1`.`field_a`, `table1`.`field_b`, `table1`.`field_c` FROM `table1` WHERE `field_d` = \'1\'';

        sqlGenerator.select(sqlParams).should.equal(expectedResult);
    });

});