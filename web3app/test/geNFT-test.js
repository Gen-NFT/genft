const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("GeNFT", function () {
  it("Goal is to mint and transfer an NFT", async function () {
    const GenArtNFT = await hre.ethers.getContractFactory("GeNFT");
    const genArtNFT = await GenArtNFT.deploy();

    // expect(await greeter.greet()).to.equal("Hello, world!");

    // const setGreetingTx = await greeter.setGreeting("Hola, mundo!");

    // // wait until the transaction is mined
    // await setGreetingTx.wait();

    // expect(await greeter.greet()).to.equal("Hola, mundo!");

    const recipient = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";
    const nftMetadataUrl = "frontend/assets/samples/1.png";

    let balance = await genArtNFT.balanceOf(recipient);
    expect(balance).to.equal(0);

    const newMintedToken = await genArtNFT.payToMint(
      recipient,
      nftMetadataUrl,
      {
        value: ethers.utils.parseEther("0.05"),
      }
    );

    await newMintedToken.wait();
    
    balance = await genArtNFT.balanceOf(recipient);
    expect(balance).to.equal(1);
     
    expect(await genArtNFT.isContentOwned(nftMetadataUrl)).to.equal(true);
  });
});
