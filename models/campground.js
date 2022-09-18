const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require("./review")
//const User = require('./user')
//making app schema and model

const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});

const campgroundSchema = new Schema({
    title: {
        type: String
    },
    images:[ImageSchema],
    price:{
        type:Number
    },
    description:{
        type:String
    },
    location:{
        type:String
    },
    author :{
        type: Schema.Types.ObjectId, 
        ref: 'User'
    },
    reviews: [{
        type: Schema.Types.ObjectId, 
        ref: 'Review'
    }]

})
campgroundSchema.post('findOneAndDelete', async function(campground) {
    if (campground) {
      const res = await Review.deleteMany({_id: { $in : campground.reviews}})
    }
});
module.exports= mongoose.model('Campground', campgroundSchema)