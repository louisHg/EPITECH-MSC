import DBConnection from "../../configs/DBConnection";



let getProfilPage = (req, res) => {
    res.render('profil')
    
    
};

// Apply Page

let job = (req, res) => {
    res.render('apply')
}



let APPLY_JOB = (req, res) => {
    let userItem = {
        title: req.body.title,
        mail_sent: req.body.mail_sent,
        name_concerned: req.body.name_concerned,
        message: req.body.message,

    };
    var sql = `INSERT INTO job_application SET ?`;
    DBConnection.query(sql, userItem, function (err, data) {
        console.log(data.affectedRows + " Mail(s) sent");
    });
    res.redirect("/MAIL_SENT");
}


let MAIL_SENT = (req, res) => {
    res.render('sent')
}






module.exports = {
    getProfilPage: getProfilPage,
    job: job,
    APPLY_JOB: APPLY_JOB,
    MAIL_SENT: MAIL_SENT
    
};

