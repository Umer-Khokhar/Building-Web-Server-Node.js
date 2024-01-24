const http = require("http");
const path = require("path");
const fs = require("fs");
const { send } = require("process");
const fsPromise = require("fs").promises;
const logEvent = require('./logEvents');

const eventEmitter = require('events');
const { log } = require("console");

class MyEmitter extends eventEmitter {}

const mylogs = new MyEmitter()

const url = "localhost";
const PORT = process.env.PORT || 3000;
mylogs.on('log',(msg, files) => {
  logEvent(msg, files)
})

const writeFun = async (filePath, myContent, res) => {
  let imagefilePath = myContent.includes('image') ? '' : 'utf8'
  try {
    const rawData = await fsPromise.readFile(filePath, imagefilePath);
    const data = myContent === 'application/json' ? JSON.parse(rawData) : rawData
    res.writeHead(
      filePath.includes('404.html') ? 404 : 200, 
    {
      "content-Type": myContent,
    }
    );
    res.end(
      myContent === 'application/json' ? JSON.stringify(data) : data
    );
  } catch (err) {
    mylogs.emit('log', `${err.name}: ${err.message}`, 'errorLog.txt')
    res.statusCode = 500;
    res.end();
  }
};

const server = http.createServer((req, res) => {
  console.log(req.url, req.method);
  mylogs.emit('log', `${req.url}: ${req.method}`, 'requestLog.txt')

  let extension = path.extname(req.url);

  let myContent;
  switch (extension) {
    case ".css":
      myContent = "text/css";
      break;
    case ".js":
      myContent = "text/javascript";
      break;
    case ".json":
      myContent = "application/json";
      break;
    case ".png":
      myContent = "image/png";
      break;
    case ".jpg":
      myContent = "image/jpeg";
      break;
    case ".mp3":
      myContent = "audio/mpeg";
      break;
    case ".txt":
      myContent = "text/plain";
      break;
    default:
      myContent = "text/html";
  }

  let filePath =
    myContent === "text/html" && req.url === "/"
      ? path.join(__dirname, "views", "index.html")
      : myContent === "text/html" && req.url.slice(-1) === "/"
      ? path.join(__dirname, "views", req.url, "index.html")
      : myContent === "text/html"
      ? path.join(__dirname, "views", req.url)
      : path.join(__dirname, req.url);

  if (!extension && req.url.slice(-1) !== "/") {
    filePath += ".html";
  }

  let fileExists = fs.existsSync(filePath);

  if (fileExists) {
    writeFun(filePath, myContent, res);
  } else {
    switch (path.parse(filePath).base) {
      case "old-page.html":
        res.writeHead(301, {
          location: "/new-page.html",
        });
        res.end();
        break;
      case "www-page.html":
        res.writeHead(301, {
          'location': "/",
        });
        res.end();
        break;
      default:
        writeFun(path.join(__dirname, "views", "404.html"), myContent, res);
    }
  }
});

server.listen(PORT, () => {
  console.log(`http://${url}:${PORT}`);
});
