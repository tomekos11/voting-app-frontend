// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VotingSystem {
    // 1. Zmienne stanu
    address public chairman;
    mapping(address => bool) public admins;
    mapping(address => bool) public voters;
    uint256 public votingCount;
    
    // 2. Struktury danych
    struct Candidate {
        bytes32 name; // Imię i nazwisko kandydata (32 bajty)
        string metadataCID; // CID IPFS z dodatkowymi danymi (np. data urodzenia)
    }

    enum VotingType { Public, Private }

    struct Voting {
        uint256 id;
        string title;
        uint256 startTime;
        uint256 endTime;
        VotingType votingType;
        Candidate[] candidates;
        mapping(address => bool) hasVoted;
        mapping(address => uint256) votes;
        bool exists;
    }

    mapping(uint256 => Voting) public votings;

    // 3. Eventy
    event VotingCreated(uint256 indexed votingId, string title, VotingType votingType);
    event VoteCast(address indexed voter, uint256 indexed votingId, uint256 candidateIndex);

    // 4. Modifikatory
    modifier onlyChairman() {
        require(msg.sender == chairman, "Not chairman");
        _;
    }

    modifier onlyAdmin() {
        require(admins[msg.sender] || msg.sender == chairman, "Not admin");
        _;
    }

    // 5. Konstruktor
    constructor() {
        chairman = msg.sender;
        admins[chairman] = true;
    }

    // 6. Funkcje zarządzania adminami
    function addAdmin(address _admin) external onlyChairman {
        admins[_admin] = true;
    }

    function removeAdmin(address _admin) external onlyChairman {
        admins[_admin] = false;
    }

    // 7. Tworzenie głosowania
    function createVoting(
        string memory _title,
        uint256 _startTime,
        uint256 _endTime,
        VotingType _votingType,
        Candidate[] memory _candidates
    ) external onlyAdmin {
        require(_startTime > block.timestamp, "Invalid start time");
        require(_endTime > _startTime, "Invalid end time");
        
        Voting storage newVoting = votings[votingCount];

        newVoting.id = votingCount;
        newVoting.title = _title;
        newVoting.startTime = _startTime;
        newVoting.endTime = _endTime;
        newVoting.votingType = _votingType;
        newVoting.exists = true;

        votingCount++;
        for(uint256 i = 0; i < _candidates.length; i++) {
            newVoting.candidates.push(_candidates[i]);
        }

        emit VotingCreated(votingCount, _title, _votingType);
    }

    // 8. Głosowanie
    function vote(uint256 _votingId, uint256 _candidateIndex) external {
        require(voters[msg.sender], "Not authorized");
        Voting storage voting = votings[_votingId];
        require(voting.exists, "Invalid voting");
        require(block.timestamp >= voting.startTime, "Voting not started");
        require(block.timestamp <= voting.endTime, "Voting ended");
        require(!voting.hasVoted[msg.sender], "Already voted");
        require(_candidateIndex < voting.candidates.length, "Invalid candidate");

        voting.hasVoted[msg.sender] = true;
        voting.votes[msg.sender] = _candidateIndex;
        
        emit VoteCast(msg.sender, _votingId, _candidateIndex);
    }

    // 9. Funkcje pomocnicze
    function addVoter(address _voter) external onlyAdmin {
        voters[_voter] = true;
    }

    function removeVoter(address _voter) external onlyAdmin {
        voters[_voter] = false;
    }

    // 10. Gettery
    function getVotingStatus(uint256 _votingId) public view returns (string memory) {
        Voting storage voting = votings[_votingId];
        if(!voting.exists) return "Not Exist";
        if(block.timestamp < voting.startTime) return "Pending";
        if(block.timestamp <= voting.endTime) return "Active";
        return "Completed";
    }

    function getCandidateCount(uint256 _votingId) public view returns (uint256) {
        return votings[_votingId].candidates.length;
    }
}