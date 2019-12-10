module.exports = (err, req, res, next) => {

    res.set('Content-Type', 'application/json');
    res.status(500).send(JSON.stringify({
        status: 500,
        message: "error in Catch Block",
        detailedMessage: err.message
    }));

}