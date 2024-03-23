const path = require('path');
const dotenv = require('dotenv');

/**
 * Load environment variables.
 */
module.exports = () => {
  dotenv.config({path: path.join(__dirname, '../.env')});
}