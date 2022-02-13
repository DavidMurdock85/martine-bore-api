const crypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Bluebird = require("bluebird");

Bluebird.promisifyAll(crypt);
Bluebird.promisifyAll(jwt);

const compare = async (raw, digest) => {
  return crypt.compareAsync(raw, digest);
}

/**
 * Invoked to generate a new access token.
 */
const generateAccessToken = async (user, scope) => {
  const exp = new Date();
  exp.setHours(exp.getHours() + Number(process.env.JWT_ACCESS_TOKEN_EXPIRY_HOURS));

  let scopes = user.scopes;
  if (!scopes && scope) {
    scopes = scope.split(" ");
  }

  const payload = {
    // clientId: Number(client.id),
    exp: Math.round(exp.getTime() / 1000), // in seconds
    iat: Math.round(new Date().getTime() / 1000), // in seconds
    // iss: process.env.JWT_ISSUER,
    scopes: scopes || [],
    userId: Number(user.id),
  };
  return signJwt(payload, process.env.JWT_SECRET_FOR_ACCESS_TOKEN);
}

const signJwt = async (payload, secret) => {
  return jwt.sign(payload, secret, {
    algorithm: "HS256", // HMAC using SHA-256 hash algorithm
  });
}

const verifyJwt = async (token, secret) => {
  return jwt.verify(token, secret, {
    ignoreExpiration: false,
  });
}

  /**
   * Invoked to retrieve a user using a username/password combination.
   */
const getUser = async (db, username, password) => {
  const [rows] = await db.query(`SELECT * FROM users where username='${username}'`);
  const user = rows[0];

  console.log(user);
  console.log(await compare(password, user.passwordDigest));
  if (!user) {
    // user not found
    return;
  } else if (!(await compare(password, user.passwordDigest))) {
    // password mismatch
    return;
  }

  return user;
}

const hash = async (raw) => {
  // TODO: this is primarily used for testing.
  // right now Rails generates the digest and we can safely compare.
  // if we need to start generating it (to move away from rails) there might be
  // some efforts to get the same hash... or it might not matter.
  // the compare works because the first bits of the hash contain the algorithm, etc
  return crypt.hashAsync(raw, 10);
}

module.exports = {
  generateAccessToken,
  getUser,
  hash
}


