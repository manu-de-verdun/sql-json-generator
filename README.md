[![npm version](https://badge.fury.io/js/sql-json-generator.svg)](https://badge.fury.io/js/sql-json-generator)

# sql-json-generator

Generate SQL statements from JSON objects

Create reusable json objects to quickly build SQL statments

## Introduction

This module was created because I wanted to create REST services for my existing projects, using node, building also Angular Clients. Even if it is easier to use noSQL database as Mongo with node, all my databases are running with mySQL and I do not want to change or migrate them.  
  
Using the mySQL connector with node is quite easy, but the code for building the SQL statement from scratch could be painful and eventually becomes unreadable the more the query becomes complex.  
  
The input JSON object can be build using other reusable JSON objects (for example a constant with nested JOIN statements, that are used in various queries.  
  
It offers an easy way to build simple or complex queries without having to write the SQL syntax, just writing down the query logic.  
  
The module syntax is loosely based on MongoDB querying syntax.  


## Table of Contents

- [Install](#install)
- [Wiki](#wiki)
- [API](#api)
- [Debugging](#debugging)
- [mySQL features](#mySQL-Features)

## Install

Install with `npm install sql-json-generator`

```
var SQLGenerator = require('sql-json-generator');
var sqlGenerator = new SQLGenerator();
```

## Wiki

Find mode complex queries examples on the project [wiki](https://github.com/manu-de-verdun/sql-json-generator/wiki)

## Change log

[Change Log](https://github.com/manu-de-verdun/sql-json-generator/blob/master/CHANGELOG.md)

All notable changes to this project will be documented in this file.

## API

### SELECT

``sqlGenerator.select( queryData )``

The first parameter contains the data used to produce the SQL query.
The function returns a string with the SQL. In case of error, will return ``null``

*example:*
```
sqlParams = {
    $from : 'table1',
    $fields : [
        'column_a',
        'column_b',
        'column_c'
    ],
    $where : [{
        column_d: 1
    }]
}

sqlGenerator.select( sqlParams);
```
*will return:*
```
SELECT `column_a`, `column_b`, `column_c` FROM `table1` WHERE `table1`.`column_d` = '1'
```


### INSERT

``sqlGenerator.insert( queryData )``

The first parameter contains the data used to produce the SQL query.
The function returns a string with the SQL. In case of error, will return ``null``

*example:*
```
sqlParams = {
    $insert: 'mytable',
    $values : {
        column_a: 1,
        column_b: 1
    }
}

sqlGenerator.insert( sqlParams);
```
*will return:*
```
INSERT INTO `mytable` (`column_a`,`column_b`) VALUES ('1','1')
```

### UPDATE

``sqlGenerator.update( queryData )``

The first parameter contains the data used to produce the SQL query.
The function returns a string with the SQL. In case of error, will return ``null``

*example:*
```
sqlParams = {
    $update: 'mytable',
    $set : {
        column_b: 1
    },
    $where: [{
        column_a: 1
    }]
}

sqlGenerator.update( sqlParams);
```
*will return:*
```
UPDATE  `mytable`  SET `column_b` = '1' WHERE `column_a` = '1'
```

> ``$where`` parameter is optional

### DELETE

``.delete( queryData )``

The first parameter contains the data used to produce the SQL query.
The function returns a string with the SQL. In case of error, will return ``null``

*example:*
```
sqlParams = {
    $delete: 'mytable',
    $where: [{
        column_a: 1
    }]
}

sqlGenerator.delete( sqlParams);
```
*will return:*
```
UPDATE  `mytable`  SET `column_b` = '1' WHERE `column_a` = '1'
```

> ``$where`` parameter is optional




## Formating queryData

### SELECT

#### $from, $fields, $field: basic SELECT FROM query

Columns to be displayed in a SELECT statement are elements of an array. It can be just an array of columns names

*example:*
```
{
    $from : 'table1',
    $fields : [
        'column_a',
        'column_b'
    ]
}
```
*will return:*
```
SELECT `table1`.`column_a`, `table1`.`column_b` FROM `table1`
```

To apply extra SQL formats to the colums (such as AS, SUM) the column must be wrapped in an object:

*example:*
```
{
    $from : 'table1',
    $fields : [
        {
            $field: 'column_a'
        },
        {
            $field: 'column_b'
        },
    ]
}
```
*will return:*
```
SELECT `table1`.`column_a`, `table1`.`column_b` FROM `table1`
```

#### $field

``$field : column_name``

> ``$field`` must be used within an object.

> table name is inherited from the parent table object ( $from, $inner ... )

#### $as

``$as : alias name``

> ``$as`` must be used within an object, with a ``$field`` property.

*example:*
```
{
    $from : 'table1',
    $fields : [
        {
            $field: 'column_a',
            $as: 'column_a_as'
        },
        'column_b'
    ]
}
```
*will return:*
```
SELECT `table1`.`column_a` AS column_a_as, `table1`.`column_b` FROM `table1`
```

#### $dateFormat

``$dateFormat : output date format`` (see SQL doc).

> ``$dateFormat`` must be used within an object, with a ``$field`` property.

*example:*
```
{
    $from : 'table1',
    $fields : [
        {
            $field: 'column_a',
            $dateFormat : '%Y-%m-%d',
            $as: 'column_date'
        }
    ]
}
```
*will return:*
```
SELECT DATE_FORMAT(`table1`.`column_a`,'%Y-%m-%d') AS column_date FROM `table1`
```


#### $avg $count $min $max $sum

``count : 1``

*example:*
```
{
    $from : 'table1',
    $fields : [
        {
            $field: 'column_a',
            $count : 1,
            $as: 'column_date'
        }
    ]
}
```
*will return:*
```
SELECT COUNT(`table1`.`column_a`) AS column_date FROM `table1`
```


#### $where


*example:*
```
{
    $from : 'table1',
    $fields : [
        'column_a',
        'column_b'
    ],
    $where : [{
        'column_c' : 1
    }]
}
```
*will return:*
```
SELECT `table1`.`column_a`, `table1`.`column_b` FROM `table1` WHERE `table1`.`column_c` = 1
```


### JOINS : $inner, $left, $right, $full


> JOIN tables are placed as an element inside the ``$fields`` array of the parent table.

> JOIN tables can be nested

|    JSON  |     SQL       |
|----------|:-------------:|
| ``$inner`` | INNER JOIN |
| ``$left`` |    LEFT JOIN   |
| ``$right`` |    RIGHT JOIN  |
| ``$full`` |    LEFT JOIN   |

> JOIN object must have one ``$using``  or one  ``$on`` parameter
> JOIN object must have one ``$fields`` parameter

*example:*
```
{
    $from : 'table1',
    $fields : [
        'column1a',
        'column1b',
        {
            $inner : 'table2',
            $using : 'column2a',
            $fields : [
                'column2a',
                'column2b',
            ]
        }
    ]
}
```
*will return:*
```
SELECT `table1`.`column1a`, `table1`.`column1b`, `table2`.`column2a`, `table2`.`column2b` FROM `table1` INNER JOIN `table2` USING(`column2a`)
```

*example:*
```
{
    $from : 'table1',
    $fields : [
        'column1a',
        'column1b',
        {
            $inner : 'table2',
            $on: {
                $parent : 'table2ForeignKey',
                $child : 'primaryKey'
            }
            $fields : [
                'column2a',
                'column2b',
            ]
        }
    ]
}
```
*will return:*
```
SELECT `table1`.`column1a`, `table1`.`column1b`, `table2`.`column2a`, `table2`.`column2b` FROM `table1` INNER JOIN `table2` ON `table1`.`table2ForeignKey` = `table2`.`primaryKey`
```

>  ``$on`` can be an array

*example:*
```
{
    $from : 'table1',
    $fields : [
        'column1a',
        'column1b',
        {
            $inner : 'table2',
            $on: [{
                $parent : 'table2ForeignKeyA',
                $child : 'primaryKeyA'
            },
            {
                $parent : 'table2ForeignKeyB',
                $child : 'primaryKeyB'
                        }]
            $fields : [
                'column2a',
                'column2b',
            ]
        }
    ]
}
```
*will return:*
```
SELECT `table1`.`column1a`, `table1`.`column1b`, `table2`.`column2a`, `table2`.`column2b` FROM `table1` INNER JOIN `table2` ON ( `table1`.`table2ForeignKeyA` = `table2`.`primaryKeyA` AND `table1`.`table2ForeignKeyB` = `table2`.`primaryKeyB` )
```
### $where

``$where: [{condition1}, {condition2}....]``


#### Simple Column comparison

Simple column comparison, ie *column equal value* can be wrote using simple style

``{ column_name : value }``

> In case of SELECT statement, the column name will be prefixed by the FROM table name

*example:*
```
[
    {column_a: 1}
]
```
*will return:*
```
column_a = '1'
```
*or, for SELECT statement*

```
table_a.column_a = '1'
```

#### Logical Operators: $and and $or

``{ $and : [{condition1}, {condition2}... ]}`` , ``{ $or : [{condition1}, {condition2}... ]}``

*example:*
```
{
    $or : [
        {column_a: 1},
        {column_b: 1}
    ]
}
```
*will return:*
```
(column_a = '1' OR column_b = '1')
```

##### default behavior: $and

*example:*
```
[
    {column_a: 1},
    {column_b: 1},
    {column_c: 1}
]
```
*will return:*
```
column_a = '1' AND column_b = '1' AND column_c = '1'
```


#### Complex Colums comparison

``{ $table: table_name, $field: field_name, comparison_operator : value}``

> If ``$table`` is not specified, will use the primary table name *(FROM, UPDATE)*

*example:*
```
[
    {
        $field: 'column_a',
        $eq : 1
    },
    {
        $table: 'table_b
        $field: 'column_b',
        $eq : 1
    }
]
```
*will return:*
```
table_a.column_a = '1' AND table_b.column_b = '1'
```


#### Comparison Operators

``$gt : value``

|    JSON  |     SQL       |
|----------|:-------------:|
| ``$gt`` | ``>`` |
| ``$gte`` |    ``>=``   |
| ``$lt`` |    ``<``   |
| ``$lte`` |    ``<=``   |
| ``$eq`` |    ``=``   |
| ``$ne`` |    ``<>``   |
| ``$like`` |    ``LIKE``   |


*example:*
```
[
    {
        $field: 'column_a',
        $gt : 1
    }
]
```
*will return:*
```
column_a > '1'
```

#### $in

*example:*
```
{
    {
        $field: 'column_a',
        $in: [ 1, 2 ]
    }
}
```
*will return:*
```
column_a IN ( 1 , 2 )
```



### $limit

``$limit: { $offset :  offset_value , $rows : rows_to_return  }``

*example:*
```
{
    $limit : {
        $offset: 0,
        $rows: 10
    }
}
```
*will return:*
```
LIMIT 0,10
```


### $order

``$order: [ list of fields ]``

*example:*
```
{
    $order : [
        'column1',
        'column2'
    ]
}
```
*will return:*
```
ORDER BY current_table.column1, current_table.column2
```



> Elements of the $order array can be aliases names, previously defined, using the $as tag

*example:*
```
{
    $fields: [
        {
          $field: 'column1'
          $as : 'alias'
        }
    ]
    $order : [
        { $as : 'alias' }
    ]
}
```
*will return:*
```
ORDER BY current_table.column1, current_table.column2
```

#### $desc

to append DESC into one ORDER directive, the required field must be explicitly declared using ``$table`` and ``$field``, or ``$as``

*example:*
```
{
    $order : [
        {
            $table: 'table1',
            $field: 'column1',
            $desc : 1
        }
    ]
}
```
*will return:*
```
ORDER BY table1.column1 DESC
```

> If not using a ``$table`` tag with ``$field``, the current table will be used to build the command

*example:*
```
{
    $order : [
        {
            $field: 'column1',
            $desc : 1
        }
    ]
}
```
*will return:*
```
ORDER BY current_table.column1 DESC
```


### $group

``$group: [ list of fields ]``

*example:*
```
{
    $group : [
        'column1',
        'column2'
    ]
}
```
*will return:*
```
GROUP BY current_table.column1, current_table.column2
```

> ``$group`` uses the same syntaxt as ``$order``

## mySQL Features

### Escaping strings

´´var sqlGenerator = new SQLGenerator({escape: true});´´

will escape the strings values.

### $sqlCalcFoundRows

`` $sqlCalcFoundRows: true``

Will insert SQL_CALC_FOUND_ROWS just after SELECT keywords

> If there is no ``$limit`` defined, the SQL_CALC_FOUND_ROWS is useless and  will not be added after the SELECT.

*example:*
```
{
    $from: 'setores',
    $fields: ['id_setor', 'nome'],
    $where: [],
    $sqlCalcFoundRows: true,
    $limit: {
        $rows: 20,
        $offset: 0
    }
}
```
*will return:*
```
SELECT SQL_CALC_FOUND_ROWS `setores`.`id_setor`, `setores`.`nome` FROM `setores` LIMIT 0,20
```


## Debugging

> Display all generator steps in the console:

´´var sqlGenerator = new SQLGenerator({debug: true});´´

> Display generated SQL in the console:

´´var sqlGenerator = new SQLGenerator({showSQL: true});´´