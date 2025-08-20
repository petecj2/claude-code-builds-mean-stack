const Movie = require('../models/Movie');

class MovieController {
  constructor() {
    this.movieModel = new Movie();
  }

  // GET /api/movies/alphabet
  getAlphabet = async (req, res) => {
    try {
      const alphabetList = await this.movieModel.getAlphabetList();
      
      res.status(200).json({
        success: true,
        data: alphabetList,
        message: 'Alphabet list retrieved successfully'
      });
    } catch (error) {
      console.error('Error in getAlphabet:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error while fetching alphabet list',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  };

  // GET /api/movies/by-letter/:letter
  getMoviesByLetter = async (req, res) => {
    try {
      const { letter } = req.params;
      const page = parseInt(req.query.page) || 1;
      const limit = 15; // Fixed at 15 per requirements

      // Validate letter parameter
      if (!letter || letter.length !== 1) {
        return res.status(400).json({
          success: false,
          message: 'Letter parameter must be a single character'
        });
      }

      if (!/^[A-Za-z0-9]$/.test(letter)) {
        return res.status(400).json({
          success: false,
          message: 'Letter parameter must be alphanumeric'
        });
      }

      // Validate page parameter
      if (page < 1) {
        return res.status(400).json({
          success: false,
          message: 'Page number must be greater than 0'
        });
      }

      const result = await this.movieModel.getMoviesByLetter(letter, page, limit);
      
      res.status(200).json({
        success: true,
        data: result.movies,
        pagination: result.pagination,
        message: `Movies starting with "${letter.toUpperCase()}" retrieved successfully`
      });
    } catch (error) {
      console.error('Error in getMoviesByLetter:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error while fetching movies by letter',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  };

  // GET /api/movies/:id
  getMovieById = async (req, res) => {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Movie ID is required'
        });
      }

      const movie = await this.movieModel.getMovieById(id);
      
      res.status(200).json({
        success: true,
        data: movie,
        message: 'Movie retrieved successfully'
      });
    } catch (error) {
      console.error('Error in getMovieById:', error);
      
      if (error.message === 'Invalid movie ID format') {
        return res.status(400).json({
          success: false,
          message: 'Invalid movie ID format'
        });
      }
      
      if (error.message === 'Movie not found') {
        return res.status(404).json({
          success: false,
          message: 'Movie not found'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Internal server error while fetching movie details',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  };

  // Bonus endpoint for searching movies
  searchMovies = async (req, res) => {
    try {
      const { q: query } = req.query;
      const page = parseInt(req.query.page) || 1;
      const limit = 15;

      if (!query || query.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Search query is required'
        });
      }

      if (query.trim().length < 2) {
        return res.status(400).json({
          success: false,
          message: 'Search query must be at least 2 characters long'
        });
      }

      const result = await this.movieModel.searchMovies(query.trim(), page, limit);
      
      res.status(200).json({
        success: true,
        data: result.movies,
        pagination: result.pagination,
        query: query.trim(),
        message: 'Search results retrieved successfully'
      });
    } catch (error) {
      console.error('Error in searchMovies:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error while searching movies',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  };
}

module.exports = MovieController;