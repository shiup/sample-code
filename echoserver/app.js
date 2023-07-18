// make sure you install express
//  - npm install express

const express = require('express');
const app = express();
const port = 3003;

app.use(express.json());

app.all('*', (req, res) => {
  console.log('Received HTTP Request:', req.method, req.url);
  console.log('Request Headers:', req.headers);
  console.log('Request Body:', req.body);

  const exampleResponse = {
    request: {
      method: req.method,
      url: req.url,
      headers: req.headers,
      body: req.body
    }
  };

  res.status(200).json(exampleResponse);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
