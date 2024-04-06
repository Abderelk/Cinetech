import mongoose from "mongoose";
import mongooseUniqueValidator from "mongoose-unique-validator";
// spécification de la dbb à utiliser
const userCinetechDb = mongoose.connection.useDb("userCinetech");
// création du schéma user
const userSchema = mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },
        username: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: [true, "Password is required"],
        },
        city: {
            type: String,
            required: [true, "city is required"]
        },
    }
)
// ajout du plugin mongoose-unique-validator
userSchema.plugin(mongooseUniqueValidator)

const userModel = userCinetechDb.model("User", userSchema)
export default userModel