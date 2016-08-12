# sql-json-generator

Generate SQL command from JSON object

## Install

Install with `npm install sql-json-generator`

## API


### update

`.update( queryData , callback )`

The first paramenter contains the data used to produce the SQL query
The callback returns two parameters, `error` and `result`

```
sqlParams = {
    update: 'mytable',
    set : {
        field_b: 1
    },
    where: {
        field_a: 1
    }
}

sqlGenerator.update( sqlParams , function ( err, result ) {

});
```

will return:

`err: null`
`result: UPDATE  \`mytable\`  SET \`field_b\` = '1' WHERE \`field_a\` = '1'`


## Formating queryData