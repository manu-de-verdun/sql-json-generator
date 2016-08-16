var should = require('chai').should();
var expect = require('chai').expect;

var SQLGenerator = require('../index');

describe('#update', function () {

    var sqlGenerator = new SQLGenerator();
    var sqlParams;

    it('simple update', function () {

        sqlParams = {
            update: 'mytable',
            set: {
                field_b: 1
            },
            where: {
                field_a: 1
            }
        };

        expectedResult = 'UPDATE `mytable` SET `field_b` = \'1\' WHERE `field_a` = \'1\'';

        sqlGenerator.update(sqlParams).should.equal(expectedResult);

    });

    it('double field update', function () {

        sqlParams = {
            update: 'mytable',
            set: {
                field_c: 1,
                field_d: 1
            },
            where: {
                field_a: 1
            }
        };

        expectedResult = 'UPDATE `mytable` SET `field_c` = \'1\',`field_d` = \'1\' WHERE `field_a` = \'1\'';

        sqlGenerator.update(sqlParams).should.equal(expectedResult);

    });


    it('double field update with to where params', function () {

        sqlParams = {
            update: 'mytable',
            set: {
                field_c: 1,
                field_d: 1
            },
            where: {
                field_a: 1,
                field_b: 1
            }
        };

        expectedResult = 'UPDATE `mytable` SET `field_c` = \'1\',`field_d` = \'1\' WHERE `field_a` = \'1\' AND `field_b` = \'1\'';

        sqlGenerator.update(sqlParams).should.equal(expectedResult);
    });

    it('simple $gt', function () {

        sqlParams = {
            update: 'mytable',
            set: {
                field_c: 1,
                field_d: 1
            },
            where: {
                field_a: {
                    $gt: 1
                }
            }
        };

        expectedResult = 'UPDATE `mytable` SET `field_c` = \'1\',`field_d` = \'1\' WHERE `field_a` > \'1\'';

        sqlGenerator.update(sqlParams).should.equal(expectedResult);
    });


    it('double $gt', function () {

        sqlParams = {
            update: 'mytable',
            set: {
                field_c: 1,
                field_d: 1
            },
            where: {
                field_a: {
                    $gt: 1
                },
                field_b: {
                    $gt: 1
                }
            }
        };

        expectedResult = 'UPDATE `mytable` SET `field_c` = \'1\',`field_d` = \'1\' WHERE `field_a` > \'1\' AND `field_b` > \'1\'';

        sqlGenerator.update(sqlParams).should.equal(expectedResult);
    });

    it('simple $gte', function () {

        sqlParams = {
            update: 'mytable',
            set: {
                field_c: 1,
                field_d: 1
            },
            where: {
                field_a: {
                    $gte: 1
                }
            }
        };

        expectedResult = 'UPDATE `mytable` SET `field_c` = \'1\',`field_d` = \'1\' WHERE `field_a` >= \'1\'';

        sqlGenerator.update(sqlParams).should.equal(expectedResult);
    });

    it('simple $lt', function () {

        sqlParams = {
            update: 'mytable',
            set: {
                field_c: 1,
                field_d: 1
            },
            where: {
                field_a: {
                    $lt: 1
                }
            }
        };

        expectedResult = 'UPDATE `mytable` SET `field_c` = \'1\',`field_d` = \'1\' WHERE `field_a` < \'1\'';

        sqlGenerator.update(sqlParams).should.equal(expectedResult);
    });

    it('simple $lte', function () {

        sqlParams = {
            update: 'mytable',
            set: {
                field_c: 1,
                field_d: 1
            },
            where: {
                field_a: {
                    $lte: 1
                }
            }
        };

        expectedResult = 'UPDATE `mytable` SET `field_c` = \'1\',`field_d` = \'1\' WHERE `field_a` <= \'1\'';

        sqlGenerator.update(sqlParams).should.equal(expectedResult);
    });

    it('simple $eq', function () {

        sqlParams = {
            update: 'mytable',
            set: {
                field_c: 1,
                field_d: 1
            },
            where: {
                field_a: {
                    $eq: 1
                }
            }
        };

        expectedResult = 'UPDATE `mytable` SET `field_c` = \'1\',`field_d` = \'1\' WHERE `field_a` = \'1\'';

        sqlGenerator.update(sqlParams).should.equal(expectedResult);
    });
    ;

    it('simple $ne', function () {

        sqlParams = {
            update: 'mytable',
            set: {
                field_c: 1,
                field_d: 1
            },
            where: {
                field_a: {
                    $ne: 1
                }
            }
        };

        expectedResult = 'UPDATE `mytable` SET `field_c` = \'1\',`field_d` = \'1\' WHERE `field_a` <> \'1\'';

        sqlGenerator.update(sqlParams).should.equal(expectedResult);
    });

    it('$and', function () {

        sqlParams = {
            update: 'mytable',
            set: {
                field_c: 1,
                field_d: 1
            },
            where: {
                $and: [
                    {field_a: 1},
                    {field_b: 1}
                ]

            }
        };

        expectedResult = 'UPDATE `mytable` SET `field_c` = \'1\',`field_d` = \'1\' WHERE (`field_a` = \'1\' AND `field_b` = \'1\')';

        sqlGenerator.update(sqlParams).should.equal(expectedResult);
    });

    it('$or', function () {

        sqlParams = {
            update: 'mytable',
            set: {
                field_c: 1,
                field_d: 1
            },
            where: {
                $or: [
                    {field_a: 1},
                    {field_b: 1}
                ]

            }
        };

        expectedResult = 'UPDATE `mytable` SET `field_c` = \'1\',`field_d` = \'1\' WHERE (`field_a` = \'1\' OR `field_b` = \'1\')';

        sqlGenerator.update(sqlParams).should.equal(expectedResult);
    });


    it('$or and nested $and and $or', function () {

        sqlParams = {
            update: 'mytable',
            set: {
                field_c: 1,
                field_d: 1
            },
            where: {
                $or: [
                    {
                        $or: [
                            {field_a: 1},
                            {field_b: 1}
                        ]

                    },
                    {
                        $and: [
                            {field_c: 1},
                            {field_d: 1}
                        ]

                    }
                ]
            }
        };

        expectedResult = 'UPDATE `mytable` SET `field_c` = \'1\',`field_d` = \'1\' WHERE ((`field_a` = \'1\' OR `field_b` = \'1\') OR (`field_c` = \'1\' AND `field_d` = \'1\'))';

        sqlGenerator.update(sqlParams).should.equal(expectedResult);
    });

    it('complex query', function () {

        sqlParams = {
            update: 'mytable',
            set: {
                field_c: 1,
                field_d: 1
            },
            where: {
                $or: [
                    {
                        $or: [
                            {field_a: {$gte: 8}},
                            {field_a: {$lt: 10}},
                        ]

                    },
                    {
                        $and: [
                            {field_b: 3.15},
                            {field_d: {$ne: 'ERR'}}
                        ]

                    }
                ]
            }
        };

        expectedResult = 'UPDATE `mytable` SET `field_c` = \'1\',`field_d` = \'1\' WHERE ((`field_a` >= \'8\' OR `field_a` < \'10\') OR (`field_b` = \'3.15\' AND `field_d` <> \'ERR\'))';

        sqlGenerator.update(sqlParams).should.equal(expectedResult);
    });

});

