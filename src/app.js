const express = require('./express');
const app = express();
require('dotenv/config');
const PORT = process.env.PORT;

app.get('/user', (req, res) => {
  console.log('Success');
})
app.post('/user', (req, res) => {
  console.log('Created');
})
app.put('/user', (req, res) => {
  console.log('Updated');
})

app.post('/example/:id', (req, res) => {
  const id = req.params.id;
  const bodyData = req.body.name;
  const queryData = req.query.age;

  console.log('ID:', id, 'Body Data:', bodyData, 'Query Data:', queryData);

  res.end('Request data received!');
});

app.delete('/user', (req, res) => {
  console.log('Deleted');
})

app.listen(PORT, () => {
  console.log(`Server listen on PORT: ${PORT}`);
});