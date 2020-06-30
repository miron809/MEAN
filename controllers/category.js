module.exports.getAll = (req, res) => {
  res.json({message: 'Categories'})
};

module.exports.getById = (req, res) => {
  res.status(200).json({
    register: true
  })
};

module.exports.remove = (req, res) => {
  res.status(200).json({
    register: true
  })
};

module.exports.create = (req, res) => {
  res.status(200).json({
    register: true
  })
};

module.exports.update = (req, res) => {
  res.status(200).json({
    register: true
  })
};
