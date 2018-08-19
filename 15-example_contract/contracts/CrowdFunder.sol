pragma solidity ^0.4.17;


contract CrowdFunder {
    struct Match {
        address user1;
        address user2;
        bool isMatched;
    }

    event logNewMatch (address user1, address user2, bool isMatched);
    event logMessage (string message);

    Match[] public matches;

    uint public myNum = 42;

    function enter(address myAddress, address otherAddress) public payable {
        if (matches.length != 0) {
            for(var i = 0; i < matches.length; i++) {
                if(matches[i].isMatched == false) {
                    if(matches[i].user1 == otherAddress) {
                        matches[i].user2 = myAddress;
                    } else if (matches[i].user2 == otherAddress) {
                        matches[i].user1 = myAddress;
                    }
                    matches[i].isMatched = true;
                    emit logMessage('Matching Successful');
                } else {
                    matches.length++;
                    matches[matches.length-1].user1 = myAddress;
                    matches[matches.length-1].user2 = 0;
                    matches[matches.length-1].isMatched = false;
                    emit logMessage('Please wait for the other person to match');
                }
            }
        } else {
            matches.length++;
            matches[matches.length-1].user1 = myAddress;
            matches[matches.length-1].user2 = 0;
            matches[matches.length-1].isMatched = false;
            emit logMessage('Please wait for the other person to match');
        }
    }
}
