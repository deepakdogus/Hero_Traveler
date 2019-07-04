import Cloudinary from 'cloudinary'

export default function videoUpload(req, res, next) {
  const body = req.body;

  if (!body) {
    next(new Error('Body param\'s is required.'))
  }

  let signature = Cloudinary.utils.api_sign_request(req.body, process.env.CLOUDINARY_SECRET);

  res.json({
    signature
  });
}
