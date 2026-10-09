import mongoose from 'mongoose';

const recordSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  version: {
    type: Number,
    required: true,
    default: 1
  }
});

const Record = mongoose.model('Record', recordSchema);

export default Record;
