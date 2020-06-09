module.exports.overview = (req, res) => {
  res.status(200).json({
    login: true
  })
};

module.exports.analytics = (req, res) => {
  res.status(200).json({
    register: true
  })
};
