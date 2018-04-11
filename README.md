

# sql-json-generator

Generate SQL statements from JSON objects

Create reusable json objects to quickly build SQL statments

> Initially designed for MySQL syntax, see _Other Databases_ section

##  1. <a name='Introduction-0'></a>Introduction

This module was created because I wanted to create REST services for my existing projects, using node, building also Angular Clients. Even if it is easier to use noSQL database as Mongo with node, all my databases are running with mySQL and I do not want to change or migrate them.  
  
Using the mySQL connector with node is quite easy, but the code for building the SQL statement from scratch could be painful and eventually becomes unreadable the more the query becomes complex.  
  
The input JSON object can be build using other reusable JSON objects (for example a constant with nested JOIN statements, that are used in various queries.  
  
It offers an easy way to build simple or complex queries without having to write the SQL syntax, just writing down the query logic.  
  
The module syntax is loosely based on MongoDB querying syntax.  



##  2. <a name='TableofContents-1'></a>Table of Contents

* 1. [Introduction](#Introduction-0)
* 2. [Table of Contents](#TableofContents-1)
* 3. [Install](#Install-2)
* 4. [Wiki](#Wiki-3)
* 5. [Change log](#Changelog-4)
* 6. [API](#API-5)
	* 6.1. [SELECT](#SELECT-6)
	* 6.2. [INSERT](#INSERT-7)
	* 6.3. [UPDATE](#UPDATE-8)
	* 6.4. [DELETE](#DELETE-9)
* 7. [Formating queryData](#FormatingqueryData-10)
	* 7.1. [SELECT](#SELECT-11)
		* 7.1.1. [$from, $fields, $field: basic SELECT FROM query](#fromfieldsfieldquery-12)
		* 7.1.2. [$field](#field-13)
		* 7.1.3. [$as](#as-14)
		* 7.1.4. [$dateFormat](#dateFormat-15)
		* 7.1.5. [$avg $count $min $max $sum](#avgcountminmaxsum-16)
		* 7.1.6. [$upper $lower](#upperlower-16)
		* 7.1.7. [$groupConcat](#groupconcat-16)
		* 7.1.8. [$function](#function-16)
		* 7.1.9. [$where](#where-17)
	* 7.2. [JOINS : $inner, $left, $right, $full](#joinsinnerleftrightfull-18)
	* 7.3. [$where](#where-19)
		* 7.3.1. [Simple Column comparison](#SimpleColumncomparison-20)
		* 7.3.2. [Logical Operators: $and and $or](#logicalandandor-21)
		* 7.3.3. [Complex Colums comparison](#ComplexColumscomparison-22)
		* 7.3.4. [Comparison Operators](#ComparisonOperators-23)
		* 7.3.5. [$in](#in-24)
	* 7.4. [$limit](#limit-25)
	* 7.5. [$order](#order-26)
		* 7.5.1. [$desc](#desc-27)
	* 7.6 [$group](#group-28)
	* 7.7 [$having](#having-34)
    * 7.8 [$raw](#raw-35)
* 8. [mySQL Features](#mySQLFeatures-29)
	* 8.1. [Escaping strings](#Escapingstrings-30)
	* 8.2. [$sqlCalcFoundRows](#sqlCalcFoundRows-31)
* 9. [Other Databases](#otherdb-01)
* 10. [Debugging](#Debugging-32)
* 11. [Testing](#Testing-33)


##  3. <a name='Install-2'></a>Install

Install with `npm install sql-json-generator`

```
var SQLGenerator = require('sql-json-generator');
var sqlGenerator = new SQLGenerator();
```

##  4. <a name='Wiki-3'></a>Wiki

Find mode complex queries examples on the project [wiki](https://github.com/manu-de-verdun/sql-json-generator/wiki)

##  5. <a name='Changelog-4'></a>Change log

[Change Log](https://github.com/manu-de-verdun/sql-json-generator/blob/master/CHANGELOG.md)

All notable changes to this project will be documented in this file.

##  6. <a name='API-5'></a>API

###  6.1. <a name='SELECT-6'></a>SELECT

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


###  6.2. <a name='INSERT-7'></a>INSERT

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

###  6.3. <a name='UPDATE-8'></a>UPDATE

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

###  6.4. <a name='DELETE-9'></a>DELETE

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




##  7. <a name='FormatingqueryData-10'></a>Formating queryData

###  7.1. <a name='SELECT-11'></a>SELECT

####  7.1.1. <a name='fromfieldsfieldquery-12'></a>$from, $fields, $field: basic SELECT FROM query

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

####  7.1.2. <a name='field-13'></a>$field

``$field : column_name``

> ``$field`` must be used within an object.

> table name is inherited from the parent table object ( $from, $inner ... )

####  7.1.3. <a name='as-14'></a>$as

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

####  7.1.4. <a name='dateFormat-15'></a>$dateFormat

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


####  7.1.5. <a name='avgcountminmaxsum-16'></a>$avg $count $min $max $sum

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
####  7.1.5. <a name='avgcountminmaxsum-16'></a>$avg $count $min $max $sum

``$count : 1``

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

####  7.1.6. <a name='upperlower-16'></a>$upper $lower

``$upper : 1``

*example:*
```
{
    $from : 'table1',
    $fields : [
        {
            $field: 'column_a',
            $upper : 1,
            $as: 'column_date'
        }
    ]
}
```
*will return:*
```
SELECT UPPER(`table1`.`column_a`) AS column_date FROM `table1`
```
####  7.1.7. <a name='groupconcat-16'></a>$groupConcat

``$groupConcat : 1``

*example:*
```
{
    $from : 'table1',
    $fields : [
        {
            $field: 'column_a',
            $groupConcat : 1,
            $as: 'column_date'
        }
    ]
}
```
*will return:*
```
SELECT GROUP_CONCAT(`table1`.`column_a`) AS column_date FROM `table1`
```

####  7.1.8. <a name='function-16'></a>$function

``$function : 'acos'``

*example:*
```
{
    $from : 'table1',
    $fields : [
        {
            $field: 'column_a',
            $function : 'acos'
        }
    ]
}
```
*will return:*
```
SELECT ACOS(`table1`.`column_a`) FROM `table1`
```


####  7.1.9. <a name='where-17'></a>$where


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


###  7.2. <a name='joinsinnerleftrightfull-18'></a>JOINS : $inner, $left, $right, $full


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
###  7.3. <a name='where-19'></a>$where

``$where: [{condition1}, {condition2}....]``


####  7.3.1. <a name='SimpleColumncomparison-20'></a>Simple Column comparison

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

####  7.3.2. <a name='logicalandandor-21'></a>Logical Operators: $and and $or

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


####  7.3.3. <a name='ComplexColumscomparison-22'></a>Complex Colums comparison

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


####  7.3.4. <a name='ComparisonOperators-23'></a>Comparison Operators

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

####  7.3.5. <a name='in-24'></a>$in

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



###  7.4. <a name='limit-25'></a>$limit

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


###  7.5. <a name='order-26'></a>$order

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

####  7.5.1. <a name='desc-27'></a>$desc

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


###  7.6 <a name='group-28'></a>$group

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


###  7.7 <a name='having-34'></a>$having

``$having: [ list of conditions ]``

`$having` is resolved using the same rules as `$where` conditions



###  7.8 <a name='$raw'></a>$raw

``$raw: string``

`$raw` argument is not interpreted and is put in the query without processing.


*example:*
```
{
    $having: [
        { 
            $raw: "`count` > 1"
        }
    ]
}
```
*will return:*
```
HAVING `count` > 1
```


##  8. <a name='mySQLFeatures-29'></a>mySQL Features

###  8.1. <a name='Escapingstrings-30'></a>Escaping strings

``var sqlGenerator = new SQLGenerator({escape: true});``

will escape the strings values.

###  8.2. <a name='sqlCalcFoundRows-31'></a>$sqlCalcFoundRows

``$sqlCalcFoundRows: true``

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

otherdb-01

##  9. <a name='otherdb-01'></a>Other Databases

> Using PostgreSQL syntax:

``var sqlGenerator = new SQLGenerator({pgSQL: true});``

_**LIMITED SUPORT, based on my basic pgSQL needs, feel free to report all issues**_

> Using prestoDB syntax:

``var sqlGenerator = new SQLGenerator({prestoDB: true});``

_**BASIC SUPORT, based on @martin-kieliszek contributions, feel free to report all issues**_


##  10. <a name='Debugging-32'></a>Debugging

> Display all generator steps in the console:

``var sqlGenerator = new SQLGenerator({debug: true});``

> Display generated SQL in the console:

``var sqlGenerator = new SQLGenerator({showSQL: true});``


##  11. <a name='Testing-33'></a>Testing

> Using Mocha & Chai, test most common and uncommon queries

``npm test``
