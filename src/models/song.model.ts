import { model, Schema, Document } from 'mongoose';
import { ISong } from '../interfaces/song.interface';

const songSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
  },
  artist: {
    type: String,
    required: true,
  },
  album: {
    type: String,
    required: true,
  },
  genre: {
    type: String,
    required: true,
  },
});
songSchema.index({ album: 1, title: 1, genre: 1, artist: 1 }, { unique: true });

const songModel = model<ISong & Document>('Songs', songSchema);

export default songModel;

