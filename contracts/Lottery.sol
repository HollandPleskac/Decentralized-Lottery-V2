// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

// Chainlink VRF

contract Lottery {

    enum LOTTERY_STATE {
        OPEN,
        CLOSED,
        PICKING_WINNER
    }

    AggregatorV3Interface internal priceFeed;

    address[] public participants;
    LOTTERY_STATE public state = LOTTERY_STATE.CLOSED;

    constructor() {
        priceFeed = AggregatorV3Interface(0x9326BFA02ADD2366b30bacB125260Af641031331);
    }

    function startLottery() public {
        require(state == LOTTERY_STATE.CLOSED, "Lottery state must be closed to start a new lottery");
        state = LOTTERY_STATE.OPEN;
    }

    function endLottery() public {
        require(state == LOTTERY_STATE.OPEN, "Lottery must be in process");
        state = LOTTERY_STATE.PICKING_WINNER;
        // TODO : get random number
        // TODO : transfer funds
        participants = new address[](0);
        state = LOTTERY_STATE.CLOSED;
    }

    function getRandomNumber() internal pure returns(uint256) {
        return 0;
    }
    
    function enterLottery() public payable {
        require(state == LOTTERY_STATE.OPEN, "Can't enter a closed lottery, lottery must be open");
        require(ethereumToUSD(msg.value) > 50, "Need to send more than $50 in ETH");
        participants.push(msg.sender);
    }

    function getLatestPrice() public view returns (uint256) {
        (, int price,,,) = priceFeed.latestRoundData();
        return uint256(price * 10**10); // price feed has 8 decimals, make it 18 decimals
    }

    function ethereumToUSD(uint ethAmount) public view returns (uint256) {
        uint256 ethPrice = getLatestPrice();
        return (ethPrice * ethAmount) / (10**18);
    }

}