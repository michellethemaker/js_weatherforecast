// use Express to create web server
const express = require('express');
const app = express();
const port = 3000;  // Choose any port

// all static files (html, js, css) should be in 'public' folder
app.use(express.static('public')); 

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
