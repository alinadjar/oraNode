

const oracledb = require('oracledb');

const dbConfig = {
    user: "RSVP_USER",
    password: "123456",
    connectString: '192.168.87.5:1521/tabarokora'
};

async function run() {
    let connection;

    try {
        connection = await oracledb.getConnection(dbConfig);


        //const query = "UPDATE OCCASION_SEAT  SET OCSE09=:kindReserveCode, OCSE11=:connID WHERE OCSE01=:seatID";
        const sql = "UPDATE OCCASION_SEAT SET OCSE09=:state, OCSE11=:conn WHERE OCSE01=:id";

        // const options = {
        //     autoCommit: true,
        //     bindDefs: {
        //         state: { type: oracledb.NUMBER },
        //         conn: { type: oracledb.STRING, maxSize: 36 },
        //         id: { type: oracledb.NUMBER }
        //     }
        // };

        // const options = {
        //     autoCommit: true
        // };

        // const binds = [];
        // binds.push({ state: 2, conn: '7777', id: 238 });



        const result = await connection.execute(sql, {
            state: 2,
            conn: '777',
            id: 238
        }, { autoCommit: true});

        console.log(result);
                 
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