const express = require("express");
const { authorization } = require("../utils/context");
const router = express.Router();
const {
  fetchPerson,
  addPerson,
  editPersonDetails,
  removePerson,
} = require("./controller");

router.get("/", authorization,fetchPerson);
router.post("/",authorization,addPerson);
router.put("/:personId",authorization,editPersonDetails);
router.delete("/:personId",authorization,removePerson);

module.exports = router;
