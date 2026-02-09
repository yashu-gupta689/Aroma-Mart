import express from 'express';
import User from '../models/User.model.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', async (req, res) => {
  try {
    const { name, phone, avatar } = req.body;
    const user = await User.findById(req.user._id);

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (avatar) user.avatar = avatar;

    await user.save();

    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/users/address
// @desc    Add address
// @access  Private
router.post('/address', async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const { isDefault, ...addressData } = req.body;

    // If this is set as default, unset other defaults
    if (isDefault) {
      user.addresses.forEach(addr => {
        addr.isDefault = false;
      });
    }

    user.addresses.push({ ...addressData, isDefault: isDefault || false });
    await user.save();

    res.json({ message: 'Address added successfully', addresses: user.addresses });
  } catch (error) {
    console.error('Add address error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/users/address/:addressId
// @desc    Update address
// @access  Private
router.put('/address/:addressId', async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const address = user.addresses.id(req.params.addressId);

    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }

    const { isDefault, ...addressData } = req.body;

    Object.assign(address, addressData);

    if (isDefault) {
      user.addresses.forEach(addr => {
        addr.isDefault = addr._id.toString() === req.params.addressId;
      });
    }

    await user.save();

    res.json({ message: 'Address updated successfully', addresses: user.addresses });
  } catch (error) {
    console.error('Update address error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/users/address/:addressId
// @desc    Delete address
// @access  Private
router.delete('/address/:addressId', async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.addresses = user.addresses.filter(
      addr => addr._id.toString() !== req.params.addressId
    );
    await user.save();

    res.json({ message: 'Address deleted successfully', addresses: user.addresses });
  } catch (error) {
    console.error('Delete address error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
