import DBConnection from "../../configs/DBConnection";


let getAdminPage = (req, res) => {
    res.render('adminpage')
};

let admin_users = (req, res) => {
    var sql='SELECT * from users';
    DBConnection.query(sql, function (err, data) {
        if(err) throw err;
        res.render('admin_users', { title: 'Admin Page', userData: data});
    })
}

let admin_firms = (req, res) => {
    var sql='SELECT * from companies';
    DBConnection.query(sql, function (err, data) {
        if(err) throw err;
        res.render('admin_firms', { title: 'Admin Page', userData: data});
    })
}

let admin_ad = (req, res) => {
    var sql='SELECT * from advertissements';
    DBConnection.query(sql, function (err, data) {
        if(err) throw err;
        res.render('admin_ad', { title: 'Admin Page', userData: data});
    })
}

let admin_info = (req, res) => {
    var sql='SELECT * from users_informations';
    DBConnection.query(sql, function (err, data) {
        if(err) throw err;
        res.render('admin_info', { title: 'Admin Page', userData: data});
    })
}



module.exports = {
    getAdminPage: getAdminPage,
    admin_users: admin_users,
    admin_firms: admin_firms,
    admin_ad: admin_ad,
    admin_info: admin_info
};