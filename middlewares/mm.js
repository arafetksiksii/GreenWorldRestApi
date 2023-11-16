import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';


const useCloudinary = process.env.USE_CLOUDINARY === 'true'; // Add this line

let upload;

if (useCloudinary) {
  // Use Cloudinary storage if the flag is set
  const cloudinaryStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'pdm',
      format: async (req, file) => 'png',
      public_id: (req, file) => `${Date.now()}_${file.originalname}`,
    },
  });

  upload = multer({ storage: cloudinaryStorage });
} else {
  // Use local storage if the flag is not set
  upload = multer({
    storage: multer.diskStorage({
      destination: (req, file, callback) => {
        callback(null, join(__dirname, "../public/images"));
      },
      filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');
        callback(null, name + Date.now());
      },
    }),
  });
}

export default upload;
