

const crypt = require("bcrypt"); // Importing the bcrypt library for password hashing
const jwt = require("jsonwebtoken"); // Importing the jsonwebtoken library for authentication and authorization
const Bluebird = require("bluebird"); // Importing the Bluebird library for Promise-based asynchronous programming

Bluebird.promisifyAll(crypt); // Promisifying the bcrypt library
Bluebird.promisifyAll(jwt); // Promisifying the jsonwebtoken library

const compare = async (raw, digest) => { // Comparing the raw password with the hashed password stored in the database
  return crypt.compareAsync(raw, digest);
}

const generateAccessToken = async (user, scope) => { // Generating an access token for a user with a given scope
  const exp = new Date(); // Creating a new Date object
  exp.setHours(exp.getHours() + Number(process.env.JWT_ACCESS_TOKEN_EXPIRY_HOURS)); // Setting the expiration time for the access token

  let scopes = user.scopes; // Setting the user's scopes
  if (!scopes && scope) { // If user's scopes are not defined but scope parameter is given, set the scopes to the given scope
    scopes = scope.split(" ");
  }

  const payload = { // Creating the payload for the access token
    exp: Math.round(exp.getTime() / 1000), // Setting the expiration time
    iat: Math.round(new Date().getTime() / 1000), // Setting the issued at time
    scopes: scopes || [], // Setting the user's scopes
    userId: Number(user.id), // Setting the user's ID
  };
  return { // Returning the access token and its expiration time
    accessToken: await signJwt(payload, process.env.JWT_SECRET_FOR_ACCESS_TOKEN), // Signing the access token with the given secret key
    accessTokenExpiresAt: exp
  }
}

const signJwt = async (payload, secret) => { // Signing the payload with the given secret key
  return jwt.sign(payload, secret, {
    algorithm: "HS256", // Setting the algorithm for the signature
  });
}

const verifyJwt = async (token, secret) => { // Verifying the access token
  return jwt.verify(token, secret, {
    ignoreExpiration: false, // Not ignoring the expiration time of the access token
  });
}

const getUser = async (db, username, password) => { // Retrieving the user with the given username and password
  const [rows] = await db.query(`SELECT * FROM users where username='${username}'`); // Querying the database for the user with the given username
  const user = rows[0]; // Extracting the user from the query result

  if (!user) { // If user is not found in the database, return undefined
    return;
  } else if (!(await compare(password, user.passwordDigest))) { // If the password is incorrect, return undefined

    return;
  }

  return user; // Return the user
}

const hash = async (raw) => { // Hashing the raw password
  return crypt.hashAsync(raw, 10); // Returning the hashed password
}

module.exports = { // Exporting the functions
  generateAccessToken,
  getUser,
  hash
}