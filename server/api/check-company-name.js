const { getIntegrationSdk, handleError } = require("../api-util/sdk");

const checkCompanyNameAvailability = async (req, res) => {
  console.log(req,"reqreqreq")
  const { companyName } = req.body;
  console.log("Checking availability for company:", companyName);

  try {
    const sdk = getIntegrationSdk();

    // Directly search for users with the given `cname` (enum)
    const response = await sdk.users.query({
      per_page: 1, 
      pub_cname: companyName, 
    });

    const isAvailable = !response.data.data.length; // If no users found, the name is available
    console.log("Company name available:", isAvailable);


    console.log(response,"responseresponseresponse")

    console.log("Company name :", response.data.data);
    res.status(200).json({ isAvailable });
  } catch (error) {
    console.error("Error checking company name:", error);
    handleError(res, error);
  }
};

module.exports = checkCompanyNameAvailability;
