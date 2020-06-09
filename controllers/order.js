module.exports.getAll = (req, res) => {
  res.status(200).json({
    login: true
  })
};

module.exports.create = (req, res) => {
  res.status(200).json({
    register: true
  })
};
