import DBConnection from "../../configs/DBConnection";

let delete_firm = (req, res) => {
    var id= req.params.idcompanies;
    var sql = 'DELETE FROM companies WHERE idcompanies = ?';
    DBConnection.query(sql, [id], function (err, data) {
        if (err) throw err;
        console.log(data.affectedRows + " record(s) updated");
    });
    res.redirect('/admin_firms');
}

let getEditFirm = (req, res) => {
    var UserId= req.params.idcompanies;
    var sql=`SELECT * FROM companies WHERE idcompanies=${UserId}`;
    DBConnection.query(sql, function (err, data) {
        if (err) throw err;
        req.session.data = data[0];
        res.redirect("/editFirm");
    });
}

let editFirm = (req, res) => {
    res.render('update_firms', { title: 'Firm List', editData: req.session.data});
}

let UPDATE_FIRM = (req, res) => {
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
}

let Insert_companies = (req, res) => {
    res.render('insert_companies')
}

let create_firm = (req, res) => {
    const userDetails=req.body;
    var sql = 'INSERT INTO companies SET ?';
    DBConnection.query(sql, userDetails,function (err, data) { 
        if (err) throw err;
    });
    res.redirect('/admin_firms');  
}

module.exports = {
    delete_firm: delete_firm,
    getEditFirm: getEditFirm,
    editFirm: editFirm,
    UPDATE_FIRM: UPDATE_FIRM,
    Insert_companies: Insert_companies,
    create_firm: create_firm
};