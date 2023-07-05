const PubNub = require("pubnub");

const credentials = {
    publishKey: "pub-c-603ee9d3-4412-4a78-b10f-2be3be3b969c",
    subscribeKey: "sub-c-24a29ef6-d0bf-4bdb-bb38-4de3ddf8a42a",
    secretKey: "sec-c-ZTEyYjU3MzMtNzg4ZC00YjliLTkzNjEtZmZiZWEzZmVkMjEy",
};

const CHANNELS = {
    TEST: "TEST",
    BLOCKCHAIN: "BLOCKCHAIN",
};

class PubSub {
    constructor({ blockchain }) {
        this.blockchain = blockchain;

        this.pubnub = new PubNub(credentials);
        this.pubnub.subscribe({
            channels: Object.values(CHANNELS),
        });

        this.pubnub.addListener(this.listener());
    }

    handleMessage(channel, message) {
        console.log(`Message received. Channel: ${channel}. Message: ${message}`);
        const parseMessage = JSON.parse(message);
        if (channel === CHANNELS.BLOCKCHAIN) {
            this.blockchain.replaceChain(parseMessage)
        }
    }

    listener() {
        return {
            message: messageObject => {
                const { channel, message } = messageObject;
                this.handleMessage(channel, message);
                console.log(
                    `Message received. Channel: ${channel}. Message: ${message}`
                );
            },
        };
    }

    publish({ channel, message }) {
        this.pubnub.publish({channel, message})
    }

    broadcastChain() {
        this.publish({
            channel: CHANNELS.BLOCKCHAIN,
            message: JSON.stringify(this.blockchain.chain),
        });
    }
}

// const testPubSub = new PubSub()
// setTimeout(() => testPubSub.publish({channel: CHANNELS.TEST, message: "Hello PubNub"}), 1000)

module.exports = PubSub;
