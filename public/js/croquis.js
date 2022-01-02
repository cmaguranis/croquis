var config = {
  randomize: true,
  models: [],
  sessions: [
    {
      seconds: 30,
      images: 6,
      delay: 1,
      break: 1 * 60,
      track: true,
    },
    {
      seconds: 1 * 60,
      images: 10,
      delay: 1,
      break: 1 * 60,
      track: true,
    },
    {
      seconds: 4 * 60,
      images: 2,
      delay: 1,
      break: 1 * 60,
      track: true,
    },
    {
      seconds: 8 * 60,
      images: 3,
      delay: 1,
      break: 0 * 60,
      track: true,
    },
  ],
};

const visitedImagesKey = "visitedImages";
var visitedImages = "";
var images = [];
var intervalId;
var imageIndex = 0;
var imageCount = 0;
var currentSessionIndex = 0;
var isDelay = false;
var wasStopped = false;
var imageIndexArray;
var elapsedBreakSeconds = 0;

const imageElement = document.getElementById("current-croquis-images");
const doneDiv = document.getElementById("done-div");
const startButton = document.getElementById("start-button");
const breakDiv = document.getElementById("break-countdown");
const sessionInfoDiv = document.getElementById("session-info");
function clearLocalstorage() {
  localStorage.clear(visitedImagesKey);
}

function httpGetAsync(theUrl, callback) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function () {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200) callback(xmlHttp.responseText);
  };
  xmlHttp.open("GET", theUrl, true); // true for asynchronous
  xmlHttp.send(null);
}

function handleImagesResponse(imagesJson) {
  const response = JSON.parse(imagesJson);
  images = response.images;

  // filter out visited images
  visitedImages = localStorage.getItem(visitedImagesKey);

  if (visitedImages) {
    var visitedImagesList = visitedImages.split(",");

    images = images.filter((image) => !visitedImagesList.includes(image));
  } else {
    // initialize localstorage value
    visitedImages = "";
  }

  imageIndexArray = new Uint32Array(images.length);
  if (config.randomize) {
    window.crypto.getRandomValues(imageIndexArray);
    imageIndexArray = imageIndexArray.map((v) => Math.floor(`0.${v}` * (images.length - 1)));
  } else {
    imageIndexArray.forEach((_, index) => (imageIndexArray[index] = index));
  }
}

function delay() {
  const currentSession = config.sessions[currentSessionIndex];
  isDelay = false;
  imageElement.src = "";
  intervalId = setInterval(croquis, currentSession.delay * 1000);
}

function nextImage() {
  const currentSession = config.sessions[currentSessionIndex];
  isDelay = true;

  // remove the current image so we don't see it again in this session
  const currentImageIndex = imageIndexArray[imageIndex];
  images.splice(currentImageIndex, 1);

  let newImage = images[currentImageIndex];

  if (currentSession.track) {
    var visitedImagesList = visitedImages.split(",");
    if (visitedImagesList.includes(newImage)) {
      imageIndex = imageIndex + 1;
      newImage = images[imageIndexArray[imageIndex]];
      images.splice(imageIndexArray[imageIndex], 1);
    }

    if (visitedImages.length) {
      // save visited image so we don't see it again across sessions
      visitedImages = `${visitedImages},${newImage}`;
    } else {
      visitedImages = `${newImage}`;
    }
    localStorage.setItem(visitedImagesKey, visitedImages);
  }

  imageElement.src = `images/${newImage}`;

  imageCount = imageCount + 1;
  imageIndex = imageIndex + 1;

  // new session set
  if (imageCount > currentSession.images) {
    currentSessionIndex = currentSessionIndex + 1;
    imageCount = 0;

    sessionInfoDiv.innerText = JSON.stringify(config.sessions[currentSessionIndex], null, 2);

    // take a break
    imageElement.src = "";
    startBreak();
  } else {
    intervalId = setInterval(croquis, currentSession.seconds * 1000);
  }
}

function nextBreak() {
  const breakDuration = config.sessions[currentSessionIndex].break;
  if (elapsedBreakSeconds >= breakDuration) {
    breakDiv.innerText = "";
    croquis();
  } else {
    elapsedBreakSeconds = elapsedBreakSeconds + 1;
    breakDiv.innerText = `Break: ${breakDuration - elapsedBreakSeconds}`;
  }
}

function startBreak() {
  elapsedBreakSeconds = 0;
  breakDiv.innerText = `Break: ${config.sessions[currentSessionIndex].break}`;
  intervalId = setInterval(nextBreak, 1000);
}

function croquis() {
  clearInterval(intervalId);

  if (currentSessionIndex >= config.sessions.length) {
    // croquis done
    stopCroquis();
  } else {
    if (isDelay) {
      delay();
    } else if (imageIndex >= images.length) {
      // less images than session needed, halt croquis
      stopCroquis();
    } else {
      nextImage();
    }
  }
}

function startCroquis() {
  if (intervalId) {
    clearInterval(intervalId);
  }

  if (wasStopped) {
    imageIndex = 0;
    imageCount = 0;
    currentSessionIndex = 0;
    isDelay = false;
    wasStopped = false;
  }

  sessionInfoDiv.innerText = JSON.stringify(config.sessions[currentSessionIndex], null, 2);
  doneDiv.style.visibility = "hidden";

  intervalId = setInterval(croquis, 500);
}

function pauseCroquis() {
  clearInterval(intervalId);
  elapsedBreakSeconds = 0;
}

function stopCroquis(clear = false) {
  if (clear) {
    clearInterval(intervalId);
  }

  wasStopped = true;

  breakDiv.innerText = "";
  elapsedBreakSeconds = 0;
  imageElement.src = "";
  doneDiv.style.visibility = "visible";
  startButton.style.visibility = "visible";
}

function skipImage() {
  clearInterval(intervalId);
  imageElement.src = "";
  nextImage();
}

var url = "/imagelist";

if (config.models.length > 0) {
  url = `${url}?models=${config.models.toString()}`;
}

httpGetAsync(url, handleImagesResponse);
