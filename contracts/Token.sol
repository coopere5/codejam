pragma solidity ^0.4.18;

library Reinsurance {
    struct Account {
        string accountType;
        uint balance;
        string description;
        string terms;
    }
}
contract Token {
    mapping (address => Reinsurance.Account) public bonds;
    mapping (address => string) public title;

    function createBond(uint balance, string description, string terms) public {
        bonds[msg.sender].accountType = "Bond";
        bonds[msg.sender].balance = balance;
        bonds[msg.sender].description = description;
        bonds[msg.sender].terms = terms;
    }

    function transfer(address to, uint amount) public {
        if (bonds[msg.sender].balance < amount) {
            revert();
        }
        bonds[msg.sender].balance -= amount;
        bonds[to].balance += amount;
        
    }
}