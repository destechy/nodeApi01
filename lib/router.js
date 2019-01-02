/*
 *
 *   Request Router
 *
 */

const users = require('./handlers/users');
const tokens = require('./handlers/tokens');
const notFound = require('./handlers/notFound');

// Define the request router (which references from handlers library imported above)
const router = {
  users: users,
  notFound: notFound,
  tokens: tokens
};

module.exports = router;
