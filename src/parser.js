// https://www.amalgama-lab.com/songs/p/palaye_royale/lonely.html

var res = {name: '', artist: '', id: new Date().getTime(), original: [], translate: []}
var flag = true;
document.querySelectorAll('.string_container').forEach(item => {
  var translate = item.querySelector('.translate').textContent.trim();
  if (!flag || translate.includes('(перевод')) {
    flag = false;
    return;
  }
  res.original.push(item.querySelector('.original').textContent.trim());
  res.translate.push(item.querySelector('.translate').textContent.trim());
});

var title = document.querySelector('.original').textContent.replace(')', '').replace('*', '').replace('оригинал', '').split('(')
res.name = title[0].trim();
res.artist = title[1].trim();

copy(JSON.stringify(res));
