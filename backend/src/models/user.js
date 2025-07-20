import mongoose from "mongoose"

const userSchema= new mongoose.Schema({
name: {
    type: String,
    required: true,
    minlength: 2
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    },
  profilepic:{
    type: String,
    default:"",
  }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;