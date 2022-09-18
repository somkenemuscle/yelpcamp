const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//making app schema and model
const reviewSchema = new Schema({
    body: {
        type: String
    },
    author:{
        type: Schema.Types.ObjectId, 
        ref: 'User'
    },
    rating : {
        type : Number
    }
   

})

module.exports = mongoose.model('Review', reviewSchema)