// SPDX-License-Identifier: MIT
// Tells the Solidity compiler to compile only from v0.8.13 to v0.9.0
pragma solidity ^0.8.13;

import "./ConvertLib.sol";

// This is just a simple example of a coin-like contract.
// It is not ERC20 compatible and cannot be expected to talk to other
// coin/token contracts.

contract voteCampaign{

    mapping(address => uint) public ballot;

    event Vote(address indexed voterAdress, address indexed candiateAdress);

    function vote(address candiateAdress) public{
        ballot[candiateAdress]++;
        emit Vote(msg.sender, candiateAdress);
    }
}
