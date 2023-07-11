const cryptoHash = require('./crypto_hash')

describe("cryptoHash()", () => {
    it("generate cryptoHash sha-256 output", () => {
        expect(cryptoHash("Love")).toEqual('a00529c5da83d7540cc7bc60ef4d0e00c49c838bbc6447092525a0e548240ae7')
    })

    it("produces the same hash with the same input arguments in any order", () => {
        expect(cryptoHash("I", "Love", "You")).toEqual(cryptoHash("You", "I", "Love"))
    })

    it("produces a unique hash when the properties have changed on an input", () => {
        const foo = {}
        const originalHash = cryptoHash(foo)
        foo["a"] = "a"

        expect(cryptoHash(foo)).not.toEqual(originalHash)
    })
})