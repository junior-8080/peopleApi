const peopleService = require('../services/peopleService');
const jwt = require('jsonwebtoken');


function verifyToken(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, 'secretKey', (err, decoded) => {
      if (err) {
        reject(err)
      } else {
        console.log('hi',decoded)
        resolve(decoded)
      }
    })
  })
}

function getAllPeople(req, res) {
  console.log('//',req.cookies)
  if (req.cookies.token) {
    let token = req.cookies.token;
    // console.log(token)
    verifyToken(token)
      .then(data => {
        console.log(data)
        peopleService.getAllPerson(data.payload.userId)
          .then(result => {
            console.log(result)
            let response = {
              username: data.payload.username,
              data: result.reverse()
            }
            return res.json(response)
          })
          .catch(err => console.log(err))
      })
      .catch(err => {
        if (err.message === 'jwt expired') {
          return res.status(422).json({
          errors: [{msg:"token expired"}]
          })
        }
      })
  } else {
    res.status(422).json({
      msg: "token expired"
    })
  }
}


function getPerson(req, res) {
  let data = {
    person_id: parseInt(req.params.id)
  };
  if (req.cookies.token) {
    let token = req.cookies.token;
    verifyToken(token)
      .then(result => {
        console.log(result)
        data.account_id = result.payload.userId;
        peopleService.getPerson(data)
          .then(result => {
            
            console.log(result)
            return res.json(result);
          })
          .catch(err => console.log(err))
      })
      .catch(err => {
        if (err.message === 'jwt expired') {
          return res.json({
            Error: "Token expired"
          })
        }
      })
  } else {
    res.json({
      Error: "Error occured"
    })
  }

}

function addPerson(req, res) {
  let data = req.body;
  console.log(data);
  if (req.cookies.token) {
    let token = req.cookies.token;
    verifyToken(token)
      .then(decoded => {
        peopleService.addPerson(data)
          .then(result => {
            let data = {
              account_id: decoded.payload.userId,
              person_id: result.person_id
            }
            peopleService.addToAccountPerson(data)
              .then(result => {
                if (result !== 'failed') {
                  return res.json({
                    message: "user sucessfully added"
                  })
                }
              })
              .catch(err => console.log(err))
          })
          .catch(err => {
            if (err.message === 'jwt expired') {
              return res.json({
                Error: "Token expired"
              })
            }
          })
      })
  } else {
    res.json({
      Error: "Error occured"
    })
  }

}
// update person.
function updatePerson(req, res) {
  let data = req.body;
  console.log(data)
  peopleService.updatePerson(data)
    .then(result => {
      if (result !== 'failed') {
        return res.json({
          message: "user updated successfully",
          data:result
        })
      }
      return res.json({
        Error: "Error while updating"
      })
    })
    .catch(err => console.log(err))
}

function deletePerson(req, res) {
  let data = req.params;
  console.log(data)
  peopleService.deletePerson(data)
    .then(result => {
      if (result !== 'failed') {
        return res.json({
          message: "user deleted successfully"
        })
      }
      return res.json({
        Error: "Error while deleting"
      })
    })
    .catch(err => console.log(err))
}

//verify validity of token.


module.exports = {
  getAllPeople,
  getPerson,
  addPerson,
  updatePerson,
  deletePerson,
  verifyToken
}