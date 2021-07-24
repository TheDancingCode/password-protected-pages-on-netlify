const querystring = require('querystring');
const axios = require('axios');

exports.handler = async function (event, context) {
  const { password } = querystring.parse(event.body);
  const { redirect } = querystring.parse(event.headers.referer.split('?')[1]);

  const endpoint = `${process.env.URL}/.netlify/identity/token`;
  const data = querystring.stringify({
    grant_type: 'password',
    username: 'email@example.com',
    password: password,
  });
  const options = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  };

  try {
    const response = await axios.post(endpoint, data, options);
    const access_token = response.data.access_token;

    return {
      statusCode: 302,
      headers: {
        'Set-Cookie': `nf_jwt=${access_token}; Path=/; HttpOnly; Secure`,
        'Cache-Control': 'no-cache',
        Location: decodeURIComponent(redirect) || '/pro/',
      },
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 302,
      headers: {
        'Cache-Control': 'no-cache',
        Location: `/login/?redirect=${redirect}`,
      },
    };
  }
};
