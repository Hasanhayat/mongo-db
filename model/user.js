import { model, Schema } from "mongoose";




const userSchrma = new Schema({
    name:{
        type: String,
        required: true,
        length: {
            min: 3,
            max: 20
        }
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    password:{
        type: String,
        length: {
            min: 6,
            max: 1024
        }
    },
});

const User = model("user", userSchrma);

export default User;