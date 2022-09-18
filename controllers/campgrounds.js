const Campground = require('../models/campground');
const { cloudinary } = require("../cloudinary");

module.exports.index = async (req, res) => {
    //find all campgrounds
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', { campgrounds })
}

module.exports.showNewForm = (req, res) => {
    res.render('campgrounds/new')
}

module.exports.postNewCampground = async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.showCamp = async (req, res) => {
    //getting id from the url
    let id = req.params.id;
    //finding product with id 
    const campground = await Campground.findById(id).populate({
        path: "reviews",
        populate: {
            path: "author"
        }
    }).populate('author')
    // console.log(campground)
    //pass to show page
    if (!campground) {
        req.flash('error', 'Cant Find Campground')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', { campground })
}

module.exports.GetEditForm = async (req, res) => {
    //getting id from the url
    let id = req.params.id;
    //finding product with id 
    const campground = await Campground.findById(id)
    if (!campground) {
        req.flash('error', 'Cant Find Campground')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', { campground })
}

module.exports.postEditedData = async (req, res) => {
    let id = req.params.id;
    const newlyUpdatedCampground = await Campground.findByIdAndUpdate(id,req.body.campground)
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    newlyUpdatedCampground.images.push(...imgs)
    await newlyUpdatedCampground.save()
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await newlyUpdatedCampground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'Succesfuly Updated A Campground')
    res.redirect('/campgrounds/' + newlyUpdatedCampground._id)
}

module.exports.deleteCamp = async (req, res) => {
    //getting id from the url  delete
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Succesfuly Deleted Campground')
    res.redirect('/campgrounds');
}