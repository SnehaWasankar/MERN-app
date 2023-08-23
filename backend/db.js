const mongoose = require('mongoose');
mongoose.set('strictQuery', true);
//const mongoURI = 'mongodb+srv://gofood:Sneha123@cluster0.r1gq8rz.mongodb.net/gofoodmern?retryWrites=true&w=majority'

const mongoURI = 'mongodb://gofood:Sneha123@ac-10l8ffk-shard-00-00.r1gq8rz.mongodb.net:27017,ac-10l8ffk-shard-00-01.r1gq8rz.mongodb.net:27017,ac-10l8ffk-shard-00-02.r1gq8rz.mongodb.net:27017/gofoodmern?ssl=true&replicaSet=atlas-aeyj51-shard-0&authSource=admin&retryWrites=true&w=majority'

const mongoDB = async () => {
    await mongoose.connect(mongoURI, { useNewUrlParser: true }, async (err, result) => {
        if (err) console.log("----", err);
        else {
            console.log("connected!");

            //to connect it to the collection
            const fetched_data = await mongoose.connection.db.collection("food_items");

            fetched_data.find({}).toArray(async function (err, data) {
                const foodCategory = await mongoose.connection.db.collection("foodCategory");
                foodCategory.find({}).toArray(function (err, catData) {
                    if (err) console.log(err);
                    else {
                        global.food_items = data; //global variable
                        global.foodCategory = catData;
                        //console.log(global.food_items); //data
                    }
                })
            });

        }
    });
};

module.exports = mongoDB;



//the await keyword is used within an async function to wait for the asynchronous operations, like connecting to the database and fetching data, to complete before continuing with the next lines of code