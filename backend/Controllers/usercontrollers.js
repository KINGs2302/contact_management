const usermodel = require('../Models/Contact');

// Create api

const create = async (req, res) => {
  const { name, fathername, email, phone, contacts } = req.body;

  if (!name || !fathername || !email || !phone) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  try {
      // Create and save the new user
      const newUser = new usermodel({ name, fathername, email, phone });
      await newUser.save();

      const savedUsers = []; // Define the savedUsers array

      // If contacts are provided, handle them
      if (Array.isArray(contacts) && contacts.length > 0) {
          for (const contact of contacts) {
              const { name, fathername, email, phone } = contact;
              const newContact = new usermodel({ name, fathername, email, phone });
              const savedUser = await newContact.save();
              savedUsers.push(savedUser);
          }
      }

      // Return the created user and contacts (if any)
      return res.status(201).json({
          success: true,
          message: 'User and contacts created successfully.',
          newUser,
          savedUsers,
      });

  } catch (error) {
      console.error('Error creating user:', error.message);
      res.status(500).json({ message: 'Server error' });
  }
};


const creat = async (req, res) => {
    const { contacts } = req.body;

    // Validate contacts input
    if (!contacts || !Array.isArray(contacts) || contacts.length === 0) {
        return res.status(400).json({ success: false, message: 'No contacts provided' });
    }

    try {
        const savedUsers = []; // Array to store saved users

        // Iterate over each contact and save it
        for (const contact of contacts) {
            const { name, fathername, email, phone } = contact;

            // Validate individual contact fields
            if (!name || !fathername || !email || !phone) {
                return res.status(400).json({ success: false, message: 'All fields are required for each contact' });
            }

            // Create new contact instance
            const newContact = new usermodel({ name, fathername, email, phone });
            const savedUser = await newContact.save();
            savedUsers.push(savedUser); // Add saved user to the array
        }

        // Return the created contacts
        return res.status(201).json({
            success: true,
            message: 'Contacts created successfully.',
            savedUsers,
        });

    } catch (error) {
        console.error('Error creating contacts:', error.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Read API
const get = async (req, res) => {
    try {
        const users = await usermodel.find(); // Fetch all users
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
        const userId = req.params.id; // Get user ID from request parameters
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

module.exports = { create,creat, get, Updated, Delete };
