import tmp from 'tmp'
import Cloudinary from 'cloudinary'
import fs from 'fs'
import path from 'path'

Cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
})

export default function videoUpload(req, res, next) {
  req.pipe(req.busboy);

  req.busboy.on('file', (fieldName, file, fileName) => {
    tmp.dir((err, tmpDirPath, cleanDir) => {
      if (err) {
        return next(err);
      }

      const filePath = path.join(tmpDirPath, fileName);
      const fileStream = fs.createWriteStream(filePath);
      const fileOptions = {
        resource_type: 'video',
        use_filename: true
      };

      file.pipe(fileStream);

      fileStream.on('close', () => {
        Cloudinary.v2.uploader.upload(
          filePath,
          fileOptions,
          (error, result) => {
            if (error) {
              return next(error);
            }

            res.send(result.public_id);
            fs.unlinkSync(filePath);
            cleanDir();
          });
      });
    });
  });
}
