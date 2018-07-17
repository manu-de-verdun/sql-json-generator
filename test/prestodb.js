var should = require('chai').should();
var expect = require('chai').expect;

var SQLGenerator = require('../index');

describe('#prestoDB - SELECT', function () {

    var sqlGenerator = new SQLGenerator({ prestoDB: true });
    var sqlParams;

    it('query #01 - testing integer type is maintained - using equals operator', function () {

        sqlParams = {
            $from: 'table1',
            $fields: ['field_a'],
            $where: [{
                field_a: 1
            }]
        };

        var expectedResult = 'SELECT table1.field_a FROM table1 WHERE table1.field_a = 1';

        sqlGenerator.select(sqlParams).should.equal(expectedResult);
    });

    it('query #02 - testing integer type is maintained - using greater than equals operator', function () {

        sqlParams = {
            $from: 'table1',
            $fields: ['field_a'],
            $where: [{
                $field: "field_a",
                $gte: 100
            }]
        };

        var expectedResult = 'SELECT table1.field_a FROM table1 WHERE table1.field_a >= 100';

        sqlGenerator.select(sqlParams).should.equal(expectedResult);
    });

    it('query #03 - testing float type is maintained', function () {

        sqlParams = {
            $from: 'table1',
            $fields: ['field_a'],
            $where: [{
                $field: "field_a",
                $lt: 10.55
            }]
        };

        var expectedResult = 'SELECT table1.field_a FROM table1 WHERE table1.field_a < 10.55';

        sqlGenerator.select(sqlParams).should.equal(expectedResult);
    });

    it('query #04 - testing string type on input will be interpreted correctly as a string type by the library', function () {

        sqlParams = {
            $from: 'table1',
            $fields: ['field_a'],
            $where: [{
                $field: "field_a",
                $like: '%test%'
            }]
        };

        var expectedResult = 'SELECT table1.field_a FROM table1 WHERE table1.field_a LIKE \'%test%\'';

        sqlGenerator.select(sqlParams).should.equal(expectedResult);
    });

    it('query #04 - testing limit syntax correctly forms expected sql query for presto', function () {

        sqlParams = {
            $from: 'table1',
            $fields: ['field_a'],
            $where: [],
            $limit: {
                $offset: 0,
                $rows: 10
            }
        };

        var expectedResult = 'SELECT table1.field_a FROM table1 LIMIT 10';

        sqlGenerator.select(sqlParams).should.equal(expectedResult);
    });

    it('query #05 - testing with integer 0', function () {

        sqlParams = {
            $from: 'table1',
            $fields: ['field_a'],
            $where: [{
                $field: "field_a",
                $lt: 0
            }]
        };

        var expectedResult = 'SELECT table1.field_a FROM table1 WHERE table1.field_a < 0';

        sqlGenerator.select(sqlParams).should.equal(expectedResult);
    });

    it('query #06 - testing with integer 0 including an $and clause', function () {

        sqlParams = {
            $from: 'table1',
            $fields: ['field_a'],
            $where: [{
                $and : [
                    {
                        $field: "field_a",
                        $lt: 0
                    },
                    {
                        $field: "field_b",
                        $gt: 20160110
                    }
                ]
            }]
        };

        var expectedResult = 'SELECT table1.field_a FROM table1 WHERE (table1.field_a < 0 AND table1.field_b > 20160110)';

        sqlGenerator.select(sqlParams).should.equal(expectedResult);
    });
});