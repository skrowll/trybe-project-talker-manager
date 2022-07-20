const express = require('express');
const bodyParser = require('body-parser');
const { readContentFile, writeContentFile } = require('./helpers/readWriteFile');
const { generateToken } = require('./helpers/tokenGenerator');
const {
  loginValidation,
  tokenValidation,
  nameValidation,
  ageValidation,
  talkValidation,
  watchedAtValidation,
  rateValidation,
} = require('./middlewares/validations');

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

app.post('/login', loginValidation, (_req, res) => {
  const token = generateToken(16);
  res.status(HTTP_OK_STATUS).json({ token });
});

app.post('/talker',
  tokenValidation,
  nameValidation,
  ageValidation,
  talkValidation,
  watchedAtValidation,
  rateValidation,
  async (req, res) => {
  const { name, age, talk: { watchedAt, rate } } = req.body;
  const talkers = await readContentFile(talkersDbFile);
  const newTalker = {
    name,
    age,
    id: talkers.length + 1,
    talk: {
      watchedAt,
      rate,
    },
  };
  await writeContentFile(talkersDbFile, newTalker);

  res.status(201).json(newTalker);
});

app.put('/talker/:id',
tokenValidation,
nameValidation,
ageValidation,
talkValidation,
watchedAtValidation,
rateValidation,
async (req, res) => {
const { id } = req.params;
const { name, age, talk: { watchedAt, rate } } = req.body;
const talkers = await readContentFile(talkersDbFile);
const index = talkers.findIndex((talker) => Number(talker.id) === Number(id));
talkers[index] = { name, age, id: Number(id), talk: { watchedAt, rate } };
await writeContentFile(talkersDbFile, talkers[index]);

res.status(HTTP_OK_STATUS).json(talkers[index]);
});

app.all('*', (req, res) => {
  res.status(HTTP_NOTFOUND_STATUS).json({ message: `Rota '${req.path}' não existe!` });
});

app.listen(PORT, () => {
  console.log('Online');
});
