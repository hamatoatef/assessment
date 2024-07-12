const { validationResult } = require("express-validator");

const validateRequest = (req, res, next) => {
  console.log(req.body);
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((error) => {
      return { message: error.msg, field: error.param };
    });
    return res.status(400).json({ errors: formattedErrors });
  }

  next();
};

module.exports = {
  validateRequest,
};
