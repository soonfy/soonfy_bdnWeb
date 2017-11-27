const rp = require('request-promise');

// const start = async () => {
//   try {
//     let options = {
//       method: 'POST',
//       uri: 'http://101.201.30.76:3039/api/news/add',
//       body: {
//         keyword: '猎场+胡歌||猎场+万茜',
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
//       uri: 'http://101.201.30.76:3039/api/news/delete',
//       body: {
//         keyword: '猎场+胡歌||猎场+万茜',
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
//       uri: 'http://101.201.30.76:3039/api/news/get',
//       body: {
//         keyword: '猎场+胡歌||猎场+万茜',
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
//       uri: 'http://101.201.30.76:3039/api/news/status',
//       body: {
//         keyword: '猎场+胡歌||猎场+万茜',
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
//       uri: 'http://101.201.30.76:3039/api/news/content',
//       body: {
//         keyword: '猎场+胡歌||猎场+万茜',
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

const start = async () => {
  try {
    let options = {
      method: 'POST',
      uri: 'http://101.201.30.76:3039/api/news/page',
      body: {
        keyword: '猎场+胡歌||猎场+万茜',
        from_id: '57b12aeaa78b9eb67a7104e1',
        start_date: '2017-11-01',
        end_date: '2017-11-27',
        pageNumber: '1',
        pageSize: '10',
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