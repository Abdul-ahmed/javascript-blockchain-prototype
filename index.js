const bodyParser = require("body-parser")
const express = require("express")
const request = require('request')
const Blockchain = require("./blockchain")
// const PubSub  = require("./app/pubsub.redis")
const PubSub  = require("./app/pubsub.pubnub")


const app = express()
const blockchain = new Blockchain()
const pubsub = new PubSub({blockchain})

const DEFAULT_PORT = 3000
const ROOT_NODE_ADDRESS = `http://localhost:${DEFAULT_PORT}`

app.use(bodyParser.json())

app.get("/api/v1/blockchain", (req, res) => {
    res.json(blockchain.chain)
})

app.post("/api/v1/mine-block", (req, res) => {
    const {data} = req.body
    blockchain.addBlock({data})
    pubsub.broadcastChain()
    res.redirect('/api/v1/blockchain')
})

const syncChains = () => {
    request({url: `${ROOT_NODE_ADDRESS}/api/v1/blockchain`}, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            const rootChain = JSON.parse(body)
            console.log('replace chain on a sync with', rootChain)
            blockchain.replaceChain(rootChain)
        } else {
            console.log(error)
        }
    })
}

let PEER_PORT;
if (process.env.GENERATE_PEER_PORT == 'true') {
    PEER_PORT = DEFAULT_PORT + Math.ceil(Math.random() * 1000)
}

const PORT = PEER_PORT || DEFAULT_PORT
app.listen(PORT, () => {
    console.log(`List on port localhost:${PORT}`)

    if (PORT !== DEFAULT_PORT) {
        syncChains()
    }
})