import { model, Schema } from 'mongoose';

const storiesSchema = new Schema(
  {
    img: { type: String, required: true },
    title: { type: String, required: true, trim: true },
    article: { type: String, required: true },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'categories',
      required: true,
    },
    ownerId: { type: Schema.Types.ObjectId, ref: 'user', required: true },
    favoriteCount: { type: Number, default: 0 },
  },
  { timestamps: true, versionKey: false },
);

export const StoryCollection = model('story', storiesSchema);
