var should = require('chai').should();
var expect = require('chai').expect;

var SQLGenerator = require('../index');


describe('#escaped - queries with escaped option activated', function () {

    var sqlGenerator = new SQLGenerator({ escaped: true });
    var sqlParams;

    it('simple insert with special chars', function () {
        sqlParams = {
            $insert: 'table_1',
            $values: {
                field_a: "string",
                field_b: "string n' roses",
                field_c: 1
            }
        };

        var expectedResult = "INSERT INTO `table_1` (`field_a`,`field_b`,`field_c`) VALUES ('string','string n\\' roses','1')";

        sqlGenerator.insert(sqlParams).should.equal(expectedResult);

    });

    it('simple update with special chars', function () {

        sqlParams = {
            $update: 'mytable',
            $set: {
                field_a: "string",
                field_b: "string n' roses",
                field_c: 1
            },
            $where: [{
                field_a: 1
            }]
        };

        var expectedResult = "UPDATE `mytable` SET `field_a` = 'string',`field_b` = 'string n\\' roses',`field_c` = '1' WHERE `field_a` = '1'";

        sqlGenerator.update(sqlParams).should.equal(expectedResult);

    });
});