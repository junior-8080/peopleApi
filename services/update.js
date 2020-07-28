const pool = require('./dbconnection')

function findUser(data) {
    let query = 'select user_name from  account where user_name=$1 and user_id not in (29)';
    let value = [data]
    return new Promise((resolve, reject) => {
        pool
            .connect()
            .then(client => {
                return client.query(query, value)
                    .then(res => {
                        if (res.rows) {
                            resolve(res.rows)
                        } else {
                            reject("failed")
                        }
                    })
                    .catch(err => {
                        client.release()
                        console.log(err)
                    })

            })
    })
}

function findNumber(data) {
    let query = 'select msisdn from  account where msisdn = $1 and user_id  not in (29)';
    let value = [data]
    return new Promise((resolve, reject) => {
        pool
            .connect()
            .then(client => {
                return client.query(query, value)
                    .then(res => {
                        if (res.rows) {
                            resolve(res.rows)
                        } else {
                            reject("failed")
                        }
                    })
                    .catch(err => {
                        client.release()
                        console.log(err)
                    })

            })
    })
}

function findEmail(data) {
    let query = 'select user_email from  account where user_email = $1 and user_id  not in (29)';
    let value = [data]
    return new Promise((resolve, reject) => {
        pool
            .connect()
            .then(client => {
                return client.query(query, value)
                    .then(res => {
                        if (res.rows) {
                            console.log(res.rows)
                            resolve(res.rows)
                        } else {
                            reject("failed")
                        }
                    })
                    .catch(err => {
                        client.release()
                        console.log(err)
                    })

            })
    })
}


module.exports = {
    findEmail,
    findNumber,
    findUser
}