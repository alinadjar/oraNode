const sworm = require('sworm');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;



const oracledb = require('oracledb');
const ConnectionString = {
    user: "RSVP_USER",
    password: "123456",
    connectString: '192.168.87.5:1521/tabarokora'
};


const occModel = require('./models/Occasion_model');
const V_OCCASION_TIME = require('./models/V_OCCASION_TIME');

app.get('/api/Main/GetAllActiveOccasions', (req, res) => {
    oracledb.getConnection(ConnectionString,
        function (err, connection) {
            if (err) {
                res.set('Content-Type', 'application/json');
                res.status(500).send(JSON.stringify({
                    status: 500,
                    message: "error connrcting to DB",
                    detailedMessage: err.message
                }));
            }

            connection.execute("select * from OCCASION ", {}, { outFormat: oracledb.OBJECT }, (err, result) => {
                if (err) {
                    res.set('Content-Type', 'application/json');
                    res.status(500).send(JSON.stringify({
                        status: 500,
                        message: "error connrcting to DB",
                        detailedMessage: err.message
                    }));
                }

                else {
                    res.set('Content-Type', 'application/json').status(200);
                    let output = [];
                    console.log(result);
                    result.rows.map(rec => {
                        let occasionModel = new occModel(rec);
                        console.log(occasionModel);
                        output.push(occasionModel);
                    });
                    //res.send(JSON.stringify(result.rows));
                    res.send(JSON.stringify(output));
                }
            });
        }
    );
});



app.get('/api/Main/GetOccasionInfo/:occID', (req, res) => {
    oracledb.getConnection(ConnectionString)
        .then(connection => {
            connection.execute('select * from V_OCCASION_TIME where OCASION_TIME = ' + req.params.occID)
                .then(result => {
                    let output = [];
                    result.rows.map(rec => {
                        let obj = new V_OCCASION_TIME(rec);
                        output.push(obj);
                    });
                    res.send(JSON.stringify(output));
                })
                .catch((err) => {
                    res.set('Content-Type', 'application/json');
                    res.status(500).send(JSON.stringify({
                        status: 500,
                        message: "error fetching data from DB",
                        detailedMessage: err.message
                    }));
                });
        })
        .catch((err) => { console.log(err); res.status(500).send('Error Connecting to DB'); });
});




app.get('/api/Main/GetSeats4OccasionTimeID/:OccasionTimeID', (req, res) => {

    let arr = [];
    let query = `BEGIN
                    -- Call the procedure
                    sp_show_occasion_seat(occasion_time_id => :p1
                    , result_ => :p2  );                    
                END;`;


    let query2 = `BEGIN
                    SP_SHOW_OCCASION_SEAT(:p1, :p2);                    
                  END;`;







    //console.log(query2);
    oracledb.getConnection(ConnectionString)
        .then(connection => {
            connection.execute("BEGIN SP_SHOW_OCCASION_SEAT(:p1, :p2); END;",
                {
                    p1: { val: 1, type: oracledb.NUMBER, dir: oracledb.BIND_IN },
                    p2: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT }
                }
                , { resultSet: true }
            ).then(result => {
                // let output = [];
                // result.rows.map(rec => {
                //     output.push(JSON.stringify(rec, null, 2));
                // });
                // res.send(JSON.stringify(output));

                console.log(result);
                const resultSet = result.outBinds.cursor;
                console.log(resultSet);

                // const numRows = 10;  // number of rows to return from each call to getRows()


                let rows;
                do {
                    resultSet.getRows(numRows) // get numRows rows at a time
                        .then(rows => {
                            if (rows.length > 0) {
                                console.log("getRows(): Got " + rows.length + " rows");
                                console.log(rows);
                            }
                        })

                } while (rows.length === numRows);


                //console.log(resultSet);
                //console.log(result.outBinds.cursor.metaData);
                //console.log(result.outBinds);
                //console.log(result.outBinds.cursor);
                //resultSet.getRows(numRows).then(rows => console.log(rows));
                //res.send(resultSet);
                res.send(result);
                //res.send(result.outBinds.result_);
            })
                .catch((err) => {
                    res.set('Content-Type', 'application/json');
                    res.status(500).send(JSON.stringify({
                        status: 500,
                        message: "error fetching data from DB",
                        detailedMessage: err.message
                    }));
                });
        })
        .catch((err) => { console.log(err); res.status(500).send('Error Connecting to DB'); });
});



// app.get('/test', (req, res) => {

//     const querySQL = `BEGIN SP_SHOW_OCCASION( ocasion_id => :ocasion_id, result_ => :result_ ); END;`;


//     oracledb.getConnection(ConnectionString)
//         .then(async (connection) => {
//                 try {
//                     let result = await connection.execute(querySQL, {
//                         ocasion_id: { val: 1, dir: oracledb.BIND_IN },
//                         result_: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT }
//                     });
//                     console.log(result);
//                     res.send(result);
//                 } catch(ex) {
//                     console.log('exception :) ---> '+ ex);
//                     res.status(500).send(ex.message);
//                 }
//         })
//         .catch(err => console.log(err));
// });











app.get('/test2', (req, res) => {

    //let db = sworm.db('oracle://RSVP_USER:123456@192.168.87.5:1521/tabarokora&maxRows=100000&pool=true');
    let db = sworm.db('oracle://RSVP_USER:123456@192.168.87.5:1521/tabarokora');

    db.query('select * from V_OCCASION_TIME where OCASION_TIME = @occID', { occID: 2 })
        .then(function (results) {
            console.log(results);
            res.send(results);
        }).catch(er => console.log(er));

});





app.get('/test6', async (req, res) => {

    const dbConfig = {
        user: "RSVP_USER",
        password: "123456",
        connectString: '192.168.87.5:1521/tabarokora'
    };

    const numRows = 10;  // number of rows to return from each call to getRows()

    try {
        connection = await oracledb.getConnection(dbConfig);

        const result = await connection.execute(
            `BEGIN SP_SHOW_OCCASION_SEAT(:id, :cursor); END;`,
            {
                id: 1,
                cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT }
            });

        console.log(result);
        console.log("Cursor metadata:");
        console.log(result.outBinds.cursor.metaData);


        //
        // Fetch rows from the REF CURSOR.
        //
        //
        // If getRows(numRows) returns:
        //   Zero rows               => there were no rows, or are no more rows to return
        //   Fewer than numRows rows => this was the last set of rows to get
        //   Exactly numRows rows    => there may be more rows to fetch

        let output = [];

        const resultSet = result.outBinds.cursor;
        let rows;
        do {
            rows = await resultSet.getRows(numRows); // get numRows rows at a time
            if (rows.length > 0) {
                console.log("getRows(): Got " + rows.length + " rows");
                console.log(rows);
                rows.map(row => output.push(row));
            }
        } while (rows.length === numRows);

        // always close the ResultSet
        await resultSet.close();

        res.send(output);

    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }

});


app.listen(PORT, () => { console.log(`Server started on port ${PORT}`); });
