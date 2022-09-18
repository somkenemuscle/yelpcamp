const User = require('../models/user')

module.exports.renderRegister = (req, res) => {
    res.render('users/register')
}

module.exports.postUdata = async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username })
        const registeredUser = await User.register(user, password)
        req.login(registeredUser, (err) => {
            if (err) { return next(err); }
            req.flash('success', 'welcome to yelpcamp')
            res.redirect('/campgrounds')
        });

    } catch (e) {
        req.flash('error', e.message)
        res.redirect("/register")
    }
}

module.exports.renderLogin = (req, res) => {
    res.render('users/login')
}

module.exports.LoginUser = (req, res) => {
    req.flash('success', 'welcome back')
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl)
}

module.exports.LogOut = (req, res, next) => {
    req.logout();
    res.redirect('/campgrounds')
}