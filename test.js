const rp = require('request-promise');

const start = async () => {
  try {
    let options = {
      method: 'POST',
      uri: 'http://localhost:3040/api/',
      body: {
        keyword: 'asdfghjk1',
        from_id: '7123456',
        start_date: '2017-10-10',
        end_date: '2017-10-20',
      },
      json: true
    };
    let data = await rp(options)
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

start();