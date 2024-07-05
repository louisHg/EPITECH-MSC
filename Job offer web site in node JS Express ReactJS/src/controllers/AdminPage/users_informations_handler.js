import DBConnection from "../../configs/DBConnection";

let delete_info = (req, res) => {
    var id= req.params.iduser_information;
    var sql = 'DELETE FROM users_informations WHERE iduser_information = ?';
    DBConnection.query(sql, [id], function (err, data) {
        if (err) throw err;
        console.log(data.affectedRows + " record(s) updated");
    });
    res.redirect('/admin_info');
}

let getEditInfo = (req, res) => {
    var UserId= req.params.iduser_information;
    var sql=`SELECT * FROM users_informations WHERE iduser_information=${UserId}`;
    DBConnection.query(sql, function (err, data) {
        if (err) throw err;
        req.session.data = data[0];
        res.redirect("/editInfo");
    });
}

let editInfo = (req, res) => {
    res.render('update_info', { title: 'Firm List', editData: req.session.data});
}

let UPDATE_INFO = (req, res) => {
    var id = req.session.data.iduser_information ;
    let userItem = {
        name: req.body.name,
        surname: req.body.surname,
        graduate: req.body.graduate,
        experience_lvl: req.body.experience_lvl,
        preffered_langage: req.body.preffered_langage,
        language_spoken: req.body.language_spoken,
        skills: req.body.skills,
        hobbies: req.body.hobbies,
        educational_path: req.body.educational_path,
        professional_career: req.body.professional_career,


    };
    var sql = `UPDATE users_informations SET ? WHERE iduser_information=${id}`;
    DBConnection.query(sql, userItem, function (err, data) {
        console.log(data.affectedRows + " record(s) updated");
    });
    res.redirect("/admin_info");
}


module.exports = {
    delete_info: delete_info,
    getEditInfo: getEditInfo,
    editInfo: editInfo,
    UPDATE_INFO: UPDATE_INFO
};