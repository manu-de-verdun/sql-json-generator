var colors = require('colors');

var sqlJsonGenerator = function (options) {

    if (!options) {
        options = {};
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

        var conditionBuilder = function (column, table, operador, condition, delimiter) {
            return (( table ) ? "`" + table + "`." : "" ) + "`" + column + "` " + operador + " " + delimiter + condition + delimiter;
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

            if( conditions['$or'] ) {
                operator = '$or';
                operatorSQL = ' OR ';
            }
            else if( conditions['$and'] ) {
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

            var currentTable = ( conditions['$table'] ) ? conditions['$table'] : inheritedTable;

            if (conditions["$gt"]) {
                return conditionBuilder(conditions['$field'], currentTable, '>', conditions["$gt"], "'");
            }

            else if (conditions["$gte"]) {
                return conditionBuilder(conditions['$field'], currentTable, '>=', conditions["$gte"], "'");
            }

            else if (conditions["$lt"]) {
                return conditionBuilder(conditions['$field'], currentTable, '<', conditions["$lt"], "'");
            }

            else if (conditions["$lte"]) {
                return conditionBuilder(conditions['$field'], currentTable, '<=', conditions["$lte"], "'");
            }

            else if (conditions["$eq"]) {
                return conditionBuilder(conditions['$field'], currentTable, '=', conditions["$eq"], "'");
            }

            else  if (conditions["$ne"]) {
                return conditionBuilder(conditions['$field'], currentTable, '<>', conditions["$ne"], "'");
            }


            else  if (conditions["$in"]) {

                if (options.debug) {
                    console.log('      $in'.cyan);
                }
                if (Array.isArray(conditions["$in"]) && conditions["$in"].length > 0) {
                    var inCondition = "('" + conditions["$in"].join("','") + "')";
                    return conditionBuilder(conditions['$field'], currentTable, 'IN', inCondition, '');
                }
                else {
                    return null;
                }
            }

        }

        if (whereKeys.length == 1) {

            var result = conditionBuilder(whereKeys[0], inheritedTable, '=', conditions[whereKeys[0]], "'");

            if (options.debug) {
                console.log('    simple columns equality shortcut'.cyan);
                console.log(colors.yellow('      result: %s'), result);
            }

            return result;
        }


        return null;
    };


    /**
     * Building SQL WHERE conditions
     * @param conditions
     * @param parentKey
     * @returns {string}
     */
    var whereBuilder1 = function (conditions, parentKey, inheritedTable) {

        var whereKeys = Object.keys(conditions);
        var whereArray = [];
        var whereExpression = "";

        var conditionBuilder = function (column, table, operador, condition, delimiter) {
            whereArray.push((( table ) ? "`" + table + "`." : "" ) + "`" + column + "` " + operador + " " + delimiter + condition + delimiter);
        };

        if (options.debug) {
            console.log('');
            console.log('whereBuilder'.green);
            console.log('  conditions: ', conditions);
            console.log('  parentKey: ', parentKey);
            console.log('  inheritedTable: ', inheritedTable);
        }


        if (Array.isArray(conditions[key]) && conditions[key].length > 0) {
            var inCondition = "('" + conditions[key].join("','") + "')";
            conditionBuilder(parentKey, inheritedTable, 'IN', inCondition, '');
        }


        whereKeys.forEach(function (key) {

            // Logical AND
            if (key === "$and") {

                var andArray = [];

                conditions[key].forEach(function (element) {
                    andArray.push(whereBuilder(element, null, inheritedTable));
                });

                whereArray.push("(" + andArray.join(' AND ') + ")");

            }

            //Logical OR
            else if (key === "$or") {

                var andArray = [];

                conditions[key].forEach(function (element) {
                    andArray.push(whereBuilder(element, null, inheritedTable));
                });

                whereArray.push("(" + andArray.join(' OR ') + ")");
            }

            else if (key === "$in") {
                if (Array.isArray(conditions[key]) && conditions[key].length > 0) {
                    var inCondition = "('" + conditions[key].join("','") + "')";
                    conditionBuilder(parentKey, inheritedTable, 'IN', inCondition, '');
                }
            }


            // Nested Object (not part of a logical operation)
            else if (typeof conditions[key] === 'object') {
                whereArray.push(whereBuilder(conditions[key], key, inheritedTable));
            }

            // Comparaison Operators
            else {


                switch (key) {

                    case "$gt" :
                        conditionBuilder(parentKey, inheritedTable, '>', conditions[key], "'");
                        break;

                    case "$gte" :
                        conditionBuilder(parentKey, inheritedTable, '>=', conditions[key], "'");
                        break;

                    case "$lt" :
                        conditionBuilder(parentKey, inheritedTable, '<', conditions[key], "'");
                        break;

                    case "$lte" :
                        conditionBuilder(parentKey, inheritedTable, '<=', conditions[key], "'");
                        break;

                    case "$eq" :
                        conditionBuilder(parentKey, inheritedTable, '=', conditions[key], "'");
                        break;

                    case "$ne" :
                        conditionBuilder(parentKey, inheritedTable, '<>', conditions[key], "'");
                        break;

                    default:
                        conditionBuilder(key, inheritedTable, '=', conditions[key], "'");

                }

            }

        });

        whereExpression += whereArray.join(' AND ');

        return whereExpression;
    };


    /**
     * Building SELECT expression
     * @param conditions
     * @param parentKey
     */
    var joinBuilder = function (joinData) {

        if (options.debug) {
            console.log('');
            console.log('joinBuilder'.green);
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

        if (joinKeys.indexOf('$using') >= 0) {
            sqlJoin += 'USING(`' + joinData['$using'] + '`)';
        }

        return sqlJoin;

    };

    var selectBuilder = function (conditions) {

        if (options.debug) {
            console.log('');
            console.log('selectBuilder'.green);
            console.log('  conditions: ', conditions);
        }

        var currentTable;
        var selectKeys = Object.keys(conditions);
        var selectObject = {
            select: [],
            from: [],
            aliases: [],
            orderBy: []
        };

        // Tests the conditions object keys to see what action is required (from, join, etc...)
        if (selectKeys.indexOf('$from') >= 0) {
            currentTable = conditions['$from'];
            selectObject.from.push("FROM `" + currentTable + "`");
        }

        if (selectKeys.indexOf('$inner') >= 0) {
            currentTable = conditions['$inner'];
            selectObject.from.push(joinBuilder(conditions));
        } else if (selectKeys.indexOf('$left') >= 0) {
            currentTable = conditions['$left'];
            selectObject.from.push(joinBuilder(conditions));
        } else if (selectKeys.indexOf('$right') >= 0) {
            currentTable = conditions['$right'];
            selectObject.from.push(joinBuilder(conditions));
        } else if (selectKeys.indexOf('$full') >= 0) {
            currentTable = conditions['$full'];
            selectObject.from.push(joinBuilder(conditions));
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
        conditions['$fields'].forEach(function (field) {

            // Test if array element is an object
            if (typeof field === 'object') {

                // It's an object. Determine which kind of object

                var fieldKeys = Object.keys(field);

                // If it is a special operation that needs recursive call ( $inner, $left, $right )
                if (fieldKeys.indexOf('$inner') >= 0 || fieldKeys.indexOf('$left') >= 0 || fieldKeys.indexOf('$right') >= 0 || fieldKeys.indexOf('$full') >= 0) {
                    var recursiveSelectObject = selectBuilder(field);

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

                    currentField.sql = "`" + currentTable + "`.`" + field['$field'] + "`";

                    if (fieldKeys.indexOf('$dateFormat') >= 0) {
                        currentField.sql = "DATE_FORMAT(" + currentField.sql + ",'" + field['$dateFormat'] + "')";
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


        // Process the $limit object
        if (selectKeys.indexOf('$limit') >= 0) {
            if (conditions['$limit']['$offset'] >= 0 && conditions['$limit']['$rows'] >= 0) {
                selectObject.limit = ' LIMIT ' + conditions['$limit']['$offset'] + ',' + conditions['$limit']['$rows'];
            }
        }


        // Process the $orderBy object
        if (selectKeys.indexOf('$order') >= 0) {

            var aliasesList = selectObject.aliases.map(function (x) {
                return x['$as'];
            });

            conditions['$order'].forEach(function (orderItem) {

                // test if the array element is an object ( column descriptor ) or a simple string ( an column alias )
                if (typeof orderItem === 'object') {
                    //if it is an object, must contain a $as or $field keys
                    if (orderItem['$field']) {
                        //it's a field
                        selectObject.orderBy.push("`" + ( orderItem['$table'] ? orderItem['$table'] : currentTable) + "`.`" + orderItem['$field'] + "`" + ( orderItem['$desc'] ? ' DESC' : ''));
                    } else if (orderItem['$as']) {
                        var currentAliasIdx = aliasesList.indexOf(orderItem['$as']);
                        if (currentAliasIdx >= 0) {
                            // It's an alias
                            selectObject.orderBy.push("`" + selectObject.aliases[currentAliasIdx]['$table'] + "`.`" + selectObject.aliases[currentAliasIdx]['$field'] + "`" + ( orderItem['$desc'] ? ' DESC' : '' ));
                        }
                    }
                } else {
                    // it is not an object. must be an alias or a top level table column name (will use $from table name)
                    var currentAliasIdx = aliasesList.indexOf(orderItem);
                    if (currentAliasIdx >= 0) {
                        // It's an alias
                        selectObject.orderBy.push("`" + selectObject.aliases[currentAliasIdx]['$table'] + "`.`" + selectObject.aliases[currentAliasIdx]['$field'] + "`");
                    } else {
                        //It's a top level table column
                        selectObject.orderBy.push("`" + currentTable + "`.`" + orderItem + "`");
                    }
                }

            });

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
            setArray.push("`" + key + "` = '" + queryParams.$set[key] + "'");
        });

        sql += " SET " + setArray.join(',');

        if (queryParams.$where) {
            sql += " WHERE " + whereBuilder(queryParams.$where, null);
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
            valuesArray.push("'" + queryParams.$values[key] + "'");
        });

        sql += " VALUES (" + valuesArray.join(',') + ")";

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
        var selectObject = selectBuilder(queryParams);

        sql += "SELECT " + selectObject.select.join(', ');
        sql += " " + selectObject.from.join(' ');

        if (selectObject.where) {
            sql += " WHERE " + selectObject.where;
        }

        if (selectObject.orderBy.length > 0) {
            sql += " ORDER BY " + selectObject.orderBy.join(' ,');
        }

        if (selectObject.limit) {
            sql += selectObject.limit;
        }

        return sql;

    };

};


module.exports = sqlJsonGenerator;
