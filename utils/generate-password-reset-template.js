module.exports = function(email, resetCode, expiration){
    const textContent = `
    <html><head><style>.center{display:flex;justify-content:center}.card{border-radius:16px;border:.5px solid rgba(0,0,0,.2);padding:1rem;width:30rem}.resetcode{font-size:1.3rem;font-weight:700}</style></head><body class="center"><div class="center"><section class="card"><div class="center"><img src="https://res.cloudinary.com/zayazzp/image/upload/v1642502330/pakwan-logo_fay29f.png"></div><h1>Password Reset Code</h1><p>Pakwan recieved a request to reset<b>:${email}</b></p><p>Your password reset code is:</p><p class="center resetcode">${resetCode}</p><p>Your password expiration: ${expiration}</p><p>If this was you, you can ignore this message. There's no need to take any action. This code will expire in 24Hours</p><p>Thanks,<br>Pakwan Team</p></section></div></body></html>
    `
    return textContent
}