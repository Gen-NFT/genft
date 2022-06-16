// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract GeNFT is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;

    uint constant nftPrice = 0.05 ether;
    Counters.Counter private _tokenIdCounter;

    function getPrice() public pure returns (uint) {
        return nftPrice;
    }


    constructor() ERC721("GeNFT", "GNFT") {}

    function _baseURI() internal pure override returns (string memory) {
        return "ipfs://";
    }

    function safeMint(address to, string memory uri) public onlyOwner {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }

    // The following functions are overrides required by Solidity.

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    mapping(string => uint8) existingURIs;


    function isContentOwned(string memory uri) public view returns (bool) {
        return existingURIs[uri] == 1;
    }
    function count() public view returns (uint256) {
        return _tokenIdCounter.current();
    }

     function payToMint(
        address recipient,
        string memory metadataURI
    ) public payable returns (uint256) {
        require(existingURIs[metadataURI] != 1, 'NFT already minted!');

        require (msg.value >= nftPrice, 'Need to pay up! Minimum price is 0.05eth');


        uint256 newItemId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        existingURIs[metadataURI] = 1;

        _mint(recipient, newItemId);
        _setTokenURI(newItemId, metadataURI);

        return newItemId;
    }
}
