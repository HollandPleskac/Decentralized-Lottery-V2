// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.7;


// Chainlink VRF
// Chainlink Price Feeds ($50)

contract Lottery {

    enum LOTTERY_STATE {
        OPEN,
        CLOSED,
        PICKING_WINNER
    }

    LOTTERY_STATE public state = LOTTERY_STATE.CLOSED;
    address[] public participants;
    // TODO : last winner

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
    
    function enterLottery() public {
        require(state == LOTTERY_STATE.OPEN, "Can't enter a closed lottery, lottery must be open");
        participants.push(msg.sender);
    }

}