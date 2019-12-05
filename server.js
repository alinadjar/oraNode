const _ = require('lodash');
const uuidv1 = require('uuid/v1');
const bodyParser = require('body-parser');
const moment = require('jalali-moment');
const { GeneratePursuitCode } = require('./helper/PersuitCodeGenerator');
const { getSeatClass } = require('./models/Kind_Seatreserve');
const Kind_SeatReserve = require('./models/Kind_Seatreserve');
const ReserveDto = require('./models/ReserveDto');
const sworm = require('sworm');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;




// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())



const oracledb = require('oracledb');


const dbConfig = {
    user: "RSVP_USER",
    password: "123456",
    connectString: '192.168.87.5:1521/tabarokora'
};



const occModel = require('./models/Occasion_model');
const V_OCCASION_TIME = require('./models/V_OCCASION_TIME');
const PriceRangesByZone = require('./models/PriceRangesByZone');
const SeatDetail = require('./models/SeatDetail');
const OccasionSeat_ViewModel = require('./models/OccasionSeat_ViewModel');



app.get('/api/Main/GetAllActiveOccasions', (req, res) => {
    oracledb.getConnection(dbConfig,
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
    oracledb.getConnection(dbConfig)
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




app.get('/api/Main/GetSeats4OccasionTimeID/:OccasionTimeID', async (req, res) => {

    let connection;
    const occTimeID = req.params.OccasionTimeID;

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


        const numRows = 10;  // number of rows to return from each call to getRows()

        let output = [];
        const resultSet = result.outBinds.cursor;
        let rows, ListSeatDetails = [], ListPriceRange = [];
        do {
            rows = await resultSet.getRows(numRows); // get numRows rows at a time
            if (rows.length > 0) {
                //console.log("getRows(): Got " + rows.length + " rows");
                //console.log(rows);
                rows.forEach(row => {
                    let record = {
                        OCCASION_SEAT_ID: parseInt(row[0]),
                        OCCASION_TIME_ID: parseInt(occTimeID),
                        SALON_NAME: _.toString(row[2]),
                        ZONE_NAME: _.toString(row[4]),
                        RADIF_SHO: parseInt(row[5]),
                        SEAT_SHO: parseInt(row[6]),
                        NERKH: parseInt(row[7]),
                        SEAT_ACTIVE_NAME: _.toString(row[9]),
                        SEAT_STATUS_NAME: _.toString(row[8]) === '0' ? _.toString(row[11]) : "غير قابل خريد",
                        SEAT_STATUS_CODE: _.toString(row[8]) === '0' ? _.toString(row[11]) : Kind_SeatReserve.NonPurchasable,
                        SEAT_STATUS_CLASS: getSeatClass(this.SEAT_STATUS_CODE)
                    };

                    ListSeatDetails.push(new SeatDetail(record));



                });
            }
        } while (rows.length === numRows);


        const groupedByZone = _.groupBy(ListSeatDetails, 'ZONE_NAME');
        console.log('---------------------------------- groupedByZone:');
        //console.log(groupedByZone);

        const uniqZoneNames = _.uniqBy(_.map(ListSeatDetails, i => i.ZONE_NAME));
        console.log('UNIQUE Zone Names ===> ' + uniqZoneNames);

        console.log(uniqZoneNames[0] + ' has ' + groupedByZone[uniqZoneNames[0]].length + 'records');

        //console.log('---------------------------- price Range:');
        //console.log(_.uniqBy(_.map(groupedByZone[uniqZoneNames[0]], j => j.NERKH)));
        uniqZoneNames.forEach(ZONE_NAME => {
            ListPriceRange.push(new PriceRangesByZone({
                zoneName: ZONE_NAME,
                priceRange: _.uniqBy(_.map(groupedByZone[ZONE_NAME], j => j.NERKH))
            }));
        });

        output.push(new OccasionSeat_ViewModel(ListSeatDetails, ListPriceRange));

        // always close the ResultSet
        await resultSet.close();
        res.send(output);

    } catch (err) {

        res.set('Content-Type', 'application/json');
        res.status(500).send(JSON.stringify({
            status: 500,
            message: "error fetching data from DB",
            detailedMessage: err.message

        }));
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
                res.status(500).send(err);
            }
        }
    }
});


