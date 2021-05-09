let Twit = require("twit")
let keys = require("./keys.js")
let child_process = require("child_process")
let fs = require("fs")
let { app } = require("deta")

let T = new Twit(keys.twitter)

let getTaggedTweets = async () => {
  let res = await T.get("search/tweets", {q: "$sedthis", result_type: "recent"})
  console.log(res.data.statuses)
  for (let status of res.data.statuses) {
    console.log(getDateSecondsAge(status.created_at))
    if (getDateSecondsAge(status.created_at) <= 120) {
      try { await interpretTweet(status) } catch (e) {
        console.log(e)
      }
    }
  }
}

let interpretTweet = async status => {
  let scriptTweet = status.text;
  let scriptIndex = scriptTweet.match(/\$sedthis/).index + "$sedthis".length + 1;
  let script = scriptTweet.substr(scriptIndex)

  let text = (await T.get("statuses/show", {id: status.in_reply_to_status_id_str})).data.text;

  let output = execSed(text, script).replace(/\$sedthis/g, "#sedthis")

  await T.post("statuses/update", {status: output, in_reply_to_status_id: status.id_str, auto_populate_reply_metadata: true});
}

let getDateSecondsAge = string => (Date.now() - new Date(string)) / 1000

let execSed = (text, script) => {
  fs.writeFileSync("/tmp/t", text);
  fs.writeFileSync("/tmp/s", script);
  return child_process.execSync("./sed --sandbox -f /tmp/s /tmp/t").toString()
}

// deta stuff (replace this with getTaggedTweets() if you want to run it locally
app.lib.cron(getTaggedTweets)
module.exports = app
