const cloudinary = require('cloudinary').v2;
const fs = require('fs');

cloudinary.config({
    cloud_name: 'da2tzgaip',
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});


// const uploadonCloudinary = async (localFilePath) => {
//     try {
//         if (!localFilePath) return null
//         // upload on Clouidinary
//         const response = await cloudinary.uploader.upload(localFilePath, {
//             resource_type: 'auto'
//         })
//         // file has been uploaded successfully
//         console.log('file has been uploaded successfully', response);
//         return response;
//     } catch (error) {
//         fs.unlinkSync(localFilePath) // remove the locally saved temporary file as execution was failed
//         return null
//     }
// }

module.exports = cloudinary;