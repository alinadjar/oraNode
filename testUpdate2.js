

const oracledb = require('oracledb');

const dbConfig = {
    user: "RSVP_USER",
    password: "123456",
    connectString: '192.168.87.5:1521/tabarokora'
};

function run() {


    oracledb.getConnection(dbConfig).then(connection => {
        console.log(connection);

        const sql = "UPDATE OCCASION_SEAT SET OCSE09=:state, OCSE11=:conn WHERE OCSE01=:id";

        connection.execute(sql, {
            state: 1,
            conn: '888',
            id: 238
        }, { autoCommit: true })
            .then(r => console.log(r))
            .catch(err => console.log(err));

    }).catch(err => console.log(err));





}

run();