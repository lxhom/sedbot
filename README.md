# sedbot

This is a bot which responds to tweets containing `$sedthis (sed magic)` with the sed magic applied to the tweet above the mention.

This bot was written to be used with [deta](https://deta.sh) (with a 1 minute cron), but you can use it locally.

You can run it yourself or on deta.

Deta: Start by making a [deta](https://deta.sh) account, changing the keys in `keys.template.js` to your keys and renaming the file to `keys.js`, deploying the code on deta and setting the cron to 1 minute.

Locally: You can run it locally by doing `npm install` and then replacing a few lines of code in index.js:
```diff
- app.lib.cron(getTaggedTweets)
- module.exports = app
+ getTaggedTweets()
```
You need to call node index every minute for the bot to work.
