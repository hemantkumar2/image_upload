const express = require("express");
const { cloudinary } = require("./utils/cloudinary");

const app = express();
const cors = require("cors");

app.use(express.static("public"));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cors());

app.get("/api/images", async (req, res) => {
  const { resources } = await cloudinary.search
    .expression("resource_type:image")
    .sort_by("public_id", "desc")
    .max_results(30)
    .execute();
  const imageData = resources.map((file) => {
    return { url: file.url, id: file.public_id };
  });
  console.log(imageData);
  res.json({ imageData });
});

app.post("/api/upload", async (req, res) => {
  try {
    const fileStr = req.body.data;
    const uploadResponse = await cloudinary.uploader.upload(fileStr, {
      upload_preset: "dev_setup",
    });
    console.log(uploadResponse);
    res.json({ msg: "Successfully uploaded the file!" });
  } catch (error) {
    console.error(error);
    res.json({ msg: "Something went wrong!" });
  }
});

port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`app is running at the port ${port}`);
});
