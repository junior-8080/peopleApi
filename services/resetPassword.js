const pool = require('./dbconnection');

function saveReset(data) {
    let query = `insert into resetpassword (email,secretstring) values($1,$2) returning reset_id`;
    let values = [data.email, data.secretString];

    return new Promise((resolve, reject) => {

        pool.
        connect()
            .then(client => {
                console.log(client)
                client.query(query, values)
                    .then(result => {
                        if (result.rows) {
                            resolve(result.rows);
                        } else {
                            reject('failed');
                        }
                    })
            })
            .catch(err => console.log(err))
    })
}

module.exports = saveReset;