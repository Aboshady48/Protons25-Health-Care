const pool  = require('../../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;

const loginController = async (req, res) => {
    const { username, password } = req.body;

    try {
        //check if user exists
        const query = 'SELECT * FROM users WHERE username = $1';
        const result = await pool.query(query, [username]);

        // check if user not found
        if (result.rows.length === 0) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }

        const user = result.rows[0];

        // check if password is valid
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }

        // generate token
        const token = jwt.sign(
            { id: user.id, username: user.username },
            SECRET_KEY,

            //1year
            { expiresIn: '1y' }
        );

        // return user data
        return res.status(200).json({
            message: 'Login successful',
            user: { id: user.id, username: user.username, username: user.username },
            token
        });

    } catch (error) {
        console.error('Error in loginController', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};


module.exports = { loginController };
