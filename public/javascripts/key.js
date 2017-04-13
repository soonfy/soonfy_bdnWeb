$(function () {
  $('.remove').click(function (e) {
    let target = $(e.target);
    let id = target.data('id');
    $('.' + id).remove();
    $.ajax({
      type: 'DELETE',
      url: '/key/remove?id=' + id
    })
  })

  $('.download').click(function (e) {
    let target = $(e.target);
    let id = target.data('id');
    window.location = `/key/download?id=${id}`
    // $.ajax({
    //   type: 'GET',
    //   url: '/key/download?id=' + id
    // })
  })
})