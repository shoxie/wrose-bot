let util = require("../../utils/utility");
let config = require("../../config/config.json");
let request = require("request");
module.exports = {
  config: {
    name: "corona",
    usage: "corona || [--track] || [--stop]",
    description: "Enable auto update COVID-19 status",
    ownerOnly: false,
    enabled: true
  },
  async run(client, message, args) {
    if (message.content.includes("--stop")) {
      clearInterval(coronaInterval);
    }
    if (message.content.includes("--track")) {
      coronaInterval = setInterval(async function() {
        await util.updateCorona(message);
      }, 5000);
    } else {
      request("https://coronavirus-tracker-api.herokuapp.com/all", function(
        error,
        response,
        body
      ) {
        let data = JSON.parse(body);
        message.channel.send({
          embed: {
            color: 14177041,
            title: "Corona(COVID-19) global update",
            fields: [
              {
                name: "Cases",
                value: data.latest.confirmed
              },

              {
                name: "Deaths confirmed",
                value: data.latest.deaths
              },
              {
                name: "Recoverd",
                value: data.latest.recovered
              }
            ]
          }
        });
        message.channel.send({
          embed: {
            color: 14177041,
            title: "Corona(COVID-19) updates",
            fields: [
              {
                name: "Infected",
                value: data.latest.confirmed
              },

              {
                name: "Deaths confirmed",
                value: data.latest.deaths
              },
              {
                name: "Recoverd",
                value: data.latest.recovered
              }
            ]
          }
        });
      });
    }
  }
};
