'use strict';

const DATABASE_URL = process.env.DATABASE_URL || global.DATABASE_URL || 'mongodb://localhost/food-nutrition';

exports.DATABASE_URL = DATABASE_URL;

exports.TEST_DATABASE_URL = 'mongodb://localhost/test-food-nutrition';

exports.PORT = process.env.PORT || 8080;