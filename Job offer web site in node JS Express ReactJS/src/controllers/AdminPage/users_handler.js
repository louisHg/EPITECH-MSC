import DBConnection from "../../configs/DBConnection";
const bcrypt = require('bcryptjs');

let delete_user = (req, res) => {
    var id= req.params.id;
    var sql = 'DELETE FROM users WHERE id = ?';
    DBConnection.query(sql, [id], function (err, data) {
        if (err) throw err;
        console.log(data.affectedRows + " record(s) updated");
    });
    res.redirect('/admin_users');
}

let getEditId = (req, res) => {
    var UserId= req.params.id;
    var sql=`SELECT * FROM users WHERE id=${UserId}`;
    DBConnection.query(sql, function (err, data) {
        if (err) throw err;
        req.session.data = data[0];
        res.redirect("/editMyProfile");
    });
}

let editMyProfile = (req, res) => {
    res.render('update', { title: 'User List', editData: req.session.data});
}

let UPDATE_USER = (req, res) => {
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
}

module.exports = {
    delete_user: delete_user,
    getEditId: getEditId,
    editMyProfile: editMyProfile,
    UPDATE_USER: UPDATE_USER
};