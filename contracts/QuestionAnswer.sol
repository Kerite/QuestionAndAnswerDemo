// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract QuestionAnswer {
    string _question;
    uint[] _correctAnswer;
    uint _endTime;

    mapping(address => uint[]) _answerMapping;
    mapping(address => uint) _score;

    function putQuestion(
        string calldata question,
        uint[] calldata correctAnswer,
        uint endTime
    ) public {
        _question = question;
        _correctAnswer = correctAnswer;
        _endTime = endTime;
    }

    function getCorrectAnswer() public view returns (uint[] memory) {
        // require(block.timestamp > _endTime, "ERROR: TIME_ERROR");
        return (_correctAnswer);
    }

    function getQuestion() public view returns (string memory) {
        return (_question);
    }

    function getEndTime() public view returns (uint) {
        return (_endTime);
    }

    function putAnswer(uint[] calldata answer) public returns (uint) {
        uint correctAnswerLength = _correctAnswer.length;
        uint answerLength = answer.length;
        uint correctAnswerCounter = 0;

        _answerMapping[msg.sender] = answer;

        require(
            correctAnswerLength == answerLength,
            "ERROR: ANSWER_LENGTH_ERROR"
        );

        for (uint i = 0; i < _correctAnswer.length; i++) {
            if (_correctAnswer[i] == answer[i]) {
                correctAnswerCounter++;
            }
        }
        _score[msg.sender] = (correctAnswerCounter * 100) / correctAnswerLength;

        return _score[msg.sender];
    }

    function getAnswer() public view returns (uint[] memory) {
        return (_answerMapping[msg.sender]);
    }

    function getScore(address account) public view returns (uint) {
        return (_score[account]);
    }
}
