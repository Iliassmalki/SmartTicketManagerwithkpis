import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import db from '../models/index.js';
const { sequelize } = db;
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';
const BCRYPT_SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS) || 10;

async function register(req, res, next) {
    try {
        const { firstName,lastName, email, password,role,latitude,longitude } = req.body || {};
        if (!firstName||!lastName) {
            return res.status(400).json({ message: 'Name is required.' });
        }
        if(role&&!['user', 'organizer'].includes(role)){
            return res.status(400).json({ message: 'Invalid role specified.' });
        }
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required.' });
        }

        const existing = await db.User.findOne({ where: { email } });
        if (existing) {
            return res.status(409).json({ message: 'Email already in use.' });
        }

        const hashed = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
        const user = await db.User.create({ firstName,lastName, email, password: hashed,role,latitude,longitude });

        const token = jwt.sign({ id: user.id, email: user.email,role: user.role, latitude:user.latitude,longitude:user.longitude }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

        return res.status(201).json({
            user: { id: user.id, name: user.name, email: user.email },
            token
        });
    } catch (err) {
        next(err);
    }
}


async function login(req, res, next) {
    try {
        const { email, password } = req.body || {};
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required.' });
        }

        const user = await db.User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        const token = jwt.sign({ id: user.id, email: user.email,role: user.role,latitude:user.latitude,longitude:user.longitude }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

        return res.status(200).json({
            user: { id: user.id, name: user.name, email: user.email,role: user.role,latitude:user.latitude,longitude:user.longitude },
            token
        });
    } catch (err) {
        next(err);
    }
}

/**
 * Express middleware to protect routes.
 * Looks for Authorization: Bearer <token>
 * Attaches decoded token and user instance to req.user
 */
async function authenticate(req, res, next) {
    try {
        const auth = req.headers.authorization || '';
        const [, token] = auth.split(' ');

        if (!token) {
            return res.status(401).json({ message: 'No token provided.' });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, JWT_SECRET);
        } catch (err) {
            return res.status(401).json({ message: 'Invalid or expired token.' });
        }

        const user = await db.User.findByPk(decoded.id, { attributes: { exclude: ['password'] } });
        if (!user) {
            return res.status(401).json({ message: 'User not found.' });
        }

        req.user = user;
        next();
    } catch (err) {
        next(err);
    }
}
  function authorizeRoles(...allowedRoles) {
    return (req, res, next) => {

        if (!req.user) {
            return res.status(401).json({ message: "Not authenticated" });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: "Access denied: insufficient role" });
        }

        next();
    };
}

export { register, login, authenticate,authorizeRoles };