const respond = async (res, response) => {
  return res.status(response.success ? 200 : 400).json({
    success: response.success,
    message: response.message,
    data: response.data,
  });
};
const Utils = { respond };
module.exports = Utils;
