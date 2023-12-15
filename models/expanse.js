const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const expanseSchema = new Schema({
    amt : {
        type: Number,
        required: true
    },

    des : 
    {
        type: String,
        required: true
    },
    cat: {
        type : String,
        required: true
    },
    date:{
        type: Date,
        defaultValue : new Date()
    },

    userId:{
        type: Schema.Types.ObjectId,
        ref: 'Users',
        required: true
      }

})



module.exports = mongoose.model('Expanse',expanseSchema);
