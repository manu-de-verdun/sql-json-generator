var colors = require('colors');
var sqlString = require('sqlstring');

var sqlJsonGenerator = function (options) {

    if (!options) {
        options = {};
    }

    var escaping = function ( data ) {
        if (typeof data === 'string' && options.escaped) {
            return sqlString.escape(data);
        }
        else {
            return "'" + data + "'";
        }
    }

    /**
     * Building SQL WHERE conditions
     * @param conditions
     * @param parentKey
     * @returns {string}
     */
    var whereBuilder = function (conditions, parentKey, inheritedTable) {

        var whereKeys = Object.keys(conditions);
        var whereArray = [];

        var conditionBuilder = function (column, table, operador, condition) {
            return ((table) ? "`" + table + "`." : "") + "`" + column + "` " + operador + " " +  escaping(condition) ;
        };

        var inBuilder = function (column, table, operador, condition) {
            return ((table) ? "`" + table + "`." : "") + "`" + column + "` " + operador + " " +  condition ;
        };

        if (options.debug) {
            console.log('');
            console.log('whereBuilder'.green);
            console.log('  conditions: ', conditions);
            console.log('  parentKey: ', parentKey);
            console.log('  inheritedTable: ', inheritedTable);
        }


        // if conditions is an array, split and call wherebuilder for each of the array element
        if (Array.isArray(conditions) && conditions.length > 0) {

            if (options.debug) {
                console.log('    splitting conditions'.cyan);
            }

            conditions.forEach(function (condition) {
                var whereExpression = whereBuilder(condition, parentKey, inheritedTable);
                if (whereExpression) {
                    whereArray.push(whereExpression);
                }
            });

            return whereArray.join(' AND ');
        }

        // if condition is not an object,then exit....
        if (typeof conditions != 'object') {

            if (options.debug) {
                console.log('    wrong condition format'.red);
            }

            return null;
        }


        // test if there is a logical operator
        if (conditions['$or'] || conditions['$and']) {

            var operator;
            var operatorSQL;

            if (conditions['$or']) {
                operator = '$or';
                operatorSQL = ' OR ';
            } else if (conditions['$and']) {
                operator = '$and';
                operatorSQL = ' AND ';
            }

            if (options.debug) {
                console.log(colors.cyan('    logical operator %s'), operator);
            }

            var andArray = [];

            conditions[operator].forEach(function (element) {
                andArray.push(whereBuilder(element, null, inheritedTable));
            });

            return ("(" + andArray.join(operatorSQL) + ")");

        }


        // test if there is a $field (complete field with comparison operators
        if (conditions['$field']) {

            if (options.debug) {
                console.log('    full field comparaison'.cyan);
            }

            var currentTable = (conditions['$table']) ? conditions['$table'] : inheritedTable;

            if (conditions["$gt"]) {
                return conditionBuilder(conditions['$field'], currentTable, '>', conditions["$gt"]);
            }

            else if (conditions["$gte"]) {
                return conditionBuilder(conditions['$field'], currentTable, '>=', conditions["$gte"]);
            }

            else if (conditions["$lt"]) {
                return conditionBuilder(conditions['$field'], currentTable, '<', conditions["$lt"]);
            }

            else if (conditions["$lte"]) {
                return conditionBuilder(conditions['$field'], currentTable, '<=', conditions["$lte"]);
            }

            else if (conditions["$eq"]) {
                return conditionBuilder(conditions['$field'], currentTable, '=', conditions["$eq"]);
            }

            else if (conditions["$ne"]) {
                return conditionBuilder(conditions['$field'], currentTable, '<>', conditions["$ne"]);
            }

            else if (conditions["$like"]) {
                return conditionBuilder(conditions['$field'], currentTable, 'LIKE', conditions["$like"]);
            }


            else if (conditions["$in"]) {

                if (options.debug) {
                    console.log('      $in'.cyan);
                }
                if (Array.isArray(conditions["$in"]) && conditions["$in"].length > 0) {
                    conditions["$in"].forEach ( function ( condition , idx ) {
                         conditions["$in"][idx] = escaping(condition);
                    });
                    var inCondition = "(" + conditions["$in"].join(",") + ")";
                    return inBuilder(conditions['$field'], currentTable, 'IN', inCondition);
                } else {
                    return null;
                }
            }

        }

        if (whereKeys.length == 1) {

            var result = conditionBuilder(whereKeys[0], inheritedTable, '=', conditions[whereKeys[0]]);

            if (options.debug) {
                console.log('    simple columns equality shortcut'.cyan);
                console.log(colors.yellow('      result: %s'), result);
            }

            return result;
        }


        return null;
    };


    /**
     * Building SELECT expression
     * @param conditions
     * @param parentKey
     */
    var joinBuilder = function (joinData, curentTable, inheritedTable) {

        if (options.debug) {
            console.log('');
            console.log('joinBuilder'.green);
            console.log('  curentTable: ', curentTable);
            console.log('  inheritedTable: ', inheritedTable);
            console.log('  joinData: ', joinData);
        }


        var sqlJoin = '';

        var joinKeys = Object.keys(joinData);

        if (joinKeys.indexOf('$inner') >= 0) {
            sqlJoin += 'INNER JOIN `' + joinData['$inner'] + '` ';
        } else if (joinKeys.indexOf('$left') >= 0) {
            sqlJoin += 'LEFT JOIN `' + joinData['$left'] + '` ';
        } else if (joinKeys.indexOf('$right') >= 0) {
            sqlJoin += 'RIGHT JOIN `' + joinData['$right'] + '` ';
        } else if (joinKeys.indexOf('$full') >= 0) {
            sqlJoin += 'FULL JOIN `' + joinData['$full'] + '` ';
        }

        // if there is  $using
        if ((joinKeys.indexOf('$using') >= 0)) {
            sqlJoin += 'USING(`' + joinData['$using'] + '`)';
            return sqlJoin;

        } else if ((joinKeys.indexOf('$on') >= 0)) {

            if (Array.isArray(joinData['$on'])) {
                var tempArray = [];

                joinData['$on'].forEach(function (item) {
                    if (item.$parent && item.$child) {
                        tempArray.push('`' + inheritedTable + '`.`' + item.$parent + '` = `' + curentTable + '`.`' + item.$child + '`');
                    }
                });

                sqlJoin += 'ON (' + tempArray.join(' AND ') + ' )';
            }
            else {
                if (!joinData['$on'].$parent && !joinData['$on'].$child) {
                    return null;
                }
                sqlJoin += 'ON `' + inheritedTable + '`.`' + joinData['$on'].$parent + '` = `' + curentTable + '`.`' + joinData['$on'].$child + '`';
            }
            return sqlJoin;
        } else {
            return null;
        }


    };

    var selectBuilder = function (conditions, inheritedTable) {

        if (options.debug) {
            console.log('');
            console.log('selectBuilder'.green);
            console.log('  conditions: ', conditions);
            console.log('  inheritedTable: ', inheritedTable);
        }

        var byGroupOrOrder = function ( conditions , selectObject, currentTable ) {

            var aliasesList = selectObject.aliases.map(function (x) {
                return x['$as'];
            });

            var resultArray = [];

            conditions.forEach(function (orderItem) {


                // test if the array element is an object ( column descriptor ) or a simple string ( an column alias )
                if (typeof orderItem === 'object') {
                    //if it is an object, must contain a $as or $field keys
                    if (orderItem['$field']) {
                        //it's a field
                        resultArray.push("`" + (orderItem['$table'] ? orderItem['$table'] : currentTable) + "`.`" + orderItem['$field'] + "`" + (orderItem['$desc'] ? ' DESC' : ''));
                    } else if (orderItem['$as']) {
                        var currentAliasIdx = aliasesList.indexOf(orderItem['$as']);
                        if (currentAliasIdx >= 0) {
                            // It's an alias
                            resultArray.push("`" + selectObject.aliases[currentAliasIdx]['$table'] + "`.`" + selectObject.aliases[currentAliasIdx]['$field'] + "`" + (orderItem['$desc'] ? ' DESC' : ''));
                        }
                    }
                } else {
                    // it is not an object. must be an alias or a top level table column name (will use $from table name)
                    var currentAliasIdx = aliasesList.indexOf(orderItem);
                    if (currentAliasIdx >= 0) {
                        // It's an alias
                        resultArray.push("`" + selectObject.aliases[currentAliasIdx]['$table'] + "`.`" + selectObject.aliases[currentAliasIdx]['$field'] + "`");
                    } else {
                        //It's a top level table column
                        resultArray.push("`" + currentTable + "`.`" + orderItem + "`");
                    }
                }

            });

            return resultArray;

        };

        var currentTable;
        var selectKeys = Object.keys(conditions);
        var selectObject = {
            select: [],
            from: [],
            aliases: [],
            groupBy: [],
            orderBy: []
        };

        // Tests the conditions object keys to see what action is required (from, join, etc...)
        if (selectKeys.indexOf('$from') >= 0) {
            currentTable = conditions['$from'];
            selectObject.from.push("FROM `" + currentTable + "`");
        }

        if (selectKeys.indexOf('$inner') >= 0) {
            currentTable = conditions['$inner'];
            selectObject.from.push(joinBuilder(conditions, currentTable, inheritedTable));
        } else if (selectKeys.indexOf('$left') >= 0) {
            currentTable = conditions['$left'];
            selectObject.from.push(joinBuilder(conditions, currentTable, inheritedTable));
        } else if (selectKeys.indexOf('$right') >= 0) {
            currentTable = conditions['$right'];
            selectObject.from.push(joinBuilder(conditions, currentTable, inheritedTable));
        } else if (selectKeys.indexOf('$full') >= 0) {
            currentTable = conditions['$full'];
            selectObject.from.push(joinBuilder(conditions, currentTable, inheritedTable));
        }

        // Process the $where object
        if (selectKeys.indexOf('$where') >= 0) {
            // only process the $where object if it is not empty
            if (Object.keys(conditions['$where']).length > 0) {
                var whereObject = whereBuilder(conditions['$where'], null, currentTable);
                if (whereObject) {
                    // only add the result of whereBuilder if it has returned a value
                    selectObject.where = whereObject;
                }
            }
        }


        // Process all provided elements of fields Array
        if (conditions['$fields'] && conditions['$fields'].length > 0) {

            conditions['$fields'].forEach(function (field) {

                // Test if array element is an object
                if (typeof field === 'object') {

                    // It's an object. Determine which kind of object

                    var fieldKeys = Object.keys(field);

                    // If it is a special operation that needs recursive call ( $inner, $left, $right )
                    if (fieldKeys.indexOf('$inner') >= 0 || fieldKeys.indexOf('$left') >= 0 || fieldKeys.indexOf('$right') >= 0 || fieldKeys.indexOf('$full') >= 0) {
                        var recursiveSelectObject = selectBuilder(field, currentTable);

                        //After recursive call, add itens from recursive call into the current object
                        recursiveSelectObject.select.forEach(function (item) {
                            selectObject.select.push(item);
                        });
                        recursiveSelectObject.from.forEach(function (item) {
                            selectObject.from.push(item);
                        });

                        // where is a string, and not an array. manualy concatenate
                        if (recursiveSelectObject.where) {
                            if (selectObject.where) {
                                selectObject.where += ' AND ' + recursiveSelectObject.where
                            } else {
                                selectObject.where = recursiveSelectObject.where
                            }
                        }

                        recursiveSelectObject.aliases.forEach(function (item) {
                            selectObject.aliases.push(item);
                        });
                    }
                    // It is a field object
                    else if (fieldKeys.indexOf('$field') >= 0) {

                        var currentField = {};

                        if (fieldKeys.indexOf('$table') >= 0) {
                            currentField.sql = "`" + field['$table'] + "`.`" + field['$field'] + "`";
                        }
                        else {
                            currentField.sql = "`" + currentTable + "`.`" + field['$field'] + "`";
                        }

                        if (fieldKeys.indexOf('$avg') >= 0) {
                            currentField.sql = "AVG(" + currentField.sql + ")";
                        }
                        else if (fieldKeys.indexOf('$count') >= 0) {
                            currentField.sql = "COUNT(" + currentField.sql + ")";
                        }
                        else if (fieldKeys.indexOf('$dateFormat') >= 0) {
                            currentField.sql = "DATE_FORMAT(" + currentField.sql + ",'" + field['$dateFormat'] + "')";
                        }
                        else if (fieldKeys.indexOf('$max') >= 0) {
                            currentField.sql = "MAX(" + currentField.sql + ")";
                        }
                        else if (fieldKeys.indexOf('$min') >= 0) {
                            currentField.sql = "MIN(" + currentField.sql + ")";
                        }
                        else if (fieldKeys.indexOf('$sum') >= 0) {
                            currentField.sql = "SUM(" + currentField.sql + ")";
                        }

                        if (fieldKeys.indexOf('$as') >= 0) {
                            currentField.as = field['$as'];
                            currentField.sql = (currentField.sql) + " AS " + currentField.as;
                            selectObject.aliases.push({
                                $table: currentTable,
                                $field: field['$field'],
                                $as: field['$as']
                            })
                        }

                        // add the columm to the select object
                        selectObject.select.push(currentField.sql);
                    }
                } else {
                    // raw field, add it to the select Object
                    selectObject.select.push("`" + currentTable + "`.`" + field + "`");
                }

            });

        }

        // Process the $limit object
        if (selectKeys.indexOf('$limit') >= 0) {
            if (conditions['$limit']['$offset'] >= 0 && conditions['$limit']['$rows'] >= 0) {
                selectObject.limit = ' LIMIT ' + conditions['$limit']['$offset'] + ',' + conditions['$limit']['$rows'];
            }
        }


        // Process the $groupBy object
        if (selectKeys.indexOf('$group') >= 0) {
            selectObject.groupBy = byGroupOrOrder(conditions['$group'] , selectObject, currentTable);
        }

        // Process the $orderBy object
        if (selectKeys.indexOf('$order') >= 0) {
            selectObject.orderBy = byGroupOrOrder(conditions['$order'] , selectObject, currentTable);
        }

        return selectObject
    };


    /**
     * Generate an UPDATE command based on params
     * @param queryParams
     * @returns {string} SQL Query
     */
    this.update = function (queryParams) {

        // test if required query params are provided
        if (!queryParams || !queryParams.$update || !queryParams.$set) return null;

        // UPDATE
        var sql = "UPDATE `" + queryParams.$update + "`";

        // SET
        var setKeys = Object.keys(queryParams.$set);
        var setArray = [];

        setKeys.forEach(function (key) {
            setArray.push("`" + key + "` = " + escaping(queryParams.$set[key]));
        });

        sql += " SET " + setArray.join(',');

        if (queryParams.$where) {
            sql += " WHERE " + whereBuilder(queryParams.$where, null);
        }

        if (options.debug || options.showSQL) {
            console.log(colors.cyan('%s'), sql);
        }

        return sql;

    };


    /**
     * Generate an INSERT command based on params
     * @param queryParams
     * @returns {string} SQL Query
     */
    this.insert = function (queryParams) {

        // test if required query params are provided
        if (!queryParams || !queryParams.$insert || !queryParams.$values) return null;

        // INSERT
        var sql = "INSERT INTO `" + queryParams.$insert + "`";

        // KEYS
        var setKeys = Object.keys(queryParams.$values);

        var keysArray = [];
        setKeys.forEach(function (key) {
            keysArray.push("`" + key + "`");
        });

        sql += " (" + keysArray.join(',') + ")";

        // Values

        var valuesArray = [];
        setKeys.forEach(function (key) {
            valuesArray.push(escaping(queryParams.$values[key]));
        });

        sql += " VALUES (" + valuesArray.join(',') + ")";

        if (options.debug || options.showSQL) {
            console.log(' ');
            console.log(colors.cyan('%s'), sql);
        }

        return sql;

    };


    /**
     * Generate an UPDATE command based on params
     * @param queryParams
     * @returns {string} SQL Query
     */
    this.delete = function (queryParams) {

        // test if required query params are provided
        if (!queryParams || !queryParams.$delete) return null;

        // DELETE
        var sql = "DELETE FROM `" + queryParams.$delete + "`";

        if (queryParams.$where) {
            sql += " WHERE " + whereBuilder(queryParams.$where, null);
        }

        if (options.debug || options.showSQL) {
            console.log(' ');
            console.log(colors.cyan('%s'), sql);
        }

        return sql;

    };


    /**
     * Generate an SELECT command based on params
     * @param queryParams
     * @returns {string} SQL Query
     */
    this.select = function (queryParams) {

        // test if required query params are provided
        if (!queryParams || !queryParams.$from) return null;

        var sql = "";
        var selectObject = selectBuilder(queryParams, null);

        if (selectObject.select.length == 0 || selectObject.from.length == 0) {
            return null;
        }

        sql += "SELECT"

        if (queryParams.$sqlCalcFoundRows && queryParams.$limit) {
            sql += " SQL_CALC_FOUND_ROWS";
        }

        if (selectObject.select.length > 0) {
            sql += " " + selectObject.select.join(', ');
        }

        if (selectObject.from.length > 0) {
            sql += " " + selectObject.from.join(' ');
        }

        if (selectObject.where) {
            sql += " WHERE " + selectObject.where;
        }

        if (selectObject.groupBy.length > 0) {
            sql += " GROUP BY " + selectObject.groupBy.join(' ,');
        }

        if (selectObject.orderBy.length > 0) {
            sql += " ORDER BY " + selectObject.orderBy.join(' ,');
        }

        if (selectObject.limit) {
            sql += selectObject.limit;
        }

        if (options.debug || options.showSQL) {
            console.log(' ');
            console.log(colors.cyan('%s'), sql);
        }

        return sql;

    };

};


module.exports = sqlJsonGenerator;
