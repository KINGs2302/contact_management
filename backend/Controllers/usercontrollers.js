const usermodel = require('../Models/Contact');

// Create API
const create = async (req, res) => {
  try {
    const contacts = req.body.contacts; // Adjust to match the incoming structure

    if (!Array.isArray(contacts)) {
      return res.status(400).json({ success: false, message: 'Invalid input format' });
    }

    // Create and save each contact
    const savedUsers = [];
    for (const contact of contacts) {
      const { name, fathername, email, phone } = contact;
      const Newuser = new usermodel({ name, fathername, email, phone });
      const savedUser = await Newuser.save();
      savedUsers.push(savedUser);
    }

    res.status(200).json({
      success: true,
      message: 'Users Created Successfully.',
      savedUsers,
    });
  } catch (error) {
    console.error("Error creating user:", error.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};


// Read API
const get = async (req, res) => {
  try {
    const users = await usermodel.find();
    res.status(200).json({ success: true, users });
  } catch (error) {
    console.error("Error fetching users:", error.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Update User API
const Updated = async (req, res) => {
  try {
    const userId = req.params.id;
    const updateuser = await usermodel.findByIdAndUpdate(userId, req.body, { new: true });

    if (!updateuser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      updateuser,
    });
  } catch (error) {
    console.error("Error updating user:", error.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Delete User API
const Delete = async (req, res) => {
  try {
    const userId = req.params.id;
    const deletuser = await usermodel.findByIdAndDelete(userId);

    if (!deletuser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
      deletuser, // Optional: return deleted user for reference
    });
  } catch (error) {
    console.error("Error deleting user:", error.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = { create, get, Updated, Delete };
