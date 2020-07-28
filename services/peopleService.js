const pool = require('./dbconnection')

function getAllPerson(data) {
    return new Promise((resolve, reject) => {
        let query = ' select account_person.account_id,person.* from account_person inner join person on account_person.person_id = person.person_id where account_person.account_id = $1 '
        let values = [data]
        pool.connect()
            .then(client => {
                return client.query(query,values)
                    .then(res => {
                        client.release()
                        if (res.rows) {
                            resolve(res.rows)
                        } else {
                            reject('Error occured')
                        }
                    })
                    .catch(err => {
                        client.release()
                        console.log(err)
                    })
            })
    })
}


function getPerson(data) {
    console.log(data)
    let query = 'select person.* from account_person inner join person on account_person.person_id = person.person_id where account_person.account_id = $2 and person.person_id = $1';
    let values = [data.person_id,data.account_id]
    return new Promise((resolve, reject) => {
        pool
            .connect()
            .then(client => {
                client.query(query, values)
                    .then(res => {
                        if (res.rows) {
                            client.release()
                            resolve(res.rows[0])
                        } else {
                            client.release()
                            resolve('failed')
                        }
                    })
            })

    })

}

function addPerson(data) {
    let query = `insert into person (person_name,phonenumber,gender,
        person_location,email,twitter_acc,ig_acc,description) values($1,$2,$3,$4,$5,$6,$7,$8)
     returning *`;
    let values = [data.name, data.number, data.gender, data.location, data.email, data.twitter, data.instagram,
        data.description
    ];
    return new Promise((resolve, reject) => {
        pool
            .connect()
            .then(client => {
                client.query(query, values)
                    .then(res => {
                        if (res.rows) {
                            client.release()
                            // console.log(res)
                            resolve(res.rows[0])
                        } else {
                            client.release()
                            resolve('failed')
                        }
                    })
            })

    })
}
function addToAccountPerson(data){
    let query = `insert into account_person(account_id,person_id) values($1,$2)
     returning *`;
    let values = [data.account_id,data.person_id];
    return new Promise((resolve, reject) => {
        pool
            .connect()
            .then(client => {
                client.query(query, values)
                    .then(res => {
                        if (res.rows) {
                            client.release()
                            // console.log(res)
                            resolve(res.rows)
                        } else {
                            client.release()
                            resolve('failed')
                        }
                    })
            })

    })
}

function updatePerson(data) {
    let query = `update person set person_name=$2,phonenumber=$3,gender=$4,
                 person_location=$5,email=$6,twitter_acc=$7,ig_acc=$8,description=$9,
                 updated=now() where person_id = $1 RETURNING person_name,phonenumber,gender,person_location,
                 email,twitter_acc,ig_acc,description`;
    let values = [data.id, data.name, data.number, data.gender, data.location, data.email, data.twitter, data.ig,
        data.description
    ]
    return new Promise((resolve, reject) => {
        pool
            .connect()
            .then(client => {
                client.query(query, values)
                    .then(res => {
                        if (res.rows) {
                            console.log(res)
                            client.release()
                            resolve(res.rows[0])
                        } else {
                            client.release()
                            reject('failed')
                        }
                    })
            })

    })

}



function deletePerson(data) {
    let query = `delete from person where person_id=$1`;
    let values = [data.id]
    return new Promise((resolve, reject) => {
        pool
            .connect()
            .then(client => {
                client.query(query, values)
                    .then(res => {
                        if (res.rows) {
                            client.release()
                            resolve(res.rows)
                        } else {
                            client.release()
                            resolve('failed')
                        }
                    })
            })
            .catch(err => console.log(err))

    })

}




module.exports = {
    getAllPerson,
    getPerson,
    addPerson,
    addToAccountPerson,
    updatePerson,
    deletePerson
}