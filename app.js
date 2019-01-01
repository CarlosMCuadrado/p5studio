const fs = require("fs");
const chalk = require("chalk");
var inquirer = require("inquirer");

// The folder of the current version of the application

/*
	 =========================================
	 IMAGES
	   =========================================
	   */

var imagesObj = [];
fs.readdir("images", (err, files) => {
  files.forEach(file => {
    // CLEAN UP THE DATA!

    if (file !== ".DS_Store") {
      // let fileWithoutExtension = file.substring(0, file.indexOf('.'));

      let fileWithoutExtension = file;
      imagesObj.push(file);
    }
  });
  imagesTemp = JSON.stringify(imagesObj);
  // console.log("generatesimagesTemp);

  const dir = "data";

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  fs.writeFile("data/images.json", imagesTemp, function(err) {
    if (err) {
      return console.log(err);
    }

    console.log("ImageList saved!");
  });
});

/* 
Read the skecthes-folder and generate a JSON-file. 
The JSON-file will generate the list of skectehs in 
index.html
*/

const source = "sketches";

const { lstatSync, readdirSync } = require("fs");
const { join } = require("path");

const isDirectory = source => lstatSync(source).isDirectory();
const getDirectories = source =>
  readdirSync(source)
    .map(name => join(source, name))
    .filter(isDirectory);

const directories = getDirectories(source);

/**
 * Ask for the sketchfolder
 **/

let folderName;

inquirer
  .prompt([
    {
      type: "list",
      name: "sketchfolder",
      message: "Which sketchfolder is the one you wanna use?",
      choices: directories
    }
  ])
  .then(answers => {
    foldername = answers.skecthfolder;

    /**
     * END Ask for the skecthfolder
     **/

    const onlyFolderNames = directories.map(foldername =>
      foldername.replace(source + "/", "")
    );

    const folderPath = "./sketches/" + folderName;

    const folderPathJs = folderPath + "/src/";

    const foldersToWatch = [
      folderPathJs + "ui/*.js",
      folderPathJs + "ui/components/*.js",
      folderPathJs + "*.js"
    ];

    const folderNamesStringified = JSON.stringify(onlyFolderNames);

    fs.writeFile("data/sketches.json", folderNamesStringified, function(err) {
      if (err) {
        return console.log(err);
      }

      console.log("SketchList saved!");
    });

    /* 
  Now create the index.html-file with the sketches as an HTML-list
*/

    const htmlTop = `
<!DOCTYPE html><html lang="en"><head><link rel="stylesheet" href="./style.css" /></head><body>
  <ul>
`;
    let htmlDirectoryList = [];

    onlyFolderNames.map(folder =>
      htmlDirectoryList.push(
        `<li><a href="sketches/${folder}">${folder}</a></li>`
      )
    );

    const htmlDirectoryListPureMarkup = htmlDirectoryList.reverse().join("");

    const htmlBottom = `
  </ul>
</body></html>
`;

    const markup = htmlTop + htmlDirectoryListPureMarkup + htmlBottom;

    fs.writeFile("index.html", markup, function(err) {
      if (err) {
        return console.log(err);
      }

      console.log("index.html saved!");
    });
  });
