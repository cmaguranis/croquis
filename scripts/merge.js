const shell = require("shelljs");

const location = "C:/Users/cmagu/Desktop/croquis/";
const models = ["alysson", "jenb"];

models.forEach((model) => shell.mkdir("-p", `${location}/${model}`));

const folders = shell.exec(`ls ${location} | grep female`).split("\n");

folders
  .filter((folder) => !!folder)
  .forEach((folder) => {
    const listedModels = shell.ls(`${location}/${folder}`);

    models.forEach((model) => {
      if (listedModels.includes(model)) {
        const modelImages = shell.ls(`${location}/${folder}/${model}`);

        modelImages.forEach((image) => {
          shell.mv(
            `${location}/${folder}/${model}/${image}`,
            `${location}/${model}/${folder}__${image}`
          );
        });
      }
    });
  });
