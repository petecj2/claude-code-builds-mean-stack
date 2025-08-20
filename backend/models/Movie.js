const { ObjectId } = require('mongodb');
const { getDB } = require('../config/database');

class Movie {
  constructor() {
    this.collection = 'movies';
  }

  async getAlphabetList() {
    try {
      const db = getDB();
      const pipeline = [
        {
          $match: {
            title: { $exists: true, $ne: null, $ne: "" }
          }
        },
        {
          $project: {
            firstLetter: { 
              $toUpper: { 
                $substrCP: [
                  {
                    $trim: { input: "$title" }
                  }, 
                  0, 
                  1
                ] 
              }
            }
          }
        },
        {
          $group: {
            _id: "$firstLetter"
          }
        },
        {
          $sort: { _id: 1 }
        }
      ];

      const result = await db.collection(this.collection).aggregate(pipeline).toArray();
      return result.map(item => item._id).filter(letter => /^[A-Z0-9]$/.test(letter));
    } catch (error) {
      throw new Error(`Error fetching alphabet list: ${error.message}`);
    }
  }

  async getMoviesByLetter(letter, page = 1, limit = 15) {
    try {
      const db = getDB();
      const skip = (page - 1) * limit;
      
      // Create regex pattern for the letter
      const letterPattern = new RegExp(`^${letter.toLowerCase()}`, 'i');
      
      const filter = {
        title: { $exists: true, $ne: null, $ne: "", $regex: letterPattern }
      };

      const movies = await db.collection(this.collection)
        .find(filter)
        .project({
          title: 1,
          year: 1,
          genres: 1,
          runtime: 1,
          imdb: 1,
          poster: 1,
          plot: 1,
          cast: { $slice: 5 }, // Limit cast to first 5 actors
          directors: 1
        })
        .sort({ title: 1 })
        .skip(skip)
        .limit(limit)
        .toArray();

      const totalCount = await db.collection(this.collection).countDocuments(filter);
      const totalPages = Math.ceil(totalCount / limit);

      return {
        movies,
        pagination: {
          currentPage: page,
          totalPages,
          totalCount,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      };
    } catch (error) {
      throw new Error(`Error fetching movies by letter: ${error.message}`);
    }
  }

  async getMovieById(id) {
    try {
      const db = getDB();
      let objectId;

      // Validate and convert ID
      try {
        objectId = new ObjectId(id);
      } catch (error) {
        throw new Error('Invalid movie ID format');
      }

      const movie = await db.collection(this.collection).findOne({ _id: objectId });
      
      if (!movie) {
        throw new Error('Movie not found');
      }

      return movie;
    } catch (error) {
      throw error;
    }
  }

  async searchMovies(query, page = 1, limit = 15) {
    try {
      const db = getDB();
      const skip = (page - 1) * limit;
      
      const searchFilter = {
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { plot: { $regex: query, $options: 'i' } },
          { genres: { $in: [new RegExp(query, 'i')] } },
          { cast: { $in: [new RegExp(query, 'i')] } },
          { directors: { $in: [new RegExp(query, 'i')] } }
        ]
      };

      const movies = await db.collection(this.collection)
        .find(searchFilter)
        .project({
          title: 1,
          year: 1,
          genres: 1,
          runtime: 1,
          imdb: 1,
          poster: 1,
          plot: 1,
          cast: { $slice: 5 },
          directors: 1
        })
        .sort({ 'imdb.rating': -1 })
        .skip(skip)
        .limit(limit)
        .toArray();

      const totalCount = await db.collection(this.collection).countDocuments(searchFilter);
      const totalPages = Math.ceil(totalCount / limit);

      return {
        movies,
        pagination: {
          currentPage: page,
          totalPages,
          totalCount,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      };
    } catch (error) {
      throw new Error(`Error searching movies: ${error.message}`);
    }
  }
}

module.exports = Movie;