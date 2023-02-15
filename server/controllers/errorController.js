module.exports = (err, req, res, next) => {
    console.log("GLOBAL ERROR: ".red.underline.bold, err);
    res.status(200).json({
        status: false,
        data: err,
    });
};
