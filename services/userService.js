const pool = require('./dbconnection')

function signup(data) {
    let query = 'insert into account(user_name,user_email,user_password,msisdn) values($1,$2,$3,$4)';
    let values = [data.username, data.useremail, data.password, data.msisdn]
    return new Promise((resolve, reject) => {
        pool
            .connect()
            .then(client => {
                client.query(query, values)
                    .then(res => {
                        if (res) {
                            client.release()
                            resolve(res)
                        } else {
                            reject('Failed')
                        }
                    })
                    .catch(err => {
                        client.release()
                        console.log(err)
                    })

            })

    })

}

function sigin(data) {
    //check email and unhash password and compare for verification if exit
    //if yes:
    // provide a user with session or token
    // else:
    // send and error message
    // email or password not valid 
    // Redirect user to login.
}

function findUser(data) {
    let query = 'select user_name from  account where user_name = $1';
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
    let query = 'select msisdn from  account where msisdn = $1';
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
    let query = 'select user_email from  account where user_email = $1';
    let value = [data]
    return new Promise((resolve, reject) => {
        pool
            .connect()
            .then(client => {
                return client.query(query, value)
                    .then(res => {
                        console.log(res.rows)
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

function findPassword(data) {
    let query = 'select user_password from  account where user_password = $1';
    let value = [data]
    return new Promise((resolve, reject) => {
        pool
            .connect()
            .then(client => {
                return client.query(query, value)
                    .then(res => {
                        if (res.rows) {
                            // console.log(res.rows)
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

function fetchUser(data) {
    let query = 'select * from  account where user_email = $1';
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
    })
}

function updateProfile(data){
    let query = 'update account set user_name=$1,user_email=$2,msisdn=$3,updated=now() where user_id = 29'
    let value = [data.username,data.useremail,data.msisdn]
    return new Promise((resolve,reject)=>{
        pool   
            .connect()
            .then(client =>{
                    client.query(query,value)
                        .then(res =>{
                            if(res.rows){
                                // console.log('service')
                                // console.log(res)
                                resolve(res.rows[0])
                            }
                            else{
                                reject('failed')
                            }
                        })
                        .catch(err=> console.log(err))
            })
    })
}


module.exports = {
    signup,
    sigin,
    findUser,
    findNumber,
    findEmail,
    findPassword,
    fetchUser,
    updateProfile
}