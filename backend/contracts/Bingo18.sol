// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.19;

import {VRFCoordinatorV2Interface} from "@chainlink/contracts/src/v0.8/vrf/interfaces/VRFCoordinatorV2Interface.sol";
import {VRFConsumerBaseV2} from "@chainlink/contracts/src/v0.8/vrf/VRFConsumerBaseV2.sol";
import {AutomationCompatibleInterface} from "@chainlink/contracts/src/v0.8/automation/AutomationCompatible.sol";

contract Bingo18 is VRFConsumerBaseV2, AutomationCompatibleInterface {
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

    uint256 private constant TICKET_PRICE = 1e15; // 0.001 ETH
    uint256[3][5] public s_pastResults; // reverse the index because of array design from solidity
    mapping(address => Ticket[]) private s_userOptions;
    address payable[] public s_players;
    BingoState private s_bingoState;

    //* ================================================================
    //* │                            VRF                               │
    //* ================================================================
    event RequestSent(uint256 requestId, uint32 numWords);
    event RequestFulfilled(uint256 requestId, uint256[] randomWords);

    VRFCoordinatorV2Interface private immutable i_vrfCoordinator;
    bytes32 private immutable i_keyHash;
    uint256 private immutable i_subscriptionId;
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
    constructor(
        address vrfCoordinator,
        bytes32 keyHash,
        uint256 subscriptionId,
        uint16 requestConfirmations,
        uint32 callbackGasLimit
    ) VRFConsumerBaseV2(vrfCoordinator) {
        i_vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinator);
        i_keyHash = keyHash;
        i_subscriptionId = subscriptionId;
        i_requestConfirmations = requestConfirmations;
        i_callbackGasLimit = callbackGasLimit;
        s_bingoState = BingoState.READY;
    }

    /// @notice Allow user to participate to our lottery
    /// @dev This function will trigger when user click on 'Confirm' button, receiving list of options from user
    /// @param options the array of string contains ticket type that user selected

    function _calculateFee(
        Ticket[] memory options
    ) internal pure returns (uint256) {
        uint256 totalTicket = 0;
        for (
            uint256 ticketIndex = 0;
            ticketIndex < options.length;
            ticketIndex++
        ) {
            Value[] memory values = options[ticketIndex].values;
            for (
                uint256 valueIndex = 0;
                valueIndex < values.length;
                valueIndex++
            ) {
                Value memory value = values[valueIndex];
                totalTicket += value.amount;
            }
        }
        return totalTicket * TICKET_PRICE;
    }

    function enterBingo(Ticket[] memory options) public payable {
        // calculate the fee user need to pay
        uint256 totalFee = _calculateFee(options);
        require(msg.value == totalFee, "Not enough fee to join");
        require(
            s_bingoState == BingoState.READY,
            "Bingo is calculating reward!"
        );

        // 1. track the user's option
        _storeUserOptions(msg.sender, options);
        // 2. add user to player list
        s_players.push(payable(msg.sender));
    }

    // Helper function to store user options
    function _storeUserOptions(address user, Ticket[] memory options) internal {
        Ticket[] storage userTickets = s_userOptions[user];
        delete s_userOptions[user]; // Clear any existing tickets

        for (uint256 i = 0; i < options.length; i++) {
            Ticket memory ticket = options[i];
            Value[] memory values = ticket.values;

            Value[] storage storedValues = userTickets.push().values;
            for (uint256 j = 0; j < values.length; j++) {
                storedValues.push(values[j]);
            }

            userTickets[i].option = ticket.option;
        }
    }

    // function to trigger chainlink upkeep
    function checkUpkeep(
        bytes memory /* checkData */
    )
        public
        view
        override
        returns (bool upkeepNeeded, bytes memory /* performData */)
    {
        if (s_players.length > 0) {
            upkeepNeeded = true;
        } else upkeepNeeded = false;
    }

    // Takes your specified parameters and submits the request to the VRF coordinator contract.
    function performUpkeep(bytes calldata /* performData */) external override {
        (bool upkeepNeeded, ) = checkUpkeep("");

        require(!upkeepNeeded, "Error, No Player!");

        s_bingoState = BingoState.CALCULATING;
        // Will revert if subscription is not set and funded.
        uint256 requestId = i_vrfCoordinator.requestRandomWords(
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
    }

    function _resetState() internal {
        // Clear user options
        for (
            uint256 playerIndex = 0;
            playerIndex < s_players.length;
            playerIndex++
        ) {
            address userAddress = s_players[playerIndex];
            delete s_userOptions[userAddress];
        }

        // Clear the player list
        delete s_players;
    }

    function _save5PastResults(uint256[] memory randomWords) internal {
        // save the result into s_pastResults
        // delete the last element, add to the top of the 2d array
        for (uint256 i = s_pastResults.length - 1; i > 0; i++) {
            delete s_pastResults[i];
            s_pastResults[i] = s_pastResults[i - 1];
        }

        // manually add the 3 random words to the first element
        s_pastResults[0][0] = randomWords[0];
        s_pastResults[0][1] = randomWords[1];
        s_pastResults[0][2] = randomWords[2];
    }

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

        s_requests[_requestId].fulfilled = true;
        s_requests[_requestId].randomWords = _randomWords;
        emit RequestFulfilled(_requestId, _randomWords);

        s_bingoState = BingoState.READY;
        _resetState();
        _save5PastResults(_randomWords);
    }

    function getListOfPlayer() public view returns (address payable[] memory) {
        return s_players;
    }

    function getBingoState() public view returns (BingoState) {
        return s_bingoState;
    }

    function get5PastResult() public view returns (uint256[3][5] memory) {
        return s_pastResults;
    }
}
