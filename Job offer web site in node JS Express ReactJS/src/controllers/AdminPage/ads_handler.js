import DBConnection from "../../configs/DBConnection";

let delete_ad = (req, res) => {
    var id= req.params.idadvertissements;
    var sql = 'DELETE FROM advertissements WHERE idadvertissements = ?';
    DBConnection.query(sql, [id], function (err, data) {
        if (err) throw err;
        console.log(data.affectedRows + " record(s) updated");
    });
    res.redirect('/admin_ad');
}

let getEditAd = (req, res) => {
    var UserId= req.params.idadvertissements;
    var sql=`SELECT * FROM advertissements WHERE idadvertissements=${UserId}`;
    DBConnection.query(sql, function (err, data) {
        if (err) throw err;
        req.session.data = data[0];
        res.redirect("/editAd");
    });
}

let editAd = (req, res) => {
    res.render('update_ad', { title: 'Firm List', editData: req.session.data});
}

let UPDATE_AD = (req, res) => {
    var id = req.session.data.idadvertissements ;
    let userItem = {
        title: req.body.title,
        short_description: req.body.short_description,
        full_description: req.body.full_description,
        wages: req.body.wages,
        place: req.body.place,
        working_time: req.body.working_time,
        type: req.body.type,

    };
    var sql = `UPDATE advertissements SET ? WHERE idadvertissements=${id}`;
    DBConnection.query(sql, userItem, function (err, data) {
        console.log(data.affectedRows + " record(s) updated");
    });
    res.redirect("/admin_ad");
}

let Insert_ad = (req, res) => {
    res.render('insert_ad')
}

let create_ad = (req, res) => {
    const userDetails=req.body;
    var sql = 'INSERT INTO advertissements SET ?';
    DBConnection.query(sql, userDetails,function (err, data) { 
        if (err) throw err;
    });
    res.redirect('/admin_ad');  
}

module.exports = {
    delete_ad: delete_ad,
    getEditAd: getEditAd,
    editAd: editAd,
    UPDATE_AD: UPDATE_AD,
    Insert_ad: Insert_ad,
    create_ad: create_ad
};