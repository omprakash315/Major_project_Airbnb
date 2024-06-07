module.exports.isLogedIn = (req, res,next) => {
  
  if (!req.isAuthenticated()) {
    req.session.redirect=req.originalUrl;
    req.flash("error", "You must be loged-in");
    return res.redirect("/login");
  }
  next();
};

module.exports.saveUrl=(req,res,next)=>{
  if(req.session.redirect){
    res.locals.redirect=req.session.redirect;
    
  }
  next();
}
