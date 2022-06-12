import mongoose from 'mongoose';

const postSchema = mongoose.Schema(
  {
    body: {
      type: String,
      required: true,
    },
    imagePost: {
      type: Array,
      default: [],
    },
    postedBy: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
    likes: [String],
    comments: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'Comment',
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Post', postSchema);
