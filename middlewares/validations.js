const emailValidator = require('email-validator');

const loginValidation = (req, res, next) => {
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'O campo "email" é obrigatório' });
    }
    if (!emailValidator.validate(email)) {
      return res.status(400).json({ message: 'O "email" deve ter o formato "email@email.com"' });
    }
    if (!password) {
      return res.status(400).json({ message: 'O campo "password" é obrigatório' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'O "password" deve ter pelo menos 6 caracteres' });
    }
    next();
  };

  const tokenValidation = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ message: 'Token não encontrado' });
    }
    if (token.length !== 16) {
      return res.status(401).json({ message: 'Token inválido' });
    }
    next();
  };

  const nameValidation = (req, res, next) => {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'O campo "name" é obrigatório' });
    }
    if (name.length < 3) {
      return res.status(400).json({ message: 'O "name" deve ter pelo menos 3 caracteres' });
    }
    next();
  };

  const ageValidation = (req, res, next) => {
    const { age } = req.body;
    if (!age) {
      return res.status(400).json({ message: 'O campo "age" é obrigatório' });
    }
    if (age < 18) {
      return res.status(400).json({ message: 'A pessoa palestrante deve ser maior de idade' });
    }
    next();
  };

  const talkValidation = (req, res, next) => {
    const { talk } = req.body;
    if (!talk) {
      return res.status(400).json({ message: 'O campo "talk" é obrigatório' });
    }
    next();
  };

  const watchedAtValidation = (req, res, next) => {
    const { watchedAt } = req.body.talk;
    const dateRegex = /^([0-3]\d)\/([0-1]\d)\/(\d{4})/g;
    if (!watchedAt) {
      return res.status(400).json({ message: 'O campo "watchedAt" é obrigatório' });
    }
    if (!dateRegex.test(watchedAt)) {
      return res.status(400)
        .json({ message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"' });
    }
    next();
  };

  const rateValidation = (req, res, next) => {
    const { rate } = req.body.talk;
    if (!rate && rate !== 0) {
        return res.status(400).json({ message: 'O campo "rate" é obrigatório' });
    }
    if (rate < 1 || rate > 5) {
        return res.status(400).json({ message: 'O campo "rate" deve ser um inteiro de 1 à 5' });
    }
    next();
  };

  module.exports = {
    loginValidation,
    tokenValidation,
    nameValidation,
    ageValidation,
    talkValidation,
    watchedAtValidation,
    rateValidation,
};