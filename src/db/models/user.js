import { model, Schema } from 'mongoose';

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, },
    password: { type: String, required: true, },
    avatarUrl: { type: String, default: null, },
    description: { type: String, default: "", },
    articlesAmount: { type: Number, default: 0, },
    savedStories: [
      {
        type: Schema.Types.ObjectId,
        ref: 'story',
        default: [],
      }
    ],
  },
  { timestamps: true, versionKey: false }
);

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export const UsersCollection = model('user', userSchema);
