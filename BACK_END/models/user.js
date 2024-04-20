import mongoose from "mongoose";
import mongooseUniqueValidator from "mongoose-unique-validator";
// on specifie la dbb que l'on souhaite utiliser
const userCinetechDb = mongoose.connection.useDb("userCinetech");
// on créer un shéma user
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
            required: true,
        },
        city: {
            type: String,
            required: true,
        },
        favoris: {
            type: Array,
            required: false,
        },
        aVoir: {
            type: Array,
            required: false,
        },
        dejaVu: {
            type: Array,
            required: false,
        }
    }
)

// ajout du plugin mongoose-unique-validator
userSchema.plugin(mongooseUniqueValidator)

const userModel = userCinetechDb.model("User", userSchema)
export default userModel