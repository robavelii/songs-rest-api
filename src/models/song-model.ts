// src/models/songModel.ts
import mongoose, { Document, Schema } from 'mongoose';

interface Song extends Document {
  title: string;
  artist: string;
  album: string;
  genre: string;
}

const songSchema = new Schema<Song>({
  title: String,
  artist: String,
  album: String,
  genre: String,
});

export const SongModel = mongoose.model<Song>('Song', songSchema);

