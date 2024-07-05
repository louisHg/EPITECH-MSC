import DBConnection from "../configs/DBConnection";

const Advertisements = function (advertisements){
  this.title = advertisements.title
  this.short_description = advertisements.short_description
  this.full_description = advertisements.full_description
  this.wages = advertisements.wages
  this.place = advertisements.place
  this.working_time = advertisements.working_time
  this.type = advertisements.type

}

Advertisements.getAll = result => {
    DBConnection.query("SELECT * FROM advertissements", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("ad: ", res);
    result(null, res);
  });
};


module.exports = Advertisements;
