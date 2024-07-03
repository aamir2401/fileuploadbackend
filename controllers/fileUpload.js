const File = require('../models/File')


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
