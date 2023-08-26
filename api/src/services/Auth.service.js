import * as dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const accessTokenLife = process.env.ACCESS_TOKEN_LIFE;
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

const AuthServices = {
  generateToken: async (parser) => {
    const accessToken = jwt.sign(parser, accessTokenSecret, {
      expiresIn: accessTokenLife,
      algorithm: 'HS256',
    });
    return accessToken;
  },
  verifyToken: async (token) => {
    try {
      token = token.replace('Bearer ', '');
      const decoded = jwt.verify(token, accessTokenSecret, {
        expiresIn: accessTokenLife,
        algorithm: 'HS256',
        ignoreExpiration: true,
      });
      return decoded;
    } catch (err) {
      console.log(`Error in decode access token: ${err}`);
      return null;
    }
  },
};

export default AuthServices;
