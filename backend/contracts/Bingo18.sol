// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.19;

import {VRFCoordinatorV2Interface} from "@chainlink/contracts/src/v0.8/vrf/interfaces/VRFCoordinatorV2Interface.sol";
import {VRFConsumerBaseV2} from "@chainlink/contracts/src/v0.8/vrf/VRFConsumerBaseV2.sol";

contract Bingo18 is VRFConsumerBaseV2 {
    //* ================================================================
    //* │                       State variables                        │
    //* ================================================================
    enum Option {
        SUM, // 3 options
        GLE, // 16 options
        ONEDUP, // 7 options
        TWODUP, // 6 options
        THREEDUP // 6 options
    }

    struct Value {
        uint32 value;
        // with GLE, value is 0 for small, 1 for equal and 2 for large
        uint16 amount;
    }

    struct Ticket {
        Option option;
        Value[] values;
    }

    enum BingoState {
        CALCULATING,
        READY
    }

    uint256 private constant TICKET_PRICE = 1e16; // 0.01 ETH
    uint8 private pastResults;
    uint256 public rewardPool;
    mapping(address => Ticket[]) private s_userOptions;
    address payable[] private s_players;

    //* ================================================================
    //* │                            VRF                               │
    //* ================================================================
    event RequestSent(uint256 requestId, uint32 numWords);
    event RequestFulfilled(uint256 requestId, uint256[] randomWords);

    VRFCoordinatorV2Interface private immutable i_vrfCoordinator;
    bytes32 private immutable i_keyHash;
    uint64 private immutable i_subscriptionId;
    uint16 private immutable i_requestConfirmations;
    uint32 private immutable i_callbackGasLimit;
    uint32 private constant NUMWORDS = 3;

    struct RequestStatus {
        bool fulfilled; // whether the request has been successfully fulfilled
        bool exists; // whether a requestId exists
        uint256[] randomWords;
    }
    mapping(uint256 => RequestStatus)
        public s_requests; /* requestId --> requestStatus */
    uint256[] public requestIds; // past requests Id.

    /// @notice Initialize the contract's state variable and vrfCoordinator
    /// @dev Explain to a developer any extra details
    /// @param vrfCoordinator: the address of the Coordinator contract
    /// param : the address of the Coordinator contract
    constructor(
        address vrfCoordinator,
        bytes32 keyHash,
        uint64 subscriptionId,
        uint16 requestConfirmations,
        uint32 callbackGasLimit
    ) VRFConsumerBaseV2(vrfCoordinator) {
        i_vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinator);
        i_keyHash = keyHash;
        i_subscriptionId = subscriptionId;
        i_requestConfirmations = requestConfirmations;
        i_callbackGasLimit = callbackGasLimit;
    }

    /// @notice Allow user to participate to our lottery
    /// @dev This function will trigger when user click on 'Confirm' button, receiving list of options from user
    /// @param options the array of string contains ticket type that user selected

    function enterBingo(Ticket[] memory options) public {
        // 1. track the user's option
        s_userOptions[msg.sender] = options;
        // 2. add user to player list
        s_players.push(payable(msg.sender));
    }

    // Takes your specified parameters and submits the request to the VRF coordinator contract.
    function requestRandomWords() external returns (uint256 requestId) {
        // Will revert if subscription is not set and funded.
        requestId = i_vrfCoordinator.requestRandomWords(
            i_keyHash,
            i_subscriptionId,
            i_requestConfirmations,
            i_callbackGasLimit,
            NUMWORDS
        );
        s_requests[requestId] = RequestStatus({
            randomWords: new uint256[](0),
            exists: true,
            fulfilled: false
        });
        requestIds.push(requestId);
        emit RequestSent(requestId, NUMWORDS);
        return requestId;
    }

    // TODO: Use chainlink vrf for random source
    function fulfillRandomWords(
        uint256 _requestId,
        uint256[] memory _randomWords
    ) internal override {
        require(s_requests[_requestId].exists, "request not found");

        // with each user, check if they win something
        // accumulate the win amount and withdraw ETH from contract to their address

        for (
            uint256 playerIndex = 0;
            playerIndex < s_players.length;
            playerIndex++
        ) {
            uint256 winAmount = 0;

            address userAddress = s_players[playerIndex];
            // get the list of options from the user (in memory)
            Ticket[] memory userOption = s_userOptions[userAddress];

            // loop through each Ticket option from user
            for (
                uint256 ticketIndex = 0;
                ticketIndex < userOption.length;
                ticketIndex++
            ) {
                // get the ticket values (include value 1->18 and amount of ticket)
                Ticket memory ticket = userOption[ticketIndex];
                Value[] memory values = ticket.values;

                if (ticket.option == Option.GLE) {
                    uint256 gleResult = _randomWords[0] +
                        _randomWords[1] +
                        _randomWords[2];
                    // get the exact value and amount of ticket
                    for (
                        uint256 valueIndex = 0;
                        valueIndex < values.length;
                        valueIndex++
                    ) {
                        Value memory _value = values[valueIndex];
                        // if use bet GLE correct, accumulate the win
                        if (
                            (gleResult >= 3 &&
                                gleResult <= 9 &&
                                _value.value == 0) ||
                            (gleResult >= 12 &&
                                gleResult <= 18 &&
                                _value.value == 2)
                        ) {
                            winAmount += (_value.amount * TICKET_PRICE * 3) / 2;
                        } else if (
                            gleResult >= 10 &&
                            gleResult <= 11 &&
                            _value.value == 1
                        ) {
                            winAmount += _value.amount * TICKET_PRICE * 2;
                        }
                    }
                } else if (ticket.option == Option.SUM) {
                    uint256 sumResult = _randomWords[0] +
                        _randomWords[1] +
                        _randomWords[2];

                    for (
                        uint256 valueIndex = 0;
                        valueIndex < values.length;
                        valueIndex++
                    ) {
                        Value memory _value = values[valueIndex];

                        if (_value.value == sumResult) {
                            if (sumResult == 3 || sumResult == 18) {
                                winAmount += _value.amount * TICKET_PRICE * 120;
                            } else if (sumResult == 4 || sumResult == 17) {
                                winAmount += _value.amount * TICKET_PRICE * 40;
                            } else if (sumResult == 5 || sumResult == 16) {
                                winAmount += _value.amount * TICKET_PRICE * 20;
                            } else if (sumResult == 6 || sumResult == 15) {
                                winAmount += _value.amount * TICKET_PRICE * 12;
                            } else if (sumResult == 7 || sumResult == 14) {
                                winAmount += _value.amount * TICKET_PRICE * 8;
                            } else if (sumResult == 8 || sumResult == 13) {
                                winAmount +=
                                    (_value.amount * TICKET_PRICE * 11) /
                                    2;
                            } else if (sumResult == 9 || sumResult == 12) {
                                winAmount +=
                                    (_value.amount * TICKET_PRICE * 47) /
                                    10;
                            } else if (sumResult == 10 || sumResult == 11) {
                                winAmount +=
                                    (_value.amount * TICKET_PRICE * 22) /
                                    5;
                            }
                        }
                    }
                } else if (ticket.option == Option.ONEDUP) {
                    // calculate how many winning number user have
                    for (
                        uint256 valueIndex = 0;
                        valueIndex < values.length;
                        valueIndex++
                    ) {
                        Value memory _value = values[valueIndex];
                        uint256 numOfWinningNumber = 0;

                        // loop through 3 result number
                        for (
                            uint256 resultIndex = 0;
                            resultIndex < _randomWords.length;
                            resultIndex++
                        ) {
                            if (_value.value == _randomWords[resultIndex])
                                numOfWinningNumber++;
                        }

                        if (numOfWinningNumber == 1) {
                            winAmount +=
                                (_value.amount * TICKET_PRICE * 12) /
                                10;
                        } else if (numOfWinningNumber == 2) {
                            winAmount += _value.amount * TICKET_PRICE * 2;
                        } else if (numOfWinningNumber == 3) {
                            winAmount += _value.amount * TICKET_PRICE * 3;
                        }
                    }
                } else if (ticket.option == Option.TWODUP) {
                    // calculate how many winning number user have
                    for (
                        uint256 valueIndex = 0;
                        valueIndex < values.length;
                        valueIndex++
                    ) {
                        Value memory _value = values[valueIndex];
                        uint256 numOfWinningNumber = 0;

                        // loop through 3 result number
                        for (
                            uint256 resultIndex = 0;
                            resultIndex < _randomWords.length;
                            resultIndex++
                        ) {
                            if (_value.value == _randomWords[resultIndex])
                                numOfWinningNumber++;
                        }

                        if (numOfWinningNumber >= 2) {
                            winAmount +=
                                (_value.amount * TICKET_PRICE * 75) /
                                10;
                        }
                    }
                } else if (ticket.option == Option.THREEDUP) {
                    // calculate how many winning number user have
                    for (
                        uint256 valueIndex = 0;
                        valueIndex < values.length;
                        valueIndex++
                    ) {
                        Value memory _value = values[valueIndex];
                        uint256 numOfWinningNumber = 0;

                        // loop through 3 result number
                        for (
                            uint256 resultIndex = 0;
                            resultIndex < _randomWords.length;
                            resultIndex++
                        ) {
                            if (_value.value == _randomWords[resultIndex])
                                numOfWinningNumber++;
                        }

                        if (numOfWinningNumber == 3) {
                            winAmount += _value.amount * TICKET_PRICE * 120;
                        }
                        // if user choose arbitray 3-duplicate
                        else if (
                            _randomWords[0] == _randomWords[1] &&
                            _randomWords[1] == _randomWords[2] &&
                            _value.value == 7
                        ) {
                            winAmount += _value.amount * TICKET_PRICE * 20;
                        }
                    }
                }
            }

            s_requests[_requestId].fulfilled = true;
            s_requests[_requestId].randomWords = _randomWords;

            // after having the winning amount of each user, withdraw the fund to them
            if (winAmount > 0) {
                require(
                    address(this).balance > winAmount,
                    "Not enough fund to withdraw"
                );

                (bool sent, ) = userAddress.call{value: winAmount}("");
                require(sent, "Failed to send the reward");
            }
        }
    }
}
