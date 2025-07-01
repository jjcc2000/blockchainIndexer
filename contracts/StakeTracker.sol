// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

contract StakeTracker {
    event Stake(address indexed staker, uint256 amount);
    event Unstake(address indexed staker, uint256 amount);

    mapping(address => uint256) public stakes;

    function stake() external payable {
        require(msg.value > 0, "Must send ETH");
        stakes[msg.sender] += msg.value;
        emit Stake(msg.sender, msg.value);
    }

    function unstake(uint256 amount) external {
        require(stakes[msg.sender] >= amount, "Insuficient Stake");
        stakes[msg.sender] -= amount;
        payable(msg.sender).transfer(amount);
        emit Unstake(msg.sender, amount);
    }   
}
