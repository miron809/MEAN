const express = require('express');
const controller = require('../controllers/category');
const passport = require('passport');
const router = express.Router();

require('../middleware/passport')(passport);

router.get('/', passport.authenticate('jwt', {session: false}), controller.getAll);
router.get('/:id', controller.getById);
router.post('/', controller.create);
router.patch('/:id', controller.update);
router.delete('/:id', controller.remove);

module.exports = router;
