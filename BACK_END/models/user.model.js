import mongoose from "mongoose";
import mongooseUniqueValidator from "mongoose-unique-validator";

const userSchema = mongoose.Schema(
    {
        username: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        city: { type: String, required: true },
    }
)

userSchema.plugin(mongooseUniqueValidator)
const userModel = mongoose.model("User", userSchema)
export default userModel