var socket = io.connect('http://127.0.0.1:3000');

socket.on('ghfollows', function (data) {
  document.querySelector('.item.ghfollows .maintext').innerHTML = data.followers;
});

socket.on('twitterfollowers', function(data) {
  document.querySelector('.item.twitterfollowers .maintext').innerHTML = data.followers;
});

socket.on('githubrepos', function(data) {
  document.querySelector('.item.githubrepos .maintext').innerHTML = data.repos;
});

socket.on('resptime', function(data) {
  document.querySelector('.item.resptime .maintext').innerHTML = data.ms;
});

var container = document.querySelector('#container');

var pckry = new Packery(container, {
  // options
  itemSelector: '.item',
  gutter: '.gutter-sizer',
  stamp: '.stamp',
  columnWidth: 180
});

var itemElems = pckry.getItemElements();
// for each item...
for ( var i=0, len = itemElems.length; i < len; i++ ) {
  var elem = itemElems[i];
  // make element draggable with Draggabilly
  var draggie = new Draggabilly( elem );
  // bind Draggabilly events to Packery
  pckry.bindDraggabillyEvents( draggie );
}