// @URI: POST => /PostReserveHeader
// @desc: Registering reservation info
app.post('/api/Main/PostReserveHeader', async (req, res) => {

    let connection;


    try {
        // validate(req.body);


        let reserveDto = new ReserveDto(req.body.reservation, req.body.OccasionSeatIDs);

        console.log('your input: ---------------');
        console.log(reserveDto);

        // new GUID
        const Seq = uuidv1().replace('-', '').replace('/', '');
        console.log("GUID = " + Seq);


        connection = await oracledb.getConnection(dbConfig);


        const sql = "INSERT INTO TMP_RESERVATION values (:SEQ, :OCCASION_SEAT_ID)";




        // const binds = [
        //     { SEQ: Seq, OCCASION_SEAT_ID: 747 }
        // ];

        const binds = [];
        reserveDto.OccasionSeatIDs.map(seatID => {
            binds.push({ SEQ: Seq, OCCASION_SEAT_ID: seatID });
        });

        // bindDefs is optional for IN binds but it is generally recommended.
        // Without it the data must be scanned to find sizes and types.
        const options = {
            autoCommit: true,
            bindDefs: {
                SEQ: { type: oracledb.STRING, maxSize: 32 },
                OCCASION_SEAT_ID: { type: oracledb.NUMBER }
            }
        };


        //const result = await connection.executeMany(sql, binds, options);
        //console.log("Result is:", result);


        const query = `BEGIN SP_CREATE_RESERVATION(
            :OCCASION_TIME_ID,
            :RESERVE_CODE,
            :RESERVE_DATE,
            :RESERVE_TIME,
            :FAMILY_NAME,
            :MELICODE,
            :MOBILE,
            :ADDRESS,
            :PAY_MAB,
            :PAY_CODE,
            :SEQ_,
            :ERROR_,
            :Result_
        ) END;`;


        //const headerObj = {};
        //const reservationHeader_Dto = new ReservationHeader_Dto(headerObj);


        const pursuitCode = GeneratePursuitCode();
        // const currentDate = moment().format('l');    // 12/5/2019
        // const currentDate = moment().format('L');    // 12/05/2019
        // const currentTime = moment().format('LTS');  // 10:37:02 AM


        const m = moment();
        m.locale('fa');
        // m.format('YY-MM-DD'); // it would be in jalali system
        // m.locale('fa').format('YYYY/MM/DD'); // 1367/11/04   --> equivalent to the following:
        // m.format('jYYYY/jMM/jDD'); // 1367/11/04

        console.log(_.toString(m.format('jYYYY/jMM/jDD')));
        console.log(_.toString(m.format('LTS')));

        // const resultSP = await connection.execute(query,
        //     {
        //         OCCASION_TIME_ID: { val: reserveDto.reservation.OccasionTimeID, type: oracledb.NUMBER, dir: oracledb.BIND_IN },
        //         RESERVE_CODE: { val: pursuitCode, type: oracledb.STRING, dir: oracledb.BIND_IN },
        //         RESERVE_DATE: { val: _.toString(m.format('jYYYY/jMM/jDD')), type: oracledb.STRING, dir: oracledb.BIND_IN },
        //         RESERVE_TIME: { val: _.toString(m.format('LTS')), type: oracledb.STRING, dir: oracledb.BIND_IN },
        //         FAMILY_NAME: { val: reserveDto.reservation.NameFamily, type: oracledb.STRING, dir: oracledb.BIND_IN },
        //         MELICODE: { val: reserveDto.reservation.NationalCode, type: oracledb.STRING, dir: oracledb.BIND_IN },
        //         MOBILE: { val: reserveDto.reservation.MobileNumber, type: oracledb.STRING, dir: oracledb.BIND_IN },
        //         ADDRESS: { val: reserveDto.reservation.Address, type: oracledb.STRING, dir: oracledb.BIND_IN },
        //         PAY_MAB: { val: reserveDto.reservation.SumPrice, type: oracledb.NUMBER, dir: oracledb.BIND_IN },
        //         PAY_CODE: { val: '0', type: oracledb.STRING, dir: oracledb.BIND_IN },
        //         SEQ_: { val: Seq, type: oracledb.STRING, dir: oracledb.BIND_IN },
        //         ERROR_: { type: oracledb.STRING, dir: oracledb.BIND_OUT },
        //         Result: { type: oracledb.STRING, dir: oracledb.BIND_OUT },
        //     });



        //console.log(resultSP);



        // if (_.toString(resultSP.value) === '-1') {
        //     res.status(500).send('Transaction Failed, Please try again');
        // }


        // Send SMS


        res.send({
            message: 'Transaction successful',
            pursuitNumber: pursuitCode
        });

    } catch (err) {

        res.set('Content-Type', 'application/json');
        res.status(500).send(JSON.stringify({
            status: 500,
            message: "error fetching data from DB",
            detailedMessage: err.message
        }));
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
                res.status(500).send(err);
            }
        }
    }

});



// app.get('/test', (req, res) => {

//     const querySQL = `BEGIN SP_SHOW_OCCASION( ocasion_id => :ocasion_id, result_ => :result_ ); END;`;


//     oracledb.getConnection(dbConfig)
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




// Insert Example:

// connection = await oracledb.getConnection(dbConfig);


// const sql = "INSERT INTO ANDROID_USER values (:fullName, :userName, :password, :enable)";



// const binds = [
//     { fullName: 'xxx', userName: 52, password: 'fghf', enable: '1' },
//     { fullName: 'yyy', userName: 53,password: '5572', enable:'0' }
// ];

// // bindDefs is optional for IN binds but it is generally recommended.
// // Without it the data must be scanned to find sizes and types.
// const options = {
//     autoCommit: true,
//     bindDefs: {
//         fullName: { type: oracledb.STRING , maxSize: 10},
//         userName: { type: oracledb.NUMBER },
//         password: { type: oracledb.STRING , maxSize: 10},
//         enable: { type: oracledb.STRING, maxSize: 1 }
//     }
// };











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
