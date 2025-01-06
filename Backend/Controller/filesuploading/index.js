import multerS3 from 'multer-s3';
import { S3Client } from '@aws-sdk/client-s3';
import multer from 'multer';
import dotenv from 'dotenv';
dotenv.config();
const s3 = new S3Client({
    region: process.env.S3_REGION,
    credentials: {
        accessKeyId: process.env.ACCESS_KEY,
        secretAccessKey: process.env.SECRET_KEY
    }
});
const myBucketName = process.env.S3_BUCKET_NAME;

export const uploadImage = multer({
    storage: multerS3({
        s3: s3,
        bucket: myBucketName,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key: function (req, file, cb) {
            cb(null, Date.now() + '-' + file.originalname);
        }
    })
});

export const imageUploadControllerWeb = (req, res) => {
    console.log("image path : ", req.file.location);
};