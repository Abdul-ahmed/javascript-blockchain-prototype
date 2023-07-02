const MINE_RATE = 1000 //1000 milliseconds = 1sec
const INITIAL_DIFFICULT = 3;

const GENESIS_DATA = {
    timestamp: "2023/06/30",
    previousHash: "GenesisHasNoPreviousHash",
    hash: "ActiveBlockHash",
    difficulty: INITIAL_DIFFICULT,
    nonce: 0,
    data: []
}

module.exports = {GENESIS_DATA, MINE_RATE}