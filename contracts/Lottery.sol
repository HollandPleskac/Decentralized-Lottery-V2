// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";

contract Lottery is VRFConsumerBase  {

    enum LOTTERY_STATE {
        OPEN,
        CLOSED,
        PICKING_WINNER
    }

    AggregatorV3Interface internal priceFeed;

    bytes32 internal keyHash;
    uint256 internal fee;
    
    address[] public participants;
    uint256 public randomResult;
    address lastWinner;
    uint256 usdEntryFee;
    LOTTERY_STATE public state = LOTTERY_STATE.CLOSED;

    constructor(
        address _priceFeedAddress,
        address _vrfCoordinator,
        address _link,
        uint256 _fee,
        bytes32 _keyhash
    ) 
        VRFConsumerBase(
            _vrfCoordinator, // VRF Coordinator
            _link  // LINK Token
        )
     {
        priceFeed = AggregatorV3Interface(_priceFeedAddress);
        keyHash = _keyhash;
        fee = _fee; // 0.1 LINK (Varies by network)
        usdEntryFee = 50*(10**18); // $50
    }

    function startLottery() public {
        require(state == LOTTERY_STATE.CLOSED, "Lottery state must be closed to start a new lottery");
        state = LOTTERY_STATE.OPEN;
    }
    
    function enterLottery() public payable {
        require(state == LOTTERY_STATE.OPEN, "Can't enter a closed lottery, lottery must be open");
        require(ethereumToUSD(msg.value) > 50, "Need to send more than $50 in ETH");
        participants.push(msg.sender);
        // player enters event
    }

    function getLatestPrice() public view returns (uint256) {
        (, int price,,,) = priceFeed.latestRoundData();
        return uint256(price * 10**10); // price feed has 8 decimals, make it 18 decimals
    }

    function ethereumToUSD(uint ethAmount) public view returns (uint256) {
        uint256 ethPrice = getLatestPrice();
        return (ethPrice * ethAmount) / (10**18);
    }

    function getEntranceFee() public view returns(uint256) {
      (, int price,,,) = priceFeed.latestRoundData();
      uint256 adjustedPrice = uint256(price * 10**10); // price feed has 8 decimals, make it 18 decimals

      uint256 costToEnter = (usdEntryFee * 10**18) / adjustedPrice; // 50 dollars in ethereum
      return costToEnter;
    }


    function endLottery() public returns (bytes32 requestId) {
        require(LINK.balanceOf(address(this)) >= fee, "Not enough LINK - fill contract with faucet");
        state = LOTTERY_STATE.PICKING_WINNER;
        // picking winner event
        return requestRandomness(keyHash, fee);
    }

    function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override {
        require(state == LOTTERY_STATE.OPEN, "Lottery must be in process");
        // TODO : get random number
        uint256 indexOfWinner = randomness % participants.length;
        // TODO : transfer funds
        lastWinner = participants[indexOfWinner];
        participants = new address[](0);
        state = LOTTERY_STATE.CLOSED;
        // winner chosen event
    }
}