// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract Medal is ERC1155 {
    using Counters for Counters.Counter; // OpenZepplin Counter
    Counters.Counter private _medalCount; // Counter for medals

    mapping(uint256 => address) ownedMedals;

    constructor(string memory uri_) ERC1155(uri_) {}

    // function to create medal
    function createMedal() public {
        ownedMedals[_medalCount.current()] = msg.sender;
        _medalCount.increment();
    }

    // claim
    function batchMint(address[] memory receivers, uint256 id) onlyCreator(id) public {
        for (uint256 i = 0; i < receivers.length; i++) {
            _mint(receivers[i], id, 1, "");
        }
    }

    // cancel approve, transfer, transferFrom (make it soul bound)
    function approve(address to, uint256 tokenId) public virtual {
        revert("Soulbound token cannot be approved to another address");
    }

    function transferFrom(address from, address to, uint256 tokenId) public virtual {
        revert("Soulbound token cannot be transfered to another address");
    }

    modifier onlyCreator(uint256 id) {
        require(msg.sender == ownedMedals[id], "Only the owner can call this function");
        _;
    }

}