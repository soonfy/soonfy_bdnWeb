## baidu news api

1. /api/news/add    
> 添加，修改关键词    
> end_date可省略     

```
// post
body: {
  keyword: '猎场',
  from_id: '58560a44731f6c8f5a851bf2',
  start_date: '2017-11-21',
  end_date: '2017-11-21',
}
// response
{
  statusCode: 200,
  keyword_id: '5a0be1dccacb184e8e0aa9e2',
  keyword: '猎场',
  msg: '[百度新闻] 添加关键词add成功',
  error: '',
  stamp: 1510728156579
}
```

2. /api/news/delete    
> 删除关键词    

```
// post
body: {
  keyword: '猎场',
  from_id: '58560a44731f6c8f5a851bf2',
}
// response
{
  statusCode: 200,
  keyword_id: '5a0be1dccacb184e8e0aa9e2',
  keyword: '猎场',
  msg: '[百度新闻] 删除关键词delete成功',
  error: '',
  stamp: 1510728332141
}
```

3. /api/news/get     
> 请求提及量     

```
// post
body: {
  keyword: '猎场',
  from_id: '58560a44731f6c8f5a851bf2',
  start_date: '2017-11-21',
  end_date: '2017-11-21',
}
// response
{ 
  statusCode: 200,
  keyword_id: '5a0be316cacb184e8e0aa9e3',
  keyword: '猎场',
  news: 
   [ { _id: '5a0be4501613daceb7ee6dab',
       date: '2017-11-21T00:00:00.000Z',
       key_id: '5a0be316cacb184e8e0aa9e3',
       create_at: '2017-11-15T06:53:04.691Z',
       count: 90 } ],
  msg: '[百度新闻] 查询关键词提及量get成功',
  error: '',
  stamp: 1510728889233
}
```

4. /api/news/status     
> 请求任务状态     

```
// post
body: {
  keyword: '猎场',
  from_id: '58560a44731f6c8f5a851bf2',
  start_date: '2017-11-21',
  end_date: '2017-11-21',
}
// response
{ 
  statusCode: 200,
  keyword_id: '5a0be316cacb184e8e0aa9e3',
  keyword: '猎场',
  status: '数据完整',
  msg: '[百度新闻] 查询关键词状态status成功',
  error: '',
  stamp: 1510729032776
}
```

5. /api/news/content      
> 请求原文      

```
// post
body: {
  keyword: '猎场',
  from_id: '58560a44731f6c8f5a851bf2',
  start_date: '2017-11-21',
  end_date: '2017-11-21',
}
// response
{ 
  statusCode: 200,
  keyword_id: '5a0be316cacb184e8e0aa9e3',
  keyword: '猎场',
  total: 79,
  news: 
   [ { id: '5a0be316cacb184e8e0aa9e3httpwwwmnwcntvguonei1873262html',
       author: '闽南网',
       title: '猎场什么时候播出 每周几几点更新几集 各人物结局郑秋冬胡歌演技',
       summary: '­ 《猎场》电视剧也算是大家都期待很久的了,那么在剧情中我们也看到了其实这胡歌主演的电视剧的话一般来说都是很不错的并且还会引起不小的反响,还记得在《',
       date: '2017-11-21T06:53:04.691Z',
       url: 'http://www.mnw.cn/tv/guonei/1873262.html',
       crawl_at: '2017-11-15T06:53:04.691Z },
      ...
   ],
  msg: '[百度新闻] 查询关键词原文content成功',
  error: '',
  stamp: 1510729146428
}
```

6. /api/news/page     
> 请求原文      

```
// post
body: {
  keyword: '猎场',
  from_id: '58560a44731f6c8f5a851bf2',
  start_date: '2017-11-21',
  end_date: '2017-11-21',
  pageNumber = 1,
  pageSize = 10,
}
// response
{ 
  statusCode: 200,
  keyword_id: '5a0be316cacb184e8e0aa9e3',
  keyword: '猎场',
  total: 79,
  totalPage: 8,
  page: 1,
  size: 10,
  news: 
   [ { id: '5a0be316cacb184e8e0aa9e3httpwwwmnwcntvguonei1873262html',
       author: '闽南网',
       title: '猎场什么时候播出 每周几几点更新几集 各人物结局郑秋冬胡歌演技',
       summary: '­ 《猎场》电视剧也算是大家都期待很久的了,那么在剧情中我们也看到了其实这胡歌主演的电视剧的话一般来说都是很不错的并且还会引起不小的反响,还记得在《',
       date: '2017-11-21T06:53:04.691Z',
       url: 'http://www.mnw.cn/tv/guonei/1873262.html',
       crawl_at: '2017-11-15T06:53:04.691Z },
      ...
   ],
  msg: '[百度新闻] 查询关键词原文content成功',
  error: '',
  stamp: 1510729146428
}
```

7. /api/news/update     
> 增量查询

```
// post
body: {
  keyword: '猎场',
  from_id: '58560a44731f6c8f5a851bf2',
  start_date: '2017-11-21',
  end_date: '2017-11-21',
  update_date: '2017-11-21',
}
// response
{ 
  statusCode: 200,
  keyword_id: '58560a44731f6c8f5a851bf2',
  keyword: '猎场',
  news: 
   [ { _id: '5a0be4501613daceb7ee6dab',
       date: '2017-11-21T00:00:00.000Z',
       key_id: '58560a44731f6c8f5a851bf2',
       create_at: '2017-11-15T06:53:04.691Z',
       count: 90 } ],
  msg: '[百度新闻] 查询关键词提及量get成功',
  error: '',
  stamp: 1510728889233
}
```
