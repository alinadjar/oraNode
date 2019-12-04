const oracledb = require('oracledb');
const dbConfig = {
    user: "RSVP_USER",
    password: "123456",
    connectString: '192.168.87.5:1521/tabarokora'
};
//const demoSetup = require('./demosetup.js');

const numRows = 10;  // number of rows to return from each call to getRows()

async function run() {

    let connection;

    try {
        connection = await oracledb.getConnection(dbConfig);

        //await demoSetup.setupBf(connection);  // create the demo table

        //
        // Create a PL/SQL procedure
        //

        //     await connection.execute(
        //         `CREATE OR REPLACE PROCEDURE no_get_rs (p_id IN NUMBER, p_recordset OUT SYS_REFCURSOR)
        //    AS
        //    BEGIN
        //      OPEN p_recordset FOR
        //        SELECT farmer, weight, ripeness
        //        FROM   no_banana_farmer
        //        WHERE  id < p_id;
        //    END;`
        //     );

        //
        // Get a REF CURSOR result set
        //

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

        const resultSet = result.outBinds.cursor;
        let rows;
        do {
            rows = await resultSet.getRows(numRows); // get numRows rows at a time
            if (rows.length > 0) {
                console.log("getRows(): Got " + rows.length + " rows");
                console.log(rows);
            }
        } while (rows.length === numRows);

        // always close the ResultSet
        await resultSet.close();

    } catch (err) {
        console.error(err);
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
}

run();