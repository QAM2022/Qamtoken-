const {
  BN,
  time,
  expectRevert,
} = require('@openzeppelin/test-helpers');
const { web3 } = require('@openzeppelin/test-helpers/src/setup');
const { expect } = require("chai");
const { artifacts } = require('hardhat');
const Token = artifacts.require('QTToken')

const ZERO = new BN('0');
const ONE = new BN('1');
const TWO = new BN('2');
const THREE = new BN('3');
const FOUR = new BN('4');
const FIVE = new BN('5');
const SIX = new BN('6');
const SEVEN = new BN('7');
const EIGHT = new BN('8');
const NINE = new BN('9');
const TEN = new BN('10');
const STO = new BN('100');

const DECIMALS_18 = new BN('1000000000000000000');
const DECIMALS_6 = new BN('1000000');
const TOTAL_SUPPLY = (new BN('1600000000')).mul(DECIMALS_18);
const PRICE = new BN('3300000000000000');
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

contract (
    'Crowdsale',
    ([
        owner,
        eva,
        alice, 
        privateSale,
        preSale,
        crowdsale,
        marketingTeam,
        managementTeam,
        advisors,
        bounties,
        liquidityPool,
        foundersReserve
    ]) => { 
    
    let TokenIns;

    beforeEach(async () => {      
      
      TokenIns = await Token.new(
        owner,
        privateSale,
        preSale,
        crowdsale,
        marketingTeam,
        managementTeam,
        advisors,
        bounties,
        liquidityPool,
        foundersReserve,
        { from: owner }
      );

   })

    it('#1 check deploying parameters', async() => {
      expect(await TokenIns.name({from: owner})).to.be.equal("QAM Token");
      expect(await TokenIns.symbol({from: owner})).to.be.equal("QAM");
      expect(await TokenIns.decimals({from: owner})).to.be.bignumber.equal(TEN.add(EIGHT));
      expect(await TokenIns.name({from: owner})).to.be.equal("QAM Token");
      expect(await TokenIns.symbol({from: owner})).to.be.equal("QAM");

      expect(await TokenIns.balanceOf(owner, {from: owner})).to.be.bignumber.equal((FIVE.mul(TEN).add(ONE)).mul(DECIMALS_6).mul(DECIMALS_18));
      expect(await TokenIns.balanceOf(privateSale, {from: owner})).to.be.bignumber.equal((FIVE).mul(DECIMALS_6).mul(DECIMALS_18));
      expect(await TokenIns.balanceOf(preSale, {from: owner})).to.be.bignumber.equal((FIVE).mul(DECIMALS_6).mul(DECIMALS_18));
      expect(await TokenIns.balanceOf(crowdsale, {from: owner})).to.be.bignumber.equal((TEN).mul(DECIMALS_6).mul(DECIMALS_18));
      expect(await TokenIns.balanceOf(marketingTeam, {from: owner})).to.be.bignumber.equal((THREE).mul(DECIMALS_6).mul(DECIMALS_18));
      expect(await TokenIns.balanceOf(managementTeam, {from: owner})).to.be.bignumber.equal((THREE).mul(DECIMALS_6).mul(DECIMALS_18));
      expect(await TokenIns.balanceOf(advisors, {from: owner})).to.be.bignumber.equal((ONE).mul(DECIMALS_6).mul(DECIMALS_18));
      expect(await TokenIns.balanceOf(bounties, {from: owner})).to.be.bignumber.equal((ONE).mul(DECIMALS_6).mul(DECIMALS_18));
      expect(await TokenIns.balanceOf(liquidityPool, {from: owner})).to.be.bignumber.equal((ONE).mul(DECIMALS_6).mul(DECIMALS_18));
      expect(await TokenIns.balanceOf(foundersReserve, {from: owner})).to.be.bignumber.equal((TEN.add(TEN)).mul(DECIMALS_6).mul(DECIMALS_18));
    })

    it('#2 check transfers', async() => {
      await TokenIns.transfer(alice, FIVE, {from: owner});
      expect(await TokenIns.balanceOf(alice, {from: owner})).to.be.bignumber.equal(FIVE);
      expect(await TokenIns.balanceOf(owner, {from: owner})).to.be.bignumber.equal(((FIVE.mul(TEN).add(ONE)).mul(DECIMALS_6).mul(DECIMALS_18)).sub(FIVE));

      await TokenIns.approve(eva, FIVE, {from: owner});
      await TokenIns.transferFrom(owner, alice, FIVE, {from: eva});
      expect(await TokenIns.balanceOf(alice, {from: owner})).to.be.bignumber.equal(TEN);
      expect(await TokenIns.balanceOf(owner, {from: owner})).to.be.bignumber.equal(((FIVE.mul(TEN).add(ONE)).mul(DECIMALS_6).mul(DECIMALS_18)).sub(TEN));
    })

    it('#3 check lockUp', async() => {
      await expectRevert(TokenIns.transfer(alice, TEN, {from: liquidityPool}), "QT: out of time for LIQ");
      await expectRevert(TokenIns.transferFrom(liquidityPool, alice, TEN, {from: eva}), "QT: out of time for LIQ");
      await time.increase(time.duration.days(90)); 
      await expectRevert(TokenIns.transfer(alice, TEN, {from: liquidityPool}), "QT: out of time for LIQ");
      await expectRevert(TokenIns.transferFrom(liquidityPool, alice, TEN, {from: eva}), "QT: out of time for LIQ");
      await time.increase(time.duration.days(275)); 
      await TokenIns.transfer(alice, TEN, {from: liquidityPool});
      expect(await TokenIns.balanceOf(alice, {from: owner})).to.be.bignumber.equal(TEN);
    })

    it('#4 check mint', async() => {
      await expectRevert(TokenIns.mint(alice, TEN, {from: liquidityPool}), "QT: must have minter role to mint");
      await TokenIns.mint(alice, TEN, {from: owner})
      expect(await TokenIns.balanceOf(alice, {from: owner})).to.be.bignumber.equal(TEN);
    })

    it('#5 check burn', async() => {
      await TokenIns.burn((TEN.add(TEN)).mul(DECIMALS_6).mul(DECIMALS_18), {from: foundersReserve})
      expect(await TokenIns.balanceOf(foundersReserve, {from: owner})).to.be.bignumber.equal(ZERO);

      await TokenIns.approve(eva, (FIVE.mul(TEN).add(ONE)).mul(DECIMALS_6).mul(DECIMALS_18), {from: owner});
      await TokenIns.burnFrom(owner, (FIVE.mul(TEN).add(ONE)).mul(DECIMALS_6).mul(DECIMALS_18), {from: eva})
      expect(await TokenIns.balanceOf(owner, {from: owner})).to.be.bignumber.equal(ZERO);

      await expectRevert(TokenIns.burn((TEN.add(TEN)), {from: liquidityPool}), "QT: out of time for LIQ");
    })


})