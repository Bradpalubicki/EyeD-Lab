import { ethers } from 'hardhat';
import { expect } from 'chai';

describe('Contract Deployment Smoke Tests', function () {
  it('should deploy EyeDIdentity', async function () {
    const factory = await ethers.getContractFactory('EyeDIdentity');
    const contract = await factory.deploy();
    expect(await contract.getAddress()).to.be.properAddress;
  });

  it('should deploy EyeDAccess', async function () {
    const factory = await ethers.getContractFactory('EyeDAccess');
    const contract = await factory.deploy();
    expect(await contract.getAddress()).to.be.properAddress;
  });

  it('should deploy EyeDSession', async function () {
    const factory = await ethers.getContractFactory('EyeDSession');
    const contract = await factory.deploy();
    expect(await contract.getAddress()).to.be.properAddress;
  });

  it('should deploy EyeDAudit', async function () {
    const factory = await ethers.getContractFactory('EyeDAudit');
    const contract = await factory.deploy();
    expect(await contract.getAddress()).to.be.properAddress;
  });

  it('should deploy EyeDGuardian', async function () {
    const factory = await ethers.getContractFactory('EyeDGuardian');
    const contract = await factory.deploy();
    expect(await contract.getAddress()).to.be.properAddress;
  });

  it('should deploy EyeDProxy', async function () {
    const factory = await ethers.getContractFactory('EyeDProxy');
    const contract = await factory.deploy();
    expect(await contract.getAddress()).to.be.properAddress;
  });

  it('should deploy EyeDVerifier', async function () {
    const factory = await ethers.getContractFactory('EyeDVerifier');
    const contract = await factory.deploy();
    expect(await contract.getAddress()).to.be.properAddress;
  });
});
