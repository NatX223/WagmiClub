// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Badge is ERC721 {
    using Counters for Counters.Counter; // OpenZepplin Counter
    Counters.Counter private _badgeCount; // Counter for badges minted

    constructor(string memory name_, string memory symbol_) ERC721(name_, symbol_) {}

    // mint
    function mint(address to) public {
        _mint(to, _badgeCount.current());
        _badgeCount.increment();
    }

    function approve(address to, uint256 tokenId) public virtual override {
        revert("Soulbound token cannot be approved to another address");
    }

    function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory data) public virtual override {
        revert("Soulbound token cannot be transfered to another address");
    }

    function transferFrom(address from, address to, uint256 tokenId) public virtual override {
        revert("Soulbound token cannot be transfered to another address");
    }
}