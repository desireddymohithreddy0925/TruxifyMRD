import { expect } from "chai";

describe("Token", function () {
  it("should have test infrastructure ready", async function () {
    const [owner] = await ethers.getSigners();
    expect(owner.address).to.properAddress;
  });
});
