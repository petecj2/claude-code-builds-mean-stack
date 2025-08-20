const express = require('express');
const MovieController = require('../controllers/movieController');

const router = express.Router();
const movieController = new MovieController();

// GET /api/movies/alphabet - Returns list of unique first letters from movie titles
router.get('/alphabet', movieController.getAlphabet);

// GET /api/movies/search - Search movies (bonus endpoint)
router.get('/search', movieController.searchMovies);

// GET /api/movies/by-letter/:letter - Returns paginated movies starting with a specific letter
router.get('/by-letter/:letter', movieController.getMoviesByLetter);

// GET /api/movies/:id - Returns complete details of a single movie by ID
router.get('/:id', movieController.getMovieById);

module.exports = router;