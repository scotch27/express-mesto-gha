module.exports = (error, req, res) => {
  const { statusCode = 500, message } = error;
  return res.status(statusCode).send({ message: statusCode === 500 ? 'Ошибка сервера 1' : message });
};
