const rp = require('request-promise');

// const start = async () => {
//   try {
//     let options = {
//       method: 'POST',
//       uri: 'http://localhost:3040/api/news/add',
//       body: {
//         keyword: '猎场',
//         from_id: 'soonfy-1113-21',
//         start_date: '2017-11-01',
//         end_date: '2017-11-01',
//       },
//       json: true
//     };
//     let data = await rp(options)
//     console.log(data);
//   } catch (error) {
//     console.error(error);
//   }
// }

// const start = async () => {
//   try {
//     let options = {
//       method: 'POST',
//       uri: 'http://localhost:3040/api/news/delete',
//       body: {
//         keyword: '猎场',
//         from_id: 'soonfy-1113-21',
//       },
//       json: true
//     };
//     let data = await rp(options)
//     console.log(data);
//   } catch (error) {
//     console.error(error);
//   }
// }

// const start = async () => {
//   try {
//     let options = {
//       method: 'POST',
//       uri: 'http://localhost:3040/api/news/status',
//       body: {
//         keyword: '猎场',
//         from_id: 'soonfy-1113',
//         start_date: '2017-11-01',
//         end_date: '2017-11-01',
//       },
//       json: true
//     };
//     let data = await rp(options)
//     console.log(data);
//   } catch (error) {
//     console.error(error);
//   }
// }

const start = async () => {
  try {
    let options = {
      method: 'POST',
      uri: 'http://localhost:3040/api/news/content',
      body: {
        keyword: '猎场',
        from_id: 'soonfy-1113-2',
        start_date: '2017-11-01',
        end_date: '2017-11-01',
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