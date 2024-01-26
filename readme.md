## Topic 4: Creating a Web Server in Node.js

### 1. Importing Necessary Modules

```jsx
const http = require("http");
const path = require("path");
const fs = require("fs");
const fsPromise = require("fs").promises;

```

**Explanation:** Import essential Node.js modules for handling HTTP requests, working with file paths, and managing the file system.

### 2. Setting Constants and Environment Variables

```jsx
const url = "localhost";
const PORT = process.env.PORT || 3000;

```

**Explanation:** Defines constants for the server's URL and sets the port number, allowing flexibility through environment variables.

### 3. Async File Reading Function

```jsx
const writeFun = async (filePath, myContent, res) => {
  try {
    const data = await fsPromise.readFile(filePath, "utf8");
    res.writeHead(200, {
      "content-Type": myContent,
    });
    res.end(data);
  } catch (err) {
    console.log(err);
    res.statusCode = 500;
    res.end();
  }
};

```

**Explanation:** Asynchronous function for reading file content. Handles different content types and sets appropriate HTTP response headers. In case of an error, logs it, sets a 500 status code, and ends the response.

### 4. Creating an HTTP Server

```jsx
const server = http.createServer((req, res) => {
  console.log(req.url, req.method);

  let extension = path.extname(req.url);

  let myContent;
  switch (extension) {
    // ... (cases for different file extensions)
  }
  // ... (rest of the code)
});

```

**Explanation:** Initiates an HTTP server using the `createServer` method, providing a callback function to handle incoming requests. Logs the requested URL and HTTP method.

### 5. Handling Requests

```jsx
let extension = path.extname(req.url);

```

**Explanation:** Determines the file extension of the requested resource.

### 6. Content Type Mapping

```jsx
let myContent;
switch (extension) {
  // ... (cases for different file extensions)
}

```

**Explanation:** Maps file extensions to their corresponding content types, facilitating proper setting of HTTP response headers.

### 7. Determining File Paths

```jsx
let filePath = // ... (based on URL and content type)

```

**Explanation:** Constructs the file path based on the requested URL and content type, addressing special cases like the root URL ("/") and trailing slashes.

### 8. Checking File Existence

```jsx
let fileExists = fs.existsSync(filePath);

```

**Explanation:** Verifies if the requested file exists on the server.

### 9. Handling Existing Files

```jsx
if (fileExists) {
  writeFun(filePath, myContent, res);
} else {
  // ... (handles redirects and 404 error)
}

```

**Explanation:** If the file exists, calls `writeFun` to send the file content in the HTTP response. If not, manages redirects and serves a custom 404 page.

### 10. Handling Redirects and 404 Errors

```jsx
switch (path.parse(filePath).base) {
  case "old-page.html":
    res.writeHead(301, {
      location: "/new-page.html",
    });
    res.end();
    break;
  case "www-page.html":
    res.writeHead(301, {
      location: "/",
    });
    res.end();
    break;
  default:
    writeFun(path.join(__dirname, "views", "404.html"), myContent, res);
}

```

**Explanation:** Manages specific redirects (e.g., from "old-page.html" to "new-page.html") and provides a custom 404 page for unrecognized paths.

### 11. Server Listening

```jsx
server.listen(PORT, () => {
  console.log(`http://${url}:${PORT}`);
});

```

**Explanation:** Makes the server listen on the specified port, logging the server's URL upon start.

### Real-world Examples:

- **CSS File Request:**
    - Suppose a request is made to `http://localhost:3000/styles.css`. The server identifies it as a CSS file and serves the content with the appropriate headers.
- **Nonexistent Page Request:**
    - If a request is made to `http://localhost:3000/nonexistent-page`, the server responds with a 404 error, serving a custom 404 page.

This breakdown helps you understand each part of the code and its functionality, making it adaptable for building a web server in Node.js.