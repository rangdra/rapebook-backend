import mongoose from 'mongoose';

const commentSchema = mongoose.Schema(
  {
    comment: {
      type: String,
      required: true,
    },
    commentBy: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Comment', commentSchema);
