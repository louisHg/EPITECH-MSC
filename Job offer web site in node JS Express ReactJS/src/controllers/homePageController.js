let handleHelloWorld = (req, res) => {
    console.log(req.user);
    if (req.user.category == 1){
        console.log("here")
        res.redirect("/adminpage");
    }
    res.redirect("/homepage");
};

module.exports = {
    handleHelloWorld: handleHelloWorld,
};
