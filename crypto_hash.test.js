const { test } = require('node:test')
const cryptoHash = require('./crypto_hash')

describe("cryptoHash()", () => {
    // '9f4024faec10ef6d29aa32d7935d94b1a816fd4fe0359fbf12d49d44b5ff33b8'
    it("generate cryptoHash sha-256 output", () => {
        expect(cryptoHash("Love")).toEqual('9f4024faec10ef6d29aa32d7935d94b1a816fd4fe0359fbf12d49d44b5ff33b8')
    })

    it("produces the same hash with the same input arguments in any order", () => {
        expect(cryptoHash("I", "Love", "You")).toEqual(cryptoHash("You", "I", "Love"))
    })
})