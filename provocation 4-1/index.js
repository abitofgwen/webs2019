var chatMessages = [{
  name: "ms1",
  msg: "Hi Bot, I want to withdraw $120 for new cosmetics.",
  delay: 1000,
  align: "right",
  showTime: true,
  time: "19:58",
  num:"1"
},
{
  name: "ms2",
  msg: "Ok. Please choose from persuade me or play Funding Invader.",
  delay: 3000,
  align: "left",
  showTime: true,
  time: "19:58",
  num:"2"
},
{
  name: "ms3",
  msg: "Funding Invader, thanks.",
  delay: 3000,
  align: "right",
  showTime: true,
  time: "19:58",
  num:"3"
},
{
  name: "ms4",
  msg: "Loading...",
  delay: 2000,
  align: "left",
  showTime: false,
  time: "19:58",
  num:"4"
}];
var chatDelay = 0;

function onRowAdded() {
  $('.chat-container').animate({
    scrollTop: $('.chat-container').prop('scrollHeight')
  });
};

function msg(){
 $.each(chatMessages, function(index, obj) {
  chatDelay = chatDelay + 1000;
  chatDelay2 = chatDelay + obj.delay;
  chatDelay3 = chatDelay2 + 10;
  scrollDelay = chatDelay;
  chatTimeString = " ";
  msgname = "." + obj.name;
  msginner = ".messageinner-" + obj.name;
  spinner = ".sp-" + obj.name;
  if (obj.showTime == true) {
    chatTimeString = "<span class='message-time'>" + obj.time + "</span>";
  }
  $(".chat-message-list").append("<li class='message-" + obj.align + " " + obj.name + "' hidden><div class='sp-" + obj.name + "'><span class='spinme-" + obj.align + "'><div class='spinner'><div class='bounce1'></div><div class='bounce2'></div><div class='bounce3'></div></div></span></div><div class='messageinner-" + obj.name + "' hidden><span class='message-text'>" + obj.msg + "</span>" + chatTimeString + "</div></li>");
  $(msgname).delay(chatDelay).fadeIn();
  $(spinner).delay(chatDelay2).hide(1);
  $(msginner).delay(chatDelay3).fadeIn();
  setTimeout(onRowAdded, chatDelay);
  setTimeout(onRowAdded, chatDelay3);
  chatDelay = chatDelay3;
 });
}

function addSpaceInvader() {
  $(".chat-listcontainer").append("<canvas id='space-invaders' width='300' height='300'></canvas>");
}
function run() {
  msg();
  setTimeout(addSpaceInvader, 14000);
}
run();

//function runSpaceInvader() {
//
//};
