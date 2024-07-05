const Advertisements = require("../services/advertisementService");

let findAll = (req, res) => {
    
    Advertisements.getAll((err, data) => {
        if (err)
          res.status(500).send({
            message:
              err.message || "Some error occurred while retrieving ad."
          });
        else {
 
          res.render("homepage", {data: data});
        }
    });
}

module.exports = {
    findAll: findAll
}