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

// const start = async () => {
//   try {
//     let options = {
//       method: 'POST',
//       uri: 'http://101.201.30.76:3039/api/news/page',
//       body: {
//         keyword: '猎场',
//         from_id: '58560a44731f6c8f5a851bf2',
//         start_date: '2017-11-01',
//         end_date: '2017-11-27',
//         pageNumber: '1',
//         pageSize: '10',
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
      uri: 'http://101.201.30.76:3039/api/news/update',
      body: {
        keyword: '创富英雄',
        from_id: '57b14a00a78b9eb67a71066d',
        start_date: '2017-01-01',
        end_date: '',
        update_date: '2017-01-01',
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