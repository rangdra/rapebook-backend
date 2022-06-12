import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    pic: {
      type: String,
      default:
        'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y',
    },
    cover: {
      type: String,
      default:
        'https://res.cloudinary.com/rangdradev/image/upload/v1654518760/no-image-icon-6_pkg9ma.png',
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    livesIn: {
      type: String,
    },
    workAt: {
      type: String,
    },
    bio: {
      type: String,
    },
    savedPosts: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'Post',
      },
    ],
    followers: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'User',
      },
    ],
    following: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);
