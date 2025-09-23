const pool = require('../../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;

const registerController = async (req, res) => {
    const { username, email, password, role } = req.body;
    try {
        // check if user exists
        const checkUserQuery = 'SELECT * FROM users WHERE email = $1 OR username = $2';
        const existingUser = await pool.query(checkUserQuery, [email, username]);

        if (existingUser.rows.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // insert new user (role defaults to 'user' if not passed)
        const insertQuery = `
          INSERT INTO users (username, email, password, role)
          VALUES ($1, $2, $3, COALESCE($4, 'user'))
          RETURNING id, username, email, role, created_at
        `;
        const result = await pool.query(insertQuery, [username, email, hashedPassword, role]);
        const user = result.rows[0];

        // generate token
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            SECRET_KEY,
            { expiresIn: '1y' }
        );

        return res.status(201).json({
            message: 'User registered successfully',
            user,
            token
        });

    } catch (error) {
        console.error('Error in registerController', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { registerController };
