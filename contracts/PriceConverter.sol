// SPDX-License-Identifier：MIT

pragma solidity ^0.8.0;
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

library PriceConverter {
    function getPrice(
        AggregatorV3Interface priceFeed
    ) internal view returns (uint256) {
        // BTC/USD  0xA39434A63A52E749F02807ae27335515BA4b07F7
        // abi
        // AggregatorV3Interface priceFeed = AggregatorV3Interface(
        //     0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e
        // );
        (
            uint80 roundID,
            int price,
            uint startedAt,
            uint TimeStamp,
            uint80 anserinround
        ) = priceFeed.latestRoundData();
        return uint256(price * 1e10);
    }

    // function getVersion () public view returns(uint256){
    //     AggregatorV3Interface pp = AggregatorV3Interface(0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e);
    //     return pp.version();
    // }
    function ethToUSD(
        uint256 ethamount,
        AggregatorV3Interface priceFeed
    ) internal view returns (uint256) {
        uint256 ethprice = getPrice(priceFeed);
        uint256 ethinUSD = (ethprice * ethamount) / 1e18;
        return ethinUSD;
    }
}
