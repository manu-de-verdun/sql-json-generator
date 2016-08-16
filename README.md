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


### INSERT

`.insert( queryData )`

The first paramenter contains the data used to produce the SQL query.
The function returns a string with the SQL.

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

### UPDATE

`.update( queryData )`

The first paramenter contains the data used to produce the SQL query.
The function returns a string with the SQL.

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

### DELETE

`.delete( queryData )`

The first paramenter contains the data used to produce the SQL query.
The function returns a string with the SQL.

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


## Formating queryData


### WHERE

``where: condition``

#### Logical Operators

##### default behavior: AND

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

##### AND and OR

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