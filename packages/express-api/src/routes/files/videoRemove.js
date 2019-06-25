import Cloudinary from 'cloudinary'

Cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
})

export default function videoRemove(req, res, next) {
  const publicId = req.body.publicId;

  if (!publicId) {
    return next(new Error('The field "Public ID" is required.'));
  }

  Cloudinary.v2.uploader.destroy(
    publicId,
    {
      resource_type: 'video'
    },
    (error, result) => {
      if (error) {
        return next(error);
      } else if (result.result && result.result === 'ok') {
        res.json({
          message: 'File successfully deleted'
        });
      }
    });
}
