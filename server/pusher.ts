import Pusher from "pusher";

const getEnvs = () => {
    const appID = Bun.env.PUSHER_APP_ID;
    const key = Bun.env.PUSHER_KEY;
    const secret = Bun.env.PUSHER_SECRET;

    if (!appID || !key || !secret) {
        throw new Error("Could not get pusher envs");
    }

    return { appID, key, secret };
}

const pusher = new Pusher({
    appId: getEnvs().appID,
    key: getEnvs().key,
    secret: getEnvs().secret,
    cluster: "eu",
    useTLS: true
});

pusher.trigger("my-channel", "my-event", {
    message: "hello world"
});