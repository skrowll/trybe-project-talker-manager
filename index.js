const express = require('express');
const bodyParser = require('body-parser');
const { readContentFile } = require('./helpers/readWriteFile');

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const HTTP_NOTFOUND_STATUS = 404;
const PORT = '3000';

const talkersDbFile = 'talker.json'; 

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.get('/talker', async (_req, res) => {
  const talkers = await readContentFile(talkersDbFile);
  if (!talkers) {
    res.status(HTTP_OK_STATUS).send([]);
  }
  res.status(HTTP_OK_STATUS).send(talkers);
});

app.get('/talker/:id', async (req, res) => {
  const { id } = req.params;
  const talkers = await readContentFile(talkersDbFile);
  const talker = talkers.find((element) => Number(element.id) === Number(id));
  if (!talker) {
    res.status(HTTP_NOTFOUND_STATUS).send({ message: 'Pessoa palestrante não encontrada' });
  }
  res.status(HTTP_OK_STATUS).send(talker);
});

app.all('*', (req, res) => res.status(404).json({ message: `Rota '${req.path}' não existe!` }));

app.listen(PORT, () => {
  console.log('Online');
});
