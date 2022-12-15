import { Schema, model, models } from 'mongoose';

const UserSchema = new Schema({
  name: String,
  email: String,
});

const UserModel = models.User || model('User', UserSchema);

export default UserModel;
