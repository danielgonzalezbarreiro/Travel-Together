const Joi = require('@hapi/joi');

const { generateError } = require('../../helpers');

// Basic Schemas
const searchSchema = Joi.string()
  .min(2)
  .required()
  .error(
    generateError(
      'The search field must be more than 2 characters',
      400
    )
  );

const emailSchema = Joi.string()
  .email()
  .required()
  .error(generateError('The email field must be a well-formed email', 400));

const passwordSchema = Joi.string()
  .min(6)
  .max(100)
  .required()
  .error(
    generateError('The password must be between 6 and 100 characters', 400)
  );

const nameSchema = Joi.string()
  .required()
  .max(50)
  .error(generateError('Name required and max 50 characters', 400));

const userLoginSchema = Joi.string()
  .required()
  .max(20)
  .error(generateError('Login user name required and max 20 characters', 400));

const birthdaySchema = Joi.string()
  .required()
  .error(generateError('Birthday format YYYY-MM-DD', 400))

// Object Schemas
const tripSchema = Joi.object().keys({
  locality: Joi.string()
    .max(100)
    .required()
    .error(
      generateError(
        'The locality field is required and cannot be more than 100 characters',
        400
      )
    ),
  description: Joi.string()
    .max(1000)
    .required()
    .error(
      generateError(
        'The description field is required and cannot be more than 1000 characters',
        400
      )
    ),
  date: Joi.string()
    .required()
    .error(
      generateError(
        'The date field is required and must be in date format',
        400
      )
    ),
  category: Joi.string()
    .max(50)
    .required()
    .error(
      generateError(
        'The category field is required and cannot have more than 20 characters',
        400
      )
    ),
  budget: Joi.number()
    .required()
    .integer()
    .error(
      generateError(
        'The budget field is required and is a number',
        400
      )
    )
});


const allowJoinSchema = Joi.object().keys({
  id_user_join: Joi.number()
});

const userSchemaRegister = Joi.object().keys({
  email: emailSchema,
  password: passwordSchema,
  profile_name: nameSchema,
  user_login: userLoginSchema,
  birthday: birthdaySchema
});

const userSchema = Joi.object().keys({
  email: emailSchema,
  user_password: passwordSchema
});

const editUserSchema = Joi.object().keys({
  email: emailSchema,
  user_login: Joi.string()
    .max(255)
    .error(
      generateError('The real name cannot exceed 255 characters', 400)
    )
});

const editPasswordUserSchema = Joi.object().keys({
  oldPassword: passwordSchema,
  newPassword: passwordSchema,
  newPasswordRepeat: Joi.any()
    .valid(Joi.ref('newPassword'))
    .error(generateError('Passwords must be the same', 400))
});

module.exports = {
  tripSchema,
  searchSchema,
  userSchema,
  editUserSchema,
  editPasswordUserSchema,
  userSchemaRegister,
  allowJoinSchema
};
