module.exports = function (req, res) {
  // Import the configuration file.
  const config = require("../config");
  
  // Import the filesystem module.
  const fs = require("fs");
  
  // Construct the file path key based on the service parameter from the request.
  const filePathKey = req.params.service + "filepath";
  
  // Check if the file path exists in the configuration and is defined.
  if (config[filePathKey] && config[filePathKey] != undefined) {
    const filePath = config[filePathKey];
    
    // Get the file statistics to determine its size.
    const fileStats = fs.statSync(filePath);
    const fileSize = fileStats.size;
    
    // Set the response headers for the audio file.
    res.writeHead(200, {
      "Content-Length": fileSize,
      "Content-Type": "audio/mpeg"
    });
    
    // Create a read stream for the file and pipe it to the response.
    fs.createReadStream(filePath).pipe(res);
  } else {
    // If the service is invalid, send an error response.
    return res.status(200).json({
      error: "Bad service."
    });
  }
};
