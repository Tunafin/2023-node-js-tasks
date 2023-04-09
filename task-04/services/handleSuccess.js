function handleSuccess(res, data) {
  // status預設200，此處可省略
  res.status(200).send({
    status: true,
    data
  }).end();
}
module.exports = handleSuccess;
