const express = require('express');
const router = express.Router();
const { getAllUsers, updateUser, deleteUser, forceChangePassword } = require('../controllers/userController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.post('/force-change-password', forceChangePassword);

router.get('/', protect, authorize('admin'), getAllUsers);
router.put('/:id', protect, authorize('admin'), updateUser);
router.delete('/:id', protect, authorize('admin'), deleteUser);

module.exports = router;
