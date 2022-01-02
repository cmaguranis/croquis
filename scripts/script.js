const shell = require("shelljs");

const root = "C:/Users/cmagu/Downloads/Chainsaw Man";
let folders = [];

shell.ls(root).forEach((folder) => folders.push(`${folder}`));

folders.forEach((folder) => {
  const splitfolder = folder.split(". ");
  const chapterNumber = splitfolder[1];
  const pages = shell.ls(`${root}/${folder}/*.png`);

  pages.forEach((page) => {
    const pagefilename = page.split("/")[6];

    shell.cp(page, `${root}/ch${chapterNumber}_p${pagefilename}`);
  });
});

const models = [
  { selector: "gallery-1", name: "alysson" },
  { selector: "gallery-2", name: "aubrey" },
  { selector: "gallery-4", name: "barbara" },
  { selector: "gallery-6", name: "courtney" },
  { selector: "gallery-7", name: "gabrielle" },
  { selector: "gallery-8", name: "heather" },
  { selector: "gallery-10", name: "jaynie" },
  { selector: "gallery-9", name: "jazmine" },
  { selector: "gallery-13", name: "kristina_marie" },
  { selector: "gallery-14", name: "lauren" },
  { selector: "gallery-15", name: "lola" },
  { selector: "gallery-16", name: "madeline" },
  { selector: "gallery-18", name: "margaret" },
  { selector: "gallery-21", name: "rhus" },
  { selector: "gallery-22", name: "roxanne" },
  { selector: "gallery-23", name: "simone" },
  { selector: "gallery-24", name: "tshaw" },
  { selector: "gallery-26", name: "wendy" },
];

models.forEach((model, index) => {
  const modelGallery = document.getElementById(model.selector);
  const imageNames = [];
  modelGallery.childNodes.forEach((subEl) => {
    if (subEl.childNodes.length > 0) {
      imageNames.push(subEl.children[0].children[0].href.split("/").reverse()[0]);
    }
  });
  models[index].imageNames = imageNames;
});

JSON.stringify(models);
