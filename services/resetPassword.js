const pool = require('./dbconnection');

function saveReset(data) {
    let query = `insert into resetpassword (email,secretstring) values($1,$2) returning reset_id`;
    let values = [data.email, data.secret];

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
            .catch(err => {
                console.log(err)
            })
    })
}


function fetchSecretString(data) {
    let query = 'select * from  resetpassword where secretstring = $1';
    let value = [data]
    return new Promise((resolve, reject) => {
        pool
            .connect()
            .then(client => {
                return client.query(query, value)
                    .then(res => {
                        if (res.rows) {
                            resolve(res.rows[0])
                        } else {
                            reject("failed")
                        }
                    })
                    .catch(err => {
                        client.release()
                        console.log(err)
                    })

            })
            .catch(err => console.log(err));
    })
}



module.exports = {
    saveReset,
    fetchSecretString
}