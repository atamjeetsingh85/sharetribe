const { getIntegrationSdk, handleError } = require('../api-util/sdk');

/**
 * API to unsubscribe user based on UUID.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const unsubscribeUser = async (req, res) => {
  console.log('Unsubscribe request received:', req.body);

  const { uuid } = req.body;

  if (!uuid) {
    return res.status(400).json({ error: 'UUID is required' });
  }

  try {
    const sdk = getIntegrationSdk();  
    // Update user's private data: Mark emailUnsubscribe as true
    await sdk.users.updateProfile({
      id: uuid,
      privateData: {
        emailUnsubscribe: true,
      },
    });

    console.log('User unsubscribed successfully:', uuid);

    return res.status(200).json({
      success: true,
      message: 'User unsubscribed successfully',
    });
  } catch (error) {
    console.error('Error unsubscribing user:', error);
    handleError(res, error);
  }
};

module.exports = unsubscribeUser;



