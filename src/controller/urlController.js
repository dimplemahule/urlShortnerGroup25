const urlModel = require('../models/urlModel');
const validUrl = require('valid-url');
const shortId = require('shortid');
const validation = require('../validation/validate')
const redis = require("redis");

const { promisify } = require("util");

//Connect to redis
const redisClient = redis.createClient(
    18251,
    "redis-18251.c301.ap-south-1-1.ec2.cloud.redislabs.com",
    { no_ready_check: true }
  );
  redisClient.auth("g0Kd6m7qXMjNbGaLYSCpG3vPAxBRb2GZ", function (err) {
    if (err) throw err;
  });
  
  redisClient.on("connect", async function () {
    console.log("Connected to Redis..");
  });

const SET_ASYNC = promisify(redisClient.SET).bind(redisClient);
const GET_ASYNC = promisify(redisClient.GET).bind(redisClient);

const createShortUrl = async function (req, res) {
    try {
        let url = req.body.longUrl
        if (!validation.isValidField(url)) return res.status(400).send({ status: false, msg: 'url cannot be empty' })
        if (!validation.isValidUrl(url)) return res.status(400).send({ status: false, msg: 'enter valid url' })

        if (!validUrl.isUri(url.toString())) {
            return res.status(400).send({ status: false, msg: "enter valid url" })
        }
        let urlcheck = await urlModel.findOne({ longUrl: url }).select({ createdAt: 0, updatedAt: 0, __v: 0, _id: 0 })
        if (urlcheck) return res.status(200).send({ status: true, data: urlcheck })
        
        
        let urlCode = shortId.generate()
        req.body.urlCode = urlCode
        
        let shortUrl = "http://localhost:3000/" + urlCode
        req.body.shortUrl = shortUrl
        let createdShortUrl = await urlModel.create(req.body)
        let { createdAt, updatedAt, __v, _id, ...result } = createdShortUrl._doc

        return res.status(201).send({ status: true, data: result })
    }
    catch (error) {
        res.status(500).send({ msg: error.message })
    }
}

const getUrl = async function (req, res) {
    try {
        let reqParams = req.params.urlCode
        let cacheShortUrl = await GET_ASYNC(`${reqParams}`)
        if(cacheShortUrl){
            res.status(302).redirect(cacheShortUrl)
        }
        else{
        
        if(!shortId.isValid(reqParams)) return res.status(400).send({ status: false, msg: 'invalid url code' }) 
        let findUrlCode = await urlModel.findOne({ urlCode: reqParams }).select({ longUrl: 1, _id: 0 })
        if(findUrlCode == null) return res.status(400).send({ status: false, msg: 'Url not found' })
        await SET_ASYNC(`${reqParams}`, JSON.stringify(findUrlCode.longUrl))
        return res.status(302).redirect( findUrlCode.longUrl )
        }
    }
    catch (error) {
        res.status(500).send({ msg: error.message })
    }
}

module.exports = { createShortUrl, getUrl }





