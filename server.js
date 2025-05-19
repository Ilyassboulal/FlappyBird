const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

//serve per utilizzare i file statici dalla cartella public
app.use(express.static(path.join(__dirname, 'public')));

// Rotta principale
app.get('/', (req, res) => {
  console.log("Richiesta ricevuta sulla rotta '/'");  // Debug per verificare la richiesta
  res.sendFile(path.join(__dirname, 'public', 'index.htm'));
});

app.listen(port, () => {
  console.log(`Server in esecuzione su http://localhost:${port}`);
});
