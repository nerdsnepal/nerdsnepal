const Joi = require('joi');

const addressSchema = Joi.object({
  fullName: Joi.string().required(),
  street: Joi.string().required(),
  city: Joi.string().required(),
  state: Joi.string().required(),
  zipCode: Joi.string().required(),
  country: Joi.string().required(),
  phoneNumber: Joi.string()
  .pattern(/^[0-9]{6,14}$/)
  .required(),
});


module.exports = {
    validate:(data)=>{
        const { error, value } = addressSchema.validate(data);
        if (error) {
          throw new Error(error.details[0].message);
        }
        return value;
    }
};
