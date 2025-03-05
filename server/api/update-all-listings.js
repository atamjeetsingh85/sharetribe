const { getIntegrationSdk, handleError } = require('../api-util/sdk');

const updateAllListingsToPrivate = async (req, res) => {
  const { userId, makePrivate } = req.body;
  console.log("userId",userId);
  console.log("makePrivate",makePrivate);

  try {
    // Step 1: Get a trusted SDK instance
    const sdk = await getIntegrationSdk();


    // Step 2: Fetch all listings for the user
    const response = await sdk.listings.query({ authorId: userId});
    const listings = response.data.data;

    console.log(!!response, '((( ))) => response');
    

    // Step 3: Update each listing's `publicData.isPrivate` field
    const updatePromises = listings.map(listing =>
      sdk.listings.update({
        id: listing.id.uuid,
        publicData: {
          ...listing.attributes.publicData,
          isPrivate: makePrivate,
        },
      })
    );

    // Step 4: Wait for all updates to complete
    await Promise.all(updatePromises);
    console.log("All listings updated successfully");
    res.status(200).json({ message: 'All listings updated successfully.' });
  } catch (error) {
    console.log("ghhwgrj3gr")

    handleError(res, error);
  }
};

module.exports = updateAllListingsToPrivate;


