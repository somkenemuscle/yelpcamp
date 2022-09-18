const mongoose = require('mongoose');
const Campground = require('./models/campground')

try {
    mongoose.connect('mongodb://localhost:27017/yelpcamp');
    console.log("connected")
} catch (error) {
    console.log("error from connect")
    console.log(error)
}

const seedproducts = [
    {
        author : "630e2c81c969a45cdbd434cc",
        title: 'kantex',
        image:[{url : "https://images.unsplash.com/photo-1534880606858-29b0e8a24e8d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"}],
        price: 1.99,
        description: 'a campground of many fruits',
        location: 'kansas,texas'
    },{
        author : "630e2c81c969a45cdbd434cc",
        title: 'bino',
        image:[{url : "https://images.unsplash.com/photo-1534880606858-29b0e8a24e8d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"}],
        price: 6.99,
        description: 'a campground with albino complex',
        location: 'new york'
    }
]

Campground.insertMany(seedproducts)
    .then((d) => {
        console.log(d)
    })
    .catch((e) => {
        console.log(e)
    })


