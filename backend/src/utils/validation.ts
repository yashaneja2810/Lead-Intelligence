import Joi from 'joi';

export const leadFormSchema = Joi.object({
  name: Joi.string().min(2).max(100).required().messages({
    'string.empty': 'Name is required',
    'string.min': 'Name must be at least 2 characters',
    'string.max': 'Name must not exceed 100 characters',
  }),
  
  email: Joi.string().email().required().messages({
    'string.empty': 'Email is required',
    'string.email': 'Please provide a valid email address',
  }),
  
  companyName: Joi.string().min(2).max(200).required().messages({
    'string.empty': 'Company name is required',
    'string.min': 'Company name must be at least 2 characters',
    'string.max': 'Company name must not exceed 200 characters',
  }),
  
  websiteUrl: Joi.string().uri().required().messages({
    'string.empty': 'Website URL is required',
    'string.uri': 'Please provide a valid website URL',
  }),
  
  industry: Joi.string().min(2).max(100).required().messages({
    'string.empty': 'Industry is required',
    'string.min': 'Industry must be at least 2 characters',
    'string.max': 'Industry must not exceed 100 characters',
  }),
  
  additionalNotes: Joi.string().max(1000).allow('').optional(),
  
  aiProvider: Joi.string().valid('gemini', 'groq').required().messages({
    'any.only': 'AI provider must be either "gemini" or "groq"',
    'string.empty': 'AI provider is required',
  }),
});

export const validateLeadForm = (data: any) => {
  return leadFormSchema.validate(data, { abortEarly: false });
};
