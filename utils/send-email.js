const SibApiV3Sdk = require("sib-api-v3-sdk");
const defaultClient = SibApiV3Sdk.ApiClient.instance;

const apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey =  process.env.SIB_API;

module.exports = function(recieverUser, recieverName, textContent) {
    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail = {
        sender: { email: "reset@pakwan.com" },
        to: [
        {
            email: recieverUser,
            name: recieverName,
        },
        ],
        subject: "Password Reset Link | Pakwan App",
        textContent: textContent,
    };
    apiInstance.sendTransacEmail(sendSmtpEmail).then(
        function () {
            console.log("Mail to: " + recieverUser);
        },
        function (error) {
            console.error(error);
        }
    );
}