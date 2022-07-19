const mongoose = require("mongoose")


let urlSchema = new mongoose.Schema({
    longUrl: { type: String, trim: true, required: true },
    shortUrl: { type: String, required: true, trim: true, unique: true },
    urlCode: { type: String, trim: true, required: true, lowercase: true, unique: true },

}, { timestamps: true });

module.exports = mongoose.model('Url', urlSchema)
