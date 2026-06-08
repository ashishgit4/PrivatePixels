const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    imageUrl: {
      type: String,
      required: true,
    },
    imageFileId: {
      type: String,
      required: true,
    },
    caption: {
      type: String,
      default: '',
      maxlength: 2200,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Post', postSchema);
