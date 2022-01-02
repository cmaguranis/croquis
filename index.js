const express = require("express");
const fs = require("fs");
const whiskers = require("whiskers");

const app = express();
const port = 3000;

app.engine(".html", whiskers.__express);
app.set("views", __dirname + "/views");

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index.html");
});

app.get("/imagelist", (req, res) => {
  const models = req.query.models;

  const rootImageDirectory = `${__dirname}\\public\\images`;
  let images = [];
  const allModels = fs.readdirSync(rootImageDirectory);

  let availableModels = allModels;

  if (models) {
    availableModels = allModels.filter((model) => models.includes(model));

    // if no requested models are in the images folder, return all available models
    if (!availableModels.length) {
      availableModels = allModels;
    }
  }

  availableModels.forEach((model) => {
    const modelImages = fs.readdirSync(`${rootImageDirectory}\\${model}`);
    const modelImagePaths = [];
    modelImages.forEach((image) => modelImagePaths.push(`${model}/${image}`));

    images = [...images, ...modelImagePaths];
  });

  res.json({ images });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
