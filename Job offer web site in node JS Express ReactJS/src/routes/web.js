import express from "express";
import homePageController from "../controllers/homePageController";
import registerController from "../controllers/registerController";
import loginController from "../controllers/loginController";
import auth from "../validation/authValidation";
import passport from "passport";
import initPassportLocal from "../controllers/passportLocalController";

// AdminPage
import adminController from "../controllers/AdminPage/adminController";
import users_handler from "../controllers/AdminPage/users_handler";
import firms_handler from "../controllers/AdminPage/firms_handler";
import ad_handler from "../controllers/AdminPage/ads_handler";
import info_handler from "../controllers/AdminPage/users_informations_handler";

// HomePage
import homeController from "../controllers/HomePage/homeController";
import advertisements from "../controllers/advertisements";
import profil from "../controllers/HomePage/profilController";



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


    // Home Page
    router.get('/homepage', loginController.checkLoggedIn, homeController.getHomePage)
    router.get('/Home',  loginController.checkLoggedIn, advertisements.findAll)

    router.get('/job', loginController.checkLoggedIn, profil.job)
    router.post('/APPLY_JOB', loginController.checkLoggedIn, profil.APPLY_JOB)
    router.get('/MAIL_SENT', loginController.checkLoggedIn, profil.MAIL_SENT)

    router.get('/profil', loginController.checkLoggedIn, profil.getProfilPage)

    



    // Admin Page
    router.get('/adminpage', loginController.checkLoggedIn, adminController.getAdminPage)
    router.get('/admin_users', loginController.checkLoggedIn, adminController.admin_users)
    router.get('/admin_firms', loginController.checkLoggedIn, adminController.admin_firms)
    router.get('/admin_ad', loginController.checkLoggedIn, adminController.admin_ad)
    router.get('/admin_info', loginController.checkLoggedIn, adminController.admin_info)


    // Users Handler
    router.get('/delete/:id', loginController.checkLoggedIn, users_handler.delete_user)
    router.get('/edit/:id', loginController.checkLoggedIn, users_handler.getEditId)
    router.get('/editMyProfile', users_handler.editMyProfile)
    router.post('/UPDATE_USER', users_handler.UPDATE_USER)

    // Firms Handler
    router.get('/delete_firm/:idcompanies', loginController.checkLoggedIn, firms_handler.delete_firm)
    router.get('/edit_firm/:idcompanies', loginController.checkLoggedIn, firms_handler.getEditFirm)
    router.get('/editFirm', firms_handler.editFirm)
    router.post('/UPDATE_FIRM', firms_handler.UPDATE_FIRM)
    router.get("/insert_companies", loginController.checkLoggedIn, firms_handler.Insert_companies)
    router.post('/create_firm', firms_handler.create_firm)


    // Ad Handler
    router.get('/delete_ad/:idadvertissements', loginController.checkLoggedIn, ad_handler.delete_ad)
    router.get('/edit_ad/:idadvertissements', loginController.checkLoggedIn, ad_handler.getEditAd)
    router.get('/editAd', ad_handler.editAd)
    router.post('/UPDATE_AD', ad_handler.UPDATE_AD)
    router.get("/insert_ad", loginController.checkLoggedIn, ad_handler.Insert_ad)
    router.post('/create_ad', ad_handler.create_ad)



    // Users informations Handler
    router.get('/delete_info/:iduser_information', loginController.checkLoggedIn, info_handler.delete_info)
    router.get('/edit_info/:iduser_information', loginController.checkLoggedIn, info_handler.getEditInfo)
    router.get('/editInfo', info_handler.editInfo)
    router.post('/UPDATE_INFO', info_handler.UPDATE_INFO)


    // End Admin Page

    





    return app.use("/", router);
    
};



module.exports = authroute;