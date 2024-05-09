const router = require('express').Router()
const db = require("../models")
const bcrypt = require('bcrypt')
const jwt =require('jsonwebtoken')

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

        // Password matches, generate JWT token
        const token = await jwt.sign({ id: user.userId }, process.env.JWT_SECRET);

        // Return user data and token
        res.json({ user, token });
    } catch (error) {
        console.error('Error during authentication:', error);
        res.status(500).json({ 
            message: `An error occurred during authentication` 
        });
    }
});



router.get('/profile', async (req, res) => {
    try {
        // Split the authorization header into [ "Bearer", "TOKEN" ]:
        const [authenticationMethod, token] = req.headers.authorization.split(' ')

        // Only handle "Bearer" authorization for now 
        //  (we could add other authorization strategies later):
        if (authenticationMethod == 'Bearer') {

            // Decode the JWT
            const result = await jwt.decode(process.env.JWT_SECRET, token)

            // Get the logged in user's id from the payload
            const { id } = result.value

            // Find the user object using their id:
            let user = await User.findOne({
                where: {
                    userId: id
                }
            })
            res.json(user)
        }
    } catch {
        res.json(null)
    }
})







module.exports = router




 




  

  

