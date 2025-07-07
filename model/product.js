import { Schema, model } from "mongoose";

const productSchema = new Schema({
    name: {
        type: String,
        required: true,
        length: {
            min: 3,
            max: 50
        }
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    images: {
        type: [String],
        required: true,
        validate: {
            validator: function(v) {
                return v.length > 0;
            },
            message: "At least one image is required"
        }
    },

});
const Product = model("Product", productSchema);
export default Product;