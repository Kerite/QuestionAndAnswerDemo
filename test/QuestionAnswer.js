const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");
const chai = require("chai")
const { expect } = chai;
const BigNumber = ethers.BigNumber;
const BN = require('bn.js');
chai.use(require("chai-bn")(BN))

describe("Lock", function () {
  const question = "1:1+1;2:2+2"
  var deployedContract
  var Owner
  var OtherAccount


  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployOneYearLockFixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const QuestionAnswer = await ethers.getContractFactory("QuestionAnswer");
    const questionAnswer = await QuestionAnswer.deploy();
    deployedContract = questionAnswer
    Owner = owner
    OtherAccount = otherAccount

    return { questionAnswer, owner, otherAccount };
  }

  describe("Deployment", function () {
    it("Should Set Answer And CorrectAnswer Correctly", async function () {
      const { questionAnswer, owner, otherAccount } = await deployOneYearLockFixture()

      await questionAnswer.putQuestion(question, [2, 4], await time.latest() + 10)
      expect(await questionAnswer.getQuestion()).to.equal(question)

      console.log(await questionAnswer.getCorrectAnswer())
      expect(await questionAnswer.getCorrectAnswer()).to.eql([
        BigNumber.from(2), BigNumber.from(4)
      ])
    })

    it("Should Put Answer And Calculate Score Correctly", async () => {
      await deployedContract.connect(OtherAccount).putAnswer([
        BigNumber.from(4), BigNumber.from(4)
      ])
      expect(await deployedContract.connect(OtherAccount).getAnswer()).to.eql([
        BigNumber.from(4), BigNumber.from(4)
      ])
      expect(await deployedContract.getScore(OtherAccount.address)).to.equal(
        BigNumber.from(50)
      )
    })
  });
});
