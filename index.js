module.exports = {

    update : function (data , callback) {

        // UPDATE
        var sql = "UPDATE `" + data.update + "`";

        // SET
        var setKeys = Object.keys(data.set);
        var setArray = [];

        setKeys.forEach( function (key) {
            setArray.push("`" + key + "` = '" + data.set[key] + "'");
        });

        sql +=  " SET " +  setArray.toString(',');

        // WHERE
        var whereKeys = Object.keys(data.where);
        var whereArray = [];

        whereKeys.forEach( function (key) {
            whereArray.push("`" + key + "` = '" + data.where[key] + "'");
        });


        sql +=  " WHERE " +  whereArray.toString(' AND ');

        console.log(sql);

        callback( null , sql );
    }

};
