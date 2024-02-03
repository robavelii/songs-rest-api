import { Request, Response } from 'express';
import Song from '../models/song.model';
import {
  createSongSchema,
  deleteSongSchema,
  updateSongSchema,
} from '../utils/validator';

// Create a new song
export const createSong = async (req: Request, res: Response) => {
  try {
    const { album, title, genre, artist } = req.body;
    const validationResult = createSongSchema.validate(req.body);

    if (validationResult.error) {
      return res.status(400).json({ error: validationResult.error.message });
    }

    // Check for duplicates
    const existingSong = await Song.findOne({ album, title, genre, artist });

    if (existingSong) {
      return res.status(409).json({ error: 'Duplicate song found' });
    }

    const song = await Song.create(req.body);
    res.status(201).json(song);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// Get all songs
export const listSongs = async (req: Request, res: Response) => {
  try {
    const songs = await Song.find().lean();
    res.status(200).json(songs);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// Get one song by ID
export const getSong = async (req: Request, res: Response) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) {
      return res.status(404).json({ error: 'Song not found' });
    }
    res.status(200).json(song);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// Update a song by ID
export const updateSong = async (req: Request, res: Response) => {
  try {
    const validationResult = updateSongSchema.validate(req.body);

    if (validationResult.error) {
      return res.status(400).json({ error: validationResult.error.message });
    }

    const song = await Song.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!song) {
      return res.status(404).json({ error: 'Song not found' });
    }
    res.status(200).json(song);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// Remove a song by ID
export const removeSong = async (req: Request, res: Response) => {
  try {
    const validationResult = deleteSongSchema.validate({ id: req.params.id });

    console.log('Validation result', validationResult);
    if (validationResult.error) {
      return res.status(400).json({ error: validationResult.error.message });
    }

    const song = await Song.findByIdAndDelete(req.params.id);
    if (!song) {
      return res.status(404).json({ error: 'Song not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// Get number of songs in every genre
export const getGenreStatistics = async (req: Request, res: Response) => {
  try {
    const genreStatistics = await Song.aggregate([
      { $group: { _id: '$genre', count: { $sum: 1 } } },
    ]);

    res.status(200).json(genreStatistics);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// Get number of songs & albums each artist has
export const getArtistStatistics = async (req: Request, res: Response) => {
  try {
    const artistStatistics = await Song.aggregate([
      {
        $group: {
          _id: '$artist',
          totalSongs: { $sum: 1 },
          totalAlbums: { $addToSet: '$album' },
        },
      },
    ]);

    res.status(200).json(artistStatistics);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// Get number of songs in each album
export const getAlbumStatistics = async (req: Request, res: Response) => {
  try {
    const albumStatistics = await Song.aggregate([
      {
        $group: {
          _id: { artist: '$artist', album: '$album' },
          totalSongs: { $sum: 1 },
          totalAlbums: { $addToSet: '$album' },
        },
      },
    ]);

    res.status(200).json(albumStatistics);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

