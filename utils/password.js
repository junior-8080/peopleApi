const bcrypt = require('bcrypt');
const saltRound =  10;
// const plainText = process.env.PASSWORD_TEXT

function hashPassword(data) {
    return new Promise((resolve,reject) =>{
        bcrypt.hash(data,saltRound)
        .then(result => {
            if(result){
                resolve(result)
            }
            else{
                reject('Failed')
            }
        })
    })  
}

function comparePassword(password,hash) {
    return new Promise((resolve,reject)=>{
        bcrypt.compare(password,hash)
            .then(result=>{
                if(result){
                    
                   resolve(result)
                }
                else{
                    console.log('hi')
                    reject({name:"error password"})
                }
            })
            // .catch(err => console.log(err))
    })
}


module.exports = {
    hashPassword,
    comparePassword
}