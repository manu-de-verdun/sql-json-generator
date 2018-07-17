var should = require("chai").should();
var expect = require("chai").expect;

var SQLGenerator = require("../index");

describe("#update - json errors", function() {
  var sqlGenerator = new SQLGenerator();
  var sqlParams;

  it("call without params", function() {
    expect(sqlGenerator.update()).to.be.null;
  });

  it("call with missing $update", function() {
    sqlParams = {
      $set: {
        arquivado: 0,
        arquivado_codigo: ""
      }
    };

    expect(sqlGenerator.update(sqlParams)).to.be.null;
  });

  it("call with missing $set", function() {
    sqlParams = {
      $update: "table1"
    };

    expect(sqlGenerator.update(sqlParams)).to.be.null;
  });
});

describe("#update - queries", function() {
  var sqlGenerator = new SQLGenerator();
  var sqlParams;

  it("simple update", function() {
    sqlParams = {
      $update: "mytable",
      $set: {
        field_b: 1
      },
      $where: [
        {
          field_a: 1
        }
      ]
    };

    var expectedResult = "UPDATE `mytable` SET `field_b` = '1' WHERE `field_a` = '1'";

    sqlGenerator.update(sqlParams).should.equal(expectedResult);
  });

  it("simple update", function() {
    sqlParams = {
      $update: "mytable",
      $set: {
        field_b: 1
      },
      $where: [
        {
          field_a: 1
        }
      ]
    };

    var expectedResult = "UPDATE `mytable` SET `field_b` = '1' WHERE `field_a` = '1'";

    sqlGenerator.update(sqlParams).should.equal(expectedResult);
  });

  it("update without where", function() {
    sqlParams = {
      $update: "mi_itens_inventarios",
      $set: {
        arquivado: 0,
        arquivado_codigo: ""
      }
    };

    var expectedResult = "UPDATE `mi_itens_inventarios` SET `arquivado` = '0',`arquivado_codigo` = ''";

    sqlGenerator.update(sqlParams).should.equal(expectedResult);
  });

  it("double field update", function() {
    sqlParams = {
      $update: "mytable",
      $set: {
        field_c: 1,
        field_d: 1
      },
      $where: [
        {
          field_a: 1
        }
      ]
    };

    var expectedResult = "UPDATE `mytable` SET `field_c` = '1',`field_d` = '1' WHERE `field_a` = '1'";

    sqlGenerator.update(sqlParams).should.equal(expectedResult);
  });

  it("double field update with to where params", function() {
    sqlParams = {
      $update: "mytable",
      $set: {
        field_c: 1,
        field_d: 1
      },
      $where: [
        {
          field_a: 1
        },
        {
          field_b: 1
        }
      ]
    };

    var expectedResult = "UPDATE `mytable` SET `field_c` = '1',`field_d` = '1' WHERE `field_a` = '1' AND `field_b` = '1'";

    sqlGenerator.update(sqlParams).should.equal(expectedResult);
  });

  it("simple $gt", function() {
    sqlParams = {
      $update: "mytable",
      $set: {
        field_c: 1,
        field_d: 1
      },
      $where: [
        {
          $field: "field_a",
          $gt: 1
        }
      ]
    };

    var expectedResult = "UPDATE `mytable` SET `field_c` = '1',`field_d` = '1' WHERE `field_a` > '1'";

    sqlGenerator.update(sqlParams).should.equal(expectedResult);
  });

  it("simple $gt with 0", function() {
    sqlParams = {
      $update: "mytable",
      $set: {
        field_c: 1,
        field_d: 1
      },
      $where: [
        {
          $field: "field_a",
          $gt: 0
        }
      ]
    };

    var expectedResult = "UPDATE `mytable` SET `field_c` = '1',`field_d` = '1' WHERE `field_a` > '0'";

    sqlGenerator.update(sqlParams).should.equal(expectedResult);
  });

  it("double $gt", function() {
    sqlParams = {
      $update: "mytable",
      $set: {
        field_c: 1,
        field_d: 1
      },
      $where: [
        {
          $field: "field_a",
          $gt: 1
        },
        {
          $field: "field_b",
          $gt: 1
        }
      ]
    };

    var expectedResult = "UPDATE `mytable` SET `field_c` = '1',`field_d` = '1' WHERE `field_a` > '1' AND `field_b` > '1'";

    sqlGenerator.update(sqlParams).should.equal(expectedResult);
  });

  it("simple $gte", function() {
    sqlParams = {
      $update: "mytable",
      $set: {
        field_c: 1,
        field_d: 1
      },
      $where: [
        {
          $field: "field_a",
          $gte: 1
        }
      ]
    };

    var expectedResult = "UPDATE `mytable` SET `field_c` = '1',`field_d` = '1' WHERE `field_a` >= '1'";

    sqlGenerator.update(sqlParams).should.equal(expectedResult);
  });

  it("simple $gte with 0", function() {
    sqlParams = {
      $update: "mytable",
      $set: {
        field_c: 1,
        field_d: 1
      },
      $where: [
        {
          $field: "field_a",
          $gte: 0
        }
      ]
    };

    var expectedResult = "UPDATE `mytable` SET `field_c` = '1',`field_d` = '1' WHERE `field_a` >= '0'";

    sqlGenerator.update(sqlParams).should.equal(expectedResult);
  });

  it("simple $lt", function() {
    sqlParams = {
      $update: "mytable",
      $set: {
        field_c: 1,
        field_d: 1
      },
      $where: [
        {
          $field: "field_a",
          $lt: 1
        }
      ]
    };

    var expectedResult = "UPDATE `mytable` SET `field_c` = '1',`field_d` = '1' WHERE `field_a` < '1'";

    sqlGenerator.update(sqlParams).should.equal(expectedResult);
  });

  it("simple $lt with 0", function() {
    sqlParams = {
      $update: "mytable",
      $set: {
        field_c: 1,
        field_d: 1
      },
      $where: [
        {
          $field: "field_a",
          $lt: 0
        }
      ]
    };

    var expectedResult = "UPDATE `mytable` SET `field_c` = '1',`field_d` = '1' WHERE `field_a` < '0'";

    sqlGenerator.update(sqlParams).should.equal(expectedResult);
  });

  it("simple $lte", function() {
    sqlParams = {
      $update: "mytable",
      $set: {
        field_c: 1,
        field_d: 1
      },
      $where: [
        {
          $field: "field_a",
          $lte: 1
        }
      ]
    };

    var expectedResult = "UPDATE `mytable` SET `field_c` = '1',`field_d` = '1' WHERE `field_a` <= '1'";

    sqlGenerator.update(sqlParams).should.equal(expectedResult);
  });

  it("simple $lte with 0", function() {
    sqlParams = {
      $update: "mytable",
      $set: {
        field_c: 1,
        field_d: 1
      },
      $where: [
        {
          $field: "field_a",
          $lte: 0
        }
      ]
    };

    var expectedResult = "UPDATE `mytable` SET `field_c` = '1',`field_d` = '1' WHERE `field_a` <= '0'";

    sqlGenerator.update(sqlParams).should.equal(expectedResult);
  });

  it("simple $eq", function() {
    sqlParams = {
      $update: "mytable",
      $set: {
        field_c: 1,
        field_d: 1
      },
      $where: [
        {
          $field: "field_a",
          $eq: 1
        }
      ]
    };

    var expectedResult = "UPDATE `mytable` SET `field_c` = '1',`field_d` = '1' WHERE `field_a` = '1'";

    sqlGenerator.update(sqlParams).should.equal(expectedResult);
  });

  it("simple $eq with 0", function() {
    sqlParams = {
      $update: "mytable",
      $set: {
        field_c: 1,
        field_d: 1
      },
      $where: [
        {
          $field: "field_a",
          $eq: 0
        }
      ]
    };

    var expectedResult = "UPDATE `mytable` SET `field_c` = '1',`field_d` = '1' WHERE `field_a` = '0'";

    sqlGenerator.update(sqlParams).should.equal(expectedResult);
  });

  it("simple $ne", function() {
    sqlParams = {
      $update: "mytable",
      $set: {
        field_c: 1,
        field_d: 1
      },
      $where: [
        {
          $field: "field_a",
          $ne: 1
        }
      ]
    };

    var expectedResult = "UPDATE `mytable` SET `field_c` = '1',`field_d` = '1' WHERE `field_a` <> '1'";

    sqlGenerator.update(sqlParams).should.equal(expectedResult);
  });

  it("simple $ne with 0", function() {
    sqlParams = {
      $update: "mytable",
      $set: {
        field_c: 1,
        field_d: 1
      },
      $where: [
        {
          $field: "field_a",
          $ne: 0
        }
      ]
    };

    var expectedResult = "UPDATE `mytable` SET `field_c` = '1',`field_d` = '1' WHERE `field_a` <> '0'";

    sqlGenerator.update(sqlParams).should.equal(expectedResult);
  });

  it("$and", function() {
    sqlParams = {
      $update: "mytable",
      $set: {
        field_c: 1,
        field_d: 1
      },
      $where: [
        {
          $and: [{ field_a: 1 }, { field_b: 1 }]
        }
      ]
    };

    var expectedResult = "UPDATE `mytable` SET `field_c` = '1',`field_d` = '1' WHERE (`field_a` = '1' AND `field_b` = '1')";

    sqlGenerator.update(sqlParams).should.equal(expectedResult);
  });

  it("$or", function() {
    sqlParams = {
      $update: "mytable",
      $set: {
        field_c: 1,
        field_d: 1
      },
      $where: [
        {
          $or: [{ field_a: 1 }, { field_b: 1 }]
        }
      ]
    };

    var expectedResult = "UPDATE `mytable` SET `field_c` = '1',`field_d` = '1' WHERE (`field_a` = '1' OR `field_b` = '1')";

    sqlGenerator.update(sqlParams).should.equal(expectedResult);
  });

  it("$or and nested $and and $or", function() {
    sqlParams = {
      $update: "mytable",
      $set: {
        field_c: 1,
        field_d: 1
      },
      $where: [
        {
          $or: [
            {
              $or: [{ field_a: 1 }, { field_b: 1 }]
            },
            {
              $and: [{ field_c: 1 }, { field_d: 1 }]
            }
          ]
        }
      ]
    };

    var expectedResult = "UPDATE `mytable` SET `field_c` = '1',`field_d` = '1' WHERE ((`field_a` = '1' OR `field_b` = '1') OR (`field_c` = '1' AND `field_d` = '1'))";

    sqlGenerator.update(sqlParams).should.equal(expectedResult);
  });

  it("complex query", function() {
    sqlParams = {
      $update: "mytable",
      $set: {
        field_c: 1,
        field_d: 1
      },
      $where: [
        {
          $or: [
            {
              $or: [
                {
                  $field: "field_a",
                  $gte: 8
                },
                {
                  $field: "field_a",
                  $lt: 10
                }
              ]
            },
            {
              $and: [
                { field_b: 3.15 },
                {
                  $field: "field_d",
                  $ne: "ERR"
                }
              ]
            }
          ]
        }
      ]
    };

    var expectedResult = "UPDATE `mytable` SET `field_c` = '1',`field_d` = '1' WHERE ((`field_a` >= '8' OR `field_a` < '10') OR (`field_b` = '3.15' AND `field_d` <> 'ERR'))";

    sqlGenerator.update(sqlParams).should.equal(expectedResult);
  });
});
