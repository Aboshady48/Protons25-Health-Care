const pool = require('../../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;

const registerController = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        // check if user exists
        const checkUserQuery = 'SELECT * FROM users WHERE email = $1';
        const existingUser = await pool.query(checkUserQuery, [email]);

        if (existingUser.rows.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // insert new user
        const insertQuery = `
          INSERT INTO users (username, email, password)
          VALUES ($1, $2, $3)
          RETURNING id, username, email
        `;
        const result = await pool.query(insertQuery, [username, email, hashedPassword]);
        const user = result.rows[0];

        // generate token
        const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });

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
