const axios = require('axios');
const { HttpsProxyAgent } = require('https-proxy-agent');

const url = 'https://ip.smartproxy.com/json';
const proxyAgent = new HttpsProxyAgent(
  'http://spqfw757zp:1k3dEkk7HgBrebz7iA@gate.smartproxy.com:10000');

axios
  .get(url, {
    httpsAgent: proxyAgent,
  })
  .then((response) => {
    console.log(response.data);
  });