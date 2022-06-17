const hre = require("hardhat");

async function main() {
  console.log("Getting contract");
  const signerAddress = (await hre.ethers.getSigner()).getAddress();
  console.log({ signerAddress });
  const GenArtNFT = await hre.ethers.getContractFactory("GeNFT");
  const genArtNFT = await GenArtNFT.deploy();
  console.log("Deploying contract");

  await genArtNFT.deployed();

  console.log("My NFT deployed to:", genArtNFT.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
