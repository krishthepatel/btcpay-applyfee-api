
import express from 'express';

// initialize router
const router = express.Router();

// routes
// get
router.get('/', async (req, res) => {
    res.send('Your server is ready!');
});

// post
router.post('/', async (req, res) => {
    try {
        res.send('Server POST request')
    } catch(err) {
        res.send(err)
    }
});


// patch
router.patch('/', async (req, res) => {

});

// put
router.put('/', async (req, res) => {

});

// delete
router.delete('/', async (req, res) => {

});


export default router;
