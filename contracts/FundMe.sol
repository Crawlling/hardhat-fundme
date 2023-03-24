// SPDX-License-Identifier:MIT

pragma solidity ^0.8.0;

import "./PriceConverter.sol";

error FundMe_NotOwner();

/**
 * @title A contract for crowd funding
 * @author zijian yang
 * @notice This contract is to demo a sample funding contract
 * @dev This implements price feeds as our library
 */
contract FundMe {
    uint256 public minimumUSD = 1 * 1e18;
    using PriceConverter for uint256;
    address[] private s_funders;
    mapping(address => uint256) private addressToAmountFunded;
    address private immutable owner;
    AggregatorV3Interface private priceFeed;

    modifier Onlyowner() {
        if (msg.sender != owner) revert FundMe_NotOwner();
        _;
    }

    constructor(address priceFeedAddress) {
        owner = msg.sender;
        priceFeed = AggregatorV3Interface(priceFeedAddress);
    }

    receive() external payable {
        fund();
    }

    fallback() external payable {
        fund();
    }

    /**
     * @notice This contract is to demo a sample funding contract
     * @dev This implements price feeds as our library
     */

    function fund() public payable {
        require(
            msg.value.ethToUSD(priceFeed) >= minimumUSD,
            "Didn't sent enough."
        );
        // revert mean undo any action before, and send remaining gas back.
        s_funders.push(msg.sender);
        addressToAmountFunded[msg.sender] = msg.value;
    }

    function withdraw() public payable Onlyowner {
        for (
            uint256 funderIndex = 0;
            funderIndex < s_funders.length;
            funderIndex++
        ) {
            address funder = s_funders[funderIndex];
            addressToAmountFunded[funder] = 0;
        }

        s_funders = new address[](0);

        (bool success, ) = msg.sender.call{value: address(this).balance}("");
        require(success);
    }

    function withdraw_cheaper() public payable Onlyowner {
        address[] memory funders = s_funders;
        // mappings can't be in memory,sorry!
        for (
            uint256 funderIndex = 0;
            funderIndex < funders.length;
            funderIndex++
        ) {
            address funder = funders[funderIndex];
            addressToAmountFunded[funder] = 0;
        }

        s_funders = new address[](0);

        (bool success, ) = msg.sender.call{value: address(this).balance}("");
        require(success);
    }

    function getOwner() public view returns (address) {
        return (owner);
    }

    function getFunders(uint256 index) public view returns (address) {
        return (s_funders[index]);
    }

    function getAddressToAmountFunded(
        address _address
    ) public view returns (uint256) {
        return (addressToAmountFunded[_address]);
    }

    function getPricefeed() public view returns (AggregatorV3Interface) {
        return (priceFeed);
    }
}
