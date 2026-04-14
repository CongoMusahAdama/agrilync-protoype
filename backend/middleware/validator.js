const { body, validationResult } = require('express-validator');

/**
 * Middleware to check validation results
 */
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }
    
    const extractedErrors = [];
    errors.array().map(err => extractedErrors.push({ [err.path]: err.msg }));

    return res.status(422).json({
        errors: extractedErrors,
    });
};

/**
 * Auth validation rules
 */
const loginRules = [
    body('email').isEmail().withMessage('Please include a valid email'),
    body('password').exists().withMessage('Password is required'),
];

const changePasswordRules = [
    body('newPassword')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
        .matches(/\d/)
        .withMessage('Password must contain a number')
        .matches(/[A-Z]/)
        .withMessage('Password must contain an uppercase letter'),
];

/**
 * Farmer/Farm validation rules
 */
const farmerRules = [
    body('name').notEmpty().withMessage('Name is required').trim().escape(),
    body('email').optional({ checkFalsy: true }).isEmail().withMessage('Valid email required'),
    body('phone').notEmpty().withMessage('Phone number is required'),
];

const farmRules = [
    body('name').notEmpty().withMessage('Farm name is required').trim().escape(),
    body('location').notEmpty().withMessage('Location is required'),
    body('size').isNumeric().withMessage('Size must be a number'),
];

module.exports = {
    validate,
    loginRules,
    changePasswordRules,
    farmerRules,
    farmRules
};
