module.exports = {
  config: {
    name: "catStatusCode",
    usage: "",
    aliases: ["catus"],
    description: "",
    ownerOnly: false,
    enabled: true,
  },
  async run(client, message, args) {
    if (!args[0]) return message.reply("Please provide a status code.");
    const referenceUrl =
      "https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/";
    try {
      const statusCode = args[0];
      const status_codes = [
        100,
        101,
        200,
        201,
        202,
        204,
        206,
        207,
        300,
        301,
        302,
        303,
        304,
        305,
        306,
        307,
        400,
        401,
        402,
        403,
        404,
        405,
        406,
        408,
        409,
        410,
        411,
        412,
        413,
        414,
        415,
        416,
        417,
        418,
        419,
        420,
        421,
        422,
        423,
        424,
        425,
        426,
        429,
        431,
        444,
        450,
        500,
        502,
        503,
        504,
        506,
        507,
        508,
        509,
        510,
        511,
        599,
      ];

      if (status_codes.includes(parseInt(statusCode))) {
        message.reply(`https://http.cat/${statusCode}`);
        message.reply(
          `For more information, see: <${referenceUrl}${statusCode}>`
        );
      } else {
        message.reply(
          "Sorry, the cats of the HTTP underworld don't recognize that code."
        );
      }
    } catch (error) {
      console.error(error);
    }
  },
};
