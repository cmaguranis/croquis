const models = require("../blah");
const shell = require("shelljs");

const location = "C:\\Users\\cmagu\\Desktop\\croquis\\female_seated";

const files = shell.exec(`ls -p ${location} | grep -v '/'`, { silent: true }).split("\n");

models.forEach((model) => {
  shell.mkdir("-p", `${location}\\${model.name}`);
  model.imageNames.forEach((imageName) => {
    if (files.includes(imageName)) {
      shell.mv(`${location}\\${imageName}`, `${location}/${model.name}`);
    }
  });
});
