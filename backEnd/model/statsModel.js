const mongoose = require("mongoose");
const statsSchema = mongoose.Schema(
    {
        name : String,
        maxValue : Number
    },{
        versionKey : false
    }
)
const stats = mongoose.model("Stats" , statsSchema) 
module.exports = stats;