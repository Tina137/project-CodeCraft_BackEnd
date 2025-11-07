import mongoose from 'mongoose';
import { Schema } from 'mongoose';

const storySchema = new Schema(
  {
    img: { type: String },
    title: {
      type: String,
      required: true,
    },
    article: {
      type: String,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'category',
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: 'users',
    },
    favoriteCount: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const Story = mongoose.model('Story', storySchema);
