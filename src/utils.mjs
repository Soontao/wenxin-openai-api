export async function fetchAccessToken() {
  const tokenAuth = await fetch(`https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${process.env.WEN_XIN_API_KEY}&client_secret=${process.env.WEN_XIN_SECRET_KEY}`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    }
  });
  const tokenResponse = await tokenAuth.json();
  if (tokenResponse.error) throw new Error(tokenResponse.error_description);
  return tokenResponse.access_token;
}