/* eslint-disable @typescript-eslint/no-explicit-any */
import express from 'express';
import * as songController from '../controllers/song.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = express.Router();
router.use(authenticate);
// CRUD operations for songs
router.post('/', songController.createSong);
router.get('/:id', songController.getSong);
router.put('/:id', songController.updateSong);
router.get('/', songController.listSongs);
router.delete('/:id', songController.removeSong);

// Statistics endpoints
router.get('/stats/genres', songController.getGenreStatistics);
router.get('/stats/artists', songController.getArtistStatistics);
router.get('/stats/albums', songController.getAlbumStatistics);

export default router;

