const express = require("express")
const router = express.Router()
const urlController = require('../controller/urlController')


router.post('/url/shorten', urlController.createShortUrl)
router.get('/:urlCode', urlController.getUrl)
router.all('*', (req, res) => {res.status(404).send({status : false, message:"No Page Found !!"})})





module.exports=router
