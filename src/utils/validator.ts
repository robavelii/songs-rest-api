import Joi from 'joi';

export const userSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const createSongSchema = Joi.object({
  title: Joi.string().required(),
  artist: Joi.string().required(),
  album: Joi.string().required(),
  genre: Joi.string().required(),
});

export const deleteSongSchema = Joi.object({
  songId: Joi.string().required(),
});

