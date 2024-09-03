// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Voting {
    struct Ballot {
        string title;
        string description;
        string[] options;
        uint256 startTime;
        uint256 endTime;
        uint256 totalVotes;
    }

    struct Vote {
        address voter;
        uint256 choice;
    }

    mapping(uint256 => Ballot) public ballots;
    mapping(uint256 => mapping(address => bool)) public hasVoted;
    mapping(uint256 => mapping(uint256 => uint256)) public voteCounts;
    mapping(uint256 => Vote[]) public votes;

    uint256 public ballotCount;

    event BallotCreated(uint256 ballotId, string title, uint256 startTime, uint256 endTime);
    event VoteCast(uint256 ballotId, address voter, uint256 choice);

    modifier ballotExists(uint256 _ballotId) {
        require(_ballotId < ballotCount, "Ballot does not exist");
        _;
    }

    modifier votingOpen(uint256 _ballotId) {
        require(block.timestamp >= ballots[_ballotId].startTime, "Voting has not started");
        require(block.timestamp <= ballots[_ballotId].endTime, "Voting has ended");
        _;
    }

    function createBallot(
        string memory _title,
        string memory _description,
        string[] memory _options,
        uint256 _startTime,
        uint256 _endTime
    ) public {
        require(_startTime < _endTime, "Invalid voting period");
        require(_options.length >= 2, "At least two options are required");

        uint256 ballotId = ballotCount;
        Ballot storage ballot = ballots[ballotId];
        ballot.title = _title;
        ballot.description = _description;
        ballot.options = _options;
        ballot.startTime = _startTime;
        ballot.endTime = _endTime;

        ballotCount++;

        emit BallotCreated(ballotId, _title, _startTime, _endTime);
    }

    function castVote(uint256 _ballotId, uint256 _choice) public ballotExists(_ballotId) votingOpen(_ballotId) {
        require(!hasVoted[_ballotId][msg.sender], "Already voted");
        require(_choice < ballots[_ballotId].options.length, "Invalid choice");

        hasVoted[_ballotId][msg.sender] = true;
        voteCounts[_ballotId][_choice]++;
        votes[_ballotId].push(Vote(msg.sender, _choice));
        ballots[_ballotId].totalVotes++;

        emit VoteCast(_ballotId, msg.sender, _choice);
    }

    function getBallot(uint256 _ballotId) public view ballotExists(_ballotId) returns (
        string memory title,
        string memory description,
        string[] memory options,
        uint256 startTime,
        uint256 endTime,
        uint256 totalVotes
    ) {
        Ballot storage ballot = ballots[_ballotId];
        return (ballot.title, ballot.description, ballot.options, ballot.startTime, ballot.endTime, ballot.totalVotes);
    }

    function getVoteCount(uint256 _ballotId, uint256 _choice) public view ballotExists(_ballotId) returns (uint256) {
        return voteCounts[_ballotId][_choice];
    }

    function hasUserVoted(uint256 _ballotId, address _user) public view ballotExists(_ballotId) returns (bool) {
        return hasVoted[_ballotId][_user];
    }
}
