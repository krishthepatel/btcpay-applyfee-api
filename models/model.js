
// dependencies
import mongoose from 'mongoose';

const schema = new mongoose.Schema({
    // define Schema here
})

// export the created Schema
const Model = mongoose.model('Schema', schema);

export default Model;
