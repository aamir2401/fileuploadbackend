const { response } = require('express');
const File = require('../models/File')

const cloudinary = require("cloudinary").v2
//local file upload => handler functon;


exports.localFileUpload = async(req, res) => 
{
    try
    {
        //fetching files;
        const file = req.files.file;
        console.log("File fetched ", file);

        let path = __dirname + "/file/" + Date.now() + `.${file.name.split('.')[1]}`;
        console.log("path is given as: -->", path);
        file.mv(path, (err) =>
        {
            console.log("err in file uploading!!!",err)
        })
        res.json(
            {
                success: true,
                message: "successfully uploaded local file"
            }
        )
    }
    catch(err)
    {
        console.error(err)
    }
}
// creating function to upload file to cloudinary;
async function upload_To_cloudinary(file, folder)
{
      const option = {folder};
     return await cloudinary.uploader.upload(file.tempFilePath, option);
}






//creating handler for uploading file[images] to cloudinary;
async function checkFileExtension(ourSupportedType,typeOfreqExtension)
{
    return ourSupportedType.includes(typeOfreqExtension)
}

exports.imageUpload = async(req, res) =>
    {
        try {
         
            const {name, type, email} = req.body;
            console.log("NAME->",name,"type", type, "Email ->", email);

            const file = req.files.imageFile;
            console.log("Image file->", file);
            const ourSupportedType = ["jpeg", "png", "pdf","jpg"];
            const typeOfreqExtension = file.name.split('.')[1].toLowerCase()
            console.log("------------", typeOfreqExtension)

            //checking ourSupportedType == typeOfreqExtension;
            const checked = checkFileExtension(ourSupportedType,typeOfreqExtension);
            if(!checked)
                {
                    res.status(400).json(
                        {
                            success:false,
                            message:"File format not supported by our system",
                            message: error
                        }
                    )
                }


            // if we are here it means every thing is ok and now upload the got file to cloudinary;
            const response = await upload_To_cloudinary(file, "codewithAamir");
            console.log("response -->", response);
            res.status(200).json(
                {
                    success:true,
                    message1:"Hurrryyy!!",
                    message: "successfully uploaded to cloudinary",
                    imageUrl: response.secure_url
                }
            )


            //make an entry in mongoDB cluster
            const entry = await file.create(
                {
                    name,
                    type,
                    email,
                    imageUrl: response.secure_url
                }
            )
            console.log("dsbase", entry)
        } catch (error) {
            console.log("errrrrror", error)
        }
    }






    async function video_upload_to_cloudinary(video, folder) {
        const options = { folder, resource_type: "auto" };
        return await cloudinary.uploader.upload(video.tempFilePath, options);
    }
    
    async function compare_Function(weAreSupporting_this_types_Only, req_got_extension) {
        return weAreSupporting_this_types_Only.includes(req_got_extension);
    }
    
    exports.videoUpload = async (req, res) => {
        try {
            const { name, videoType, email } = req.body;
            console.log("Name->", name, "videoType", videoType, "Email", email);
    
            if (!req.files || !req.files.videoUpload) {
                return res.status(400).json({
                    success: false,
                    message: "No video file uploaded!"
                });
            }
    
            const video = req.files.videoUpload;
            console.log("Video", video);
    
            const weAreSupporting_this_types_Only = ["mp4", "mov"];
            const req_got_extension = video.name.split('.').pop().toLowerCase();
            const checke = await compare_Function(weAreSupporting_this_types_Only, req_got_extension);
    
            if (!checke) {
                return res.status(400).json({
                    success: false,
                    message: "Unsupported media file type!"
                });
            }
    
            // Now we have to upload this media file to cloudinary
            const response = await video_upload_to_cloudinary(video, "codewithAamir");
            console.log("We got this as response uploading video", response);
    
            return res.status(200).json({
                success: true,
                message: "Video uploaded successfully",
                data: response
            });
    
        } catch (error) {
            console.error("Error uploading video:", error);
            return res.status(500).json({
                success: false,
                message: "Can't upload video to Cloudinary",
                error: error.message
            });
        }
    };
    




