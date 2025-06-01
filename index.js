const express = require('express')
const app = express();
const PORT = 3000;

const userRouter = require('./estrutura/user/userRouter.js');
const deckRouter = require('./estrutura/deck/deckRouter.js');

app.use (express.json({ limit: '10mb' }));

app.get('/', (req, res) => {
    res.send("Funcionando!");
});

app.listen(PORT, () => {
    console.log(`Aplicativo funcionando pela porta ${PORT}`);
})

app.use('/user', userRouter);
app.use('/deck', deckRouter);
