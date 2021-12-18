// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";
import "hardhat/console.sol";

contract Lottery is VRFConsumerBase  {

    event PickingWinner(bytes32 requestId);
    event PlayerEntered();
    event StateChange(string state);

    enum LOTTERY_STATE {
        OPEN,
        CLOSED,
        PICKING_WINNER
    }

    struct LastWinnerData {
      address payable lastWinner;
      uint256 etherWonByLastWinner;
      uint256 playersInLastLottery;
    }

    AggregatorV3Interface internal priceFeed;
    bytes32 internal keyHash;
    uint256 internal fee;
    
    address payable[] public participants;
    uint256 public randomResult;
    LastWinnerData public lastWinnerData;
    address public owner;
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
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "You must be the owner to call this function");
        _;
    }

    function startLottery() public onlyOwner {
        require(state == LOTTERY_STATE.CLOSED, "Lottery state must be closed to start a new lottery");
        state = LOTTERY_STATE.OPEN;
        emit StateChange("OPEN");
    }
    
    function enterLottery() public payable {
        require(state == LOTTERY_STATE.OPEN, "Can't enter a closed lottery, lottery must be open");
        require(ethereumToUSD(msg.value) >= 50, "Need to send $50 or more in ETH");
        participants.push(payable(msg.sender));
        emit PlayerEntered();
    }

    function getLatestPrice() internal view returns (uint256) {
        (, int price,,,) = priceFeed.latestRoundData();
        return uint256(price * 10**10); // price feed has 8 decimals, make it 18 decimals
    }

    function ethereumToUSD(uint ethAmount) internal view returns (uint256) {
        uint256 ethPrice = getLatestPrice();
        return (ethPrice * ethAmount / 10**36); // ethPrice and ethAmount both have 18 decimals. Get rid of the 36 decimals to get usd value
    }

    function endLottery() public onlyOwner {
        require(LINK.balanceOf(address(this)) * (10**18) >= fee, "Not enough LINK - fill contract with faucet");
        require(state == LOTTERY_STATE.OPEN, "Lottery must be in process");
        // TODO : Make sure that you have participants YOU DONT WANT TO %0
        require(participants.length != 0, "Must have participants to pick a winner");
        state = LOTTERY_STATE.PICKING_WINNER;
        bytes32 requestId = requestRandomness(keyHash, fee);
        emit PickingWinner(requestId);
        emit StateChange("PICKING_WINNER");
    }

    function fulfillRandomness(bytes32 requestId, uint256  randomness) internal override {
      
        uint256 indexOfWinner = randomness % participants.length; // NOTE: be careful about %0
        lastWinnerData = LastWinnerData(participants[indexOfWinner],address(this).balance,participants.length);
        participants[indexOfWinner].transfer(address(this).balance);
        participants = new address payable[](0);
        state = LOTTERY_STATE.CLOSED;
        randomResult = randomness;
        emit StateChange("CLOSED");
    }

    function getParticipantsLength() public view returns(uint256) {
      return participants.length;
    }
}