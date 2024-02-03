import Joi from 'joi';

export const userSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});
export const loginUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const createSongSchema = Joi.object({
  title: Joi.string().required(),
  artist: Joi.string().required(),
  album: Joi.string().required(),
  genre: Joi.string().required(),
});

export const updateSongSchema = Joi.object({
  title: Joi.string().optional(),
  artist: Joi.string().optional(),
  album: Joi.string().optional(),
  genre: Joi.string().optional(),
});

export const deleteSongSchema = Joi.object({
  id: Joi.string().required(),
});

