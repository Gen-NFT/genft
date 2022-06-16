const hre = require("hardhat");

async function main() {

  const GenArtNFT = await hre.ethers.getContractFactory("GeNFT");
  const genArtNFT = await GenArtNFT.deploy();

  await genArtNFT.deployed();

  console.log("My NFT deployed to:", genArtNFT.address);
}


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
