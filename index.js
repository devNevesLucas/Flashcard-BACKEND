const express = require('express')
const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
    res.send("Funcionando!");
});

app.listen(PORT, () => {
    console.log(`Aplicativo funcionando pela porta ${PORT}`);
})