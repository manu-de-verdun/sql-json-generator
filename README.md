[![npm version](https://badge.fury.io/js/sql-json-generator.svg)](https://badge.fury.io/js/sql-json-generator)

# sql-json-generator

Generate SQL command from JSON object

## Install

Install with `npm install sql-json-generator`

```
var SQLGenerator = require('sql-json-generator');
var sqlGenerator = new SQLGenerator();
```

## API

### SELECT

`.select( queryData )`

The first parameter contains the data used to produce the SQL query.
The function returns a string with the SQL. In case of error, will return ``null``

```
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
}

sqlGenerator.update( sqlParams);
```

will return:

```
SELECT `field_a`, `field_b`, `field_c` FROM `table1` WHERE `field_d` = '1'
```


### INSERT

`.insert( queryData )`

The first parameter contains the data used to produce the SQL query.
The function returns a string with the SQL. In case of error, will return ``null``

```
sqlParams = {
    $insert: 'mytable',
    $values : {
        field_a: 1,
        field_b: 1
    }
}

sqlGenerator.update( sqlParams);
```

will return:

```
INSERT INTO `mytable` (`field_a`,`field_b`) VALUES ('1','1')
```

### UPDATE

`.update( queryData )`

The first parameter contains the data used to produce the SQL query.
The function returns a string with the SQL. In case of error, will return ``null``

```
sqlParams = {
    $update: 'mytable',
    $set : {
        field_b: 1
    },
    $where: {
        field_a: 1
    }
}

sqlGenerator.update( sqlParams);
```

will return:

```
UPDATE  `mytable`  SET `field_b` = '1' WHERE `field_a` = '1'
```

> ``$where`` parameter is optional

### DELETE

`.delete( queryData )`

The first paramenter contains the data used to produce the SQL query.
The function returns a string with the SQL. In case of error, will return ``null``

```
sqlParams = {
    $delete: 'mytable',
    $where: {
        field_a: 1
    }
}

sqlGenerator.delete( sqlParams);
```

will return:

```
UPDATE  `mytable`  SET `field_b` = '1' WHERE `field_a` = '1'
```

> ``$where`` parameter is optional

## Formating queryData

### $select

### $where

``$where: { conditions... }``

#### Logical Operators: $and and $or

*Syntax:* ``{ $and : [{condition1}, {condition2}... ]}`` , ``{ $or : [{condition1}, {condition2}... ]}``

```
{
    $or : [
        {field_a: 1},
        {field_b: 1}
    ]
}
```
will return:

```
(field_a = '1' OR field_b = '1')
```

##### default behavior: $and

```
{
    field_a: 1,
    field_b: 1,
    field_c: 1
}
```

will return:

```
field_a = '1' AND field_b = '1' AND field_c = '1'
```

#### Comparaison Operators


|    JSON  |     SQL       |
|----------|:-------------:|
| ``$gt`` | ``>`` |
| ``$gte`` |    ``>=``   |
| ``$lt`` |    ``<``   |
| ``$lte`` |    ``<=``   |
| ``$eq`` |    ``=``   |
| ``$ne`` |    ``<>``   |

*Syntax:* ``{ field : { $gt : value }}``

```
{
    field_a: {
        $gt: 1
    }
}
```


will return:

```
field_a > '1'
```