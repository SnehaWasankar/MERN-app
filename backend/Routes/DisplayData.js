const express = require('express')
const router = express.Router()

//to send the data to the frontend
router.post('/foodData', (req, res) => {
    try {
        //console.log(global.food_items)
        res.send([global.food_items, global.foodCategory])
    } catch (error) {
        console.error(error.message);
        res.send("Server Error");
    }
})


module.exports = router;