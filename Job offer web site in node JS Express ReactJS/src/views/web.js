import express from "express";
import homePageController from "../controllers/homePageController";
import registerController from "../controllers/registerController";
import loginController from "../controllers/loginController";
import auth from "../validation/authValidation";
import passport from "passport";
import initPassportLocal from "../controllers/passportLocalController";
import adminController from "../controllers/adminController";



const bcrypt = require('bcryptjs');
import DBConnection from "../configs/DBConnection";


// Init all passport
initPassportLocal(); //Check few condtions to create a user's session

let router = express.Router();

let authroute = (app) => {
    router.get("/", loginController.checkLoggedIn, homePageController.handleHelloWorld);// 2 route admin, user
    router.get("/login", loginController.checkLoggedOut, loginController.getPageLogin);
    router.post("/login", passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/login",
        successFlash: true,
        failureFlash: true
    }));


    router.get("/register", registerController.getPageRegister);
    router.post("/register", auth.validateRegister, registerController.createNewUser);
    router.post("/logout", loginController.postLogOut);



    // Admin Page
    router.get('/adminpage', loginController.checkLoggedIn, adminController.getAdminPage)
    router.get('/admin_users', loginController.checkLoggedIn, adminController.admin_users)
    router.get('/admin_firms', loginController.checkLoggedIn, adminController.admin_firms)
    router.get('/admin_ad', loginController.checkLoggedIn, adminController.admin_firms)
    router.get('/admin_info', loginController.checkLoggedIn, adminController.admin_firms)
    // Users Handler




    // Firms Handler





    
    // Delete users
    router.get('/delete/:id', loginController.checkLoggedIn, (req, res) => {
        console.log('hi');
        var id= req.params.id;
        var sql = 'DELETE FROM users WHERE id = ?';
        DBConnection.query(sql, [id], function (err, data) {
            if (err) throw err;
            console.log(data.affectedRows + " record(s) updated");
        });
        res.redirect('/admin_users');
        
    });
    

    // Udapte a user
    router.get('/edit/:id', loginController.checkLoggedIn, (req, res, next) => {
        var UserId= req.params.id;
        var sql=`SELECT * FROM users WHERE id=${UserId}`;
        DBConnection.query(sql, function (err, data) {
            if (err) throw err;
            req.session.data = data[0];
            res.redirect("/editMyProfile");
        });
    });

    router.get("/editMyProfile", (req, res) => {
        
        res.render('update', { title: 'User List', editData: req.session.data});
    });

    router.post('/UPDATE', function(req, res, next) {
        console.log(req.session.data.id);
        var id = req.session.data.id;
        
        let salt = bcrypt.genSaltSync(10);
        let userItem = {
            fullname: req.body.fullname,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, salt),
        };
        var sql = `UPDATE users SET ? WHERE id=${id}`;
        DBConnection.query(sql, userItem, function (err, data) {
        if (err) throw err;
            console.log(data.affectedRows + " record(s) updated");
        });
        res.redirect("/admin_users");


    });


    // End udapte user



    // Duplicates for firms

    router.get('/delete_firm/:idcompanies', loginController.checkLoggedIn, (req, res) => {
        console.log('hi');
        var id= req.params.idcompanies;
        var sql = 'DELETE FROM companies WHERE idcompanies = ?';
        DBConnection.query(sql, [id], function (err, data) {
            if (err) throw err;
            console.log(data.affectedRows + " record(s) updated");
        });
        res.redirect('/admin_firms');
        
    });
    

    router.get('/edit_firm/:idcompanies', loginController.checkLoggedIn, (req, res, next) => {
        var UserId= req.params.idcompanies;
        console.log(req.params)
        var sql=`SELECT * FROM companies WHERE idcompanies=${UserId}`;
        DBConnection.query(sql, function (err, data) {
            if (err) throw err;
            req.session.data = data[0];
            res.redirect("/editFirm");
        });
    });

    router.get("/editFirm", (req, res) => {
        
        res.render('update_firms', { title: 'Firm List', editData: req.session.data});
    });

    router.post('/UPDATE_FIRM', function(req, res, next) {
        console.log(req.session.data.id);
        var id = req.session.data.idcompanies;
        let userItem = {
            identity: req.body.identity,
            address: req.body.address,
        };
        var sql = `UPDATE companies SET ? WHERE idcompanies=${id}`;
        DBConnection.query(sql, userItem, function (err, data) {
            console.log(data.affectedRows + " record(s) updated");
        });
        res.redirect("/admin_firms");


    });

    // Insert firm

    router.get("/insert_companies", loginController.checkLoggedIn, (req, res) => {
        res.render('insert_companies')
    })
    

    router.post('/create_firm', function(req, res, next) {
        const userDetails=req.body;
        var sql = 'INSERT INTO companies SET ?';
        DBConnection.query(sql, userDetails,function (err, data) { 
            if (err) throw err;
        });
       res.redirect('/admin_firms');  
    }); 




    return app.use("/", router);
    
};



module.exports = authroute;