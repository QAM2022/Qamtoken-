const hre = require("hardhat");

const {
  OWNER,
  PRIVATE_SALE, 
  PRE_SALE, 
  CROWDSALE, 
  MARKETING_TEAM,
  MANAGMENT_TEAM, 
  ADVISORS,
  BOUNTIES,
  LIQ_POOL,
  FOUNDERS_RESERVE
} = process.env;

async function main() {

  const Token = await hre.ethers.getContractFactory("QTToken");

  let token = await Token.deploy(  
    OWNER,
    PRIVATE_SALE, 
    PRE_SALE, 
    CROWDSALE, 
    MARKETING_TEAM,
    MANAGMENT_TEAM, 
    ADVISORS,
    BOUNTIES,
    LIQ_POOL,
    FOUNDERS_RESERVE
  );  
  await token.deployed();
  console.log("Token = ", token.address);

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });