const router = require('express').Router()
const db = require("../models")
const bcrypt = require('bcrypt')

const { User } = db
  
router.post('/', async (req, res) => {
    try {
        const user = await User.findOne({
            where: { email: req.body.email }
        });

        if (!user) {
            return res.status(404).json({ 
                message: `Could not find a user with the provided email` 
            });
        }

        console.log('User found:', user);

        if (!req.body.password) {
            return res.status(400).json({ 
                message: `Password is missing in the request body` 
            });
        }

        console.log('Comparing passwords:', req.body.password, user.passwordDigest);

        const passwordMatch = await bcrypt.compare(req.body.password, user.passwordDigest);

        if (!passwordMatch) {
            return res.status(401).json({ 
                message: `Incorrect password` 
            });
        }

        res.json({ user });
    } catch (error) {
        console.error('Error during authentication:', error);
        res.status(500).json({ 
            message: `An error occurred during authentication` 
        });
    }
});



module.exports = router


  

  

