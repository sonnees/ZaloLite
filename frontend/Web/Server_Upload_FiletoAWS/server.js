import express from 'express';
import multer from 'multer';
import AWS from 'aws-sdk';
import dotenv from 'dotenv';
import path from 'path';
import cors from 'cors'; // Import cors middleware

dotenv.config();

// Cấu hình AWS
AWS.config.update({
  region: process.env.REGION,
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
});

const s3 = new AWS.S3();
const dynamodb = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.DYNAMO_TABLE_NAME;

const app = express();
const PORT = 4000;

// Định cấu hình Multer
const storage = multer.memoryStorage();

const upload = multer({
  storage
});

// Sử dụng middleware cors để cho phép yêu cầu từ các domain khác
app.use(cors());

// Endpoint để upload file lên S3
app.post('/upload', upload.single('file'), (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).send('No file uploaded.');
  }

  const fileName = file.originalname;

  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: fileName,
    Body: file.buffer,
    ContentType: file.mimetype,
    // ACL: 'public-read',
  };

  s3.upload(params, (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error uploading file.');
    }
    res.status(200).json({
      fileUrl: data.Location
    });
    console.log(data.Location);
  });
});

// Endpoint để xoá file trên S3
app.delete('/delete/:fileName', (req, res) => {
  const fileName = req.params.fileName;

  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: fileName,
  };

  s3.deleteObject(params, (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error deleting file.');
    }
    res.status(200).send('File deleted successfully.');
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});