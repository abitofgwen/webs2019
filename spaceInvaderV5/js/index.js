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

//function runSpaceInvader
;(function() {

  // Main game object
  // ----------------

  // **new Game()** Creates the game object with the game state and logic.
  var Game = function() {

    // In index.html, there is a canvas tag that the game will be drawn in.
    // Grab that canvas out of the DOM.
    var canvas = document.getElementById("space-invaders");

    // Get the drawing context.  This contains functions that let you draw to the canvas.
    var screen = canvas.getContext('2d');

    // Note down the dimensions of the canvas.  These are used to
    // place game bodies.
    var gameSize = { x: canvas.width, y: canvas.height };

    // Create the bodies array to hold the player, invaders and bullets.
    this.bodies = [];

    // Add the invaders to the bodies array.
    this.bodies = this.bodies.concat(createInvaders(this));

    // Add the player to the bodies array.
    this.bodies = this.bodies.concat(new Player(this, gameSize));

    var self = this;

    // Main game tick function.  Loops forever, running 60ish times a second.
    var tick = function() {

      // Update game state.
      self.update();

      // Draw game bodies.
      self.draw(screen, gameSize);

      // Queue up the next call to tick with the browser.
      requestAnimationFrame(tick);
    };

    // Run the first game tick.  All future calls will be scheduled by
    // the tick() function itself.
    tick();
  };

  Game.prototype = {

    // **update()** runs the main game logic.
    update: function() {
      var self = this;

      // `notCollidingWithAnything` returns true if passed body
      // is not colliding with anything.
      var notCollidingWithAnything = function(b1) {
        return self.bodies.filter(function(b2) { return colliding(b1, b2); }).length === 0;
      };

      // Throw away bodies that are colliding with something. They
      // will never be updated or draw again.
      this.bodies = this.bodies.filter(notCollidingWithAnything);

      // Call update on every body.
      for (var i = 0; i < this.bodies.length; i++) {
        this.bodies[i].update();
      }
    },

    // **draw()** draws the game.
    draw: function(screen, gameSize) {
      // Clear away the drawing from the previous tick.
      screen.clearRect(0, 0, gameSize.x, gameSize.y);

      // Draw each body.
      for (var i = 0; i < this.bodies.length; i++) {
        if (this.bodies[i].isPlayer) {
          drawRect(screen, this.bodies[i]);
        } else {
          drawEllipse(screen, this.bodies[i]);
        }
      }
    },

    // **invadersBelow()** returns true if `invader` is directly
    // above at least one other invader.
    invadersBelow: function(invader) {
      // If filtered array is not empty, there are invaders below.
      return this.bodies.filter(function(b) {
        // Keep `b` if it is an invader, if it is in the same column
        // as `invader`, and if it is somewhere below `invader`.
        return b instanceof Invader &&
          Math.abs(invader.center.x - b.center.x) < b.size.x &&
          b.center.y > invader.center.y;
      }).length > 0;
    },

    // **addBody()** adds a body to the bodies array.
    addBody: function(body) {
      this.bodies.push(body);
    }
  };

  // Invaders
  // --------

  // **new Invader()** creates an invader.
  var Invader = function(game, center) {
    this.game = game;
    this.center = center;
    this.size = { x: 17 , y: 17 };

    // Invaders patrol from left to right and back again.
    // `this.patrolX` records the current (relative) position of the
    // invader in their patrol.  It starts at 0, increases to 40, then
    // decreases to 0, and so forth.
    this.patrolX = 0;

    // The x speed of the invader.  A positive value moves the invader
    // right. A negative value moves it left.
    this.speedX = 0.5;
  };

  Invader.prototype = {
    isPlayer: false,
    // **update()** updates the state of the invader for a single tick.
    update: function() {

      // If the invader is outside the bounds of their patrol...
      if (this.patrolX < 0 || this.patrolX > 30) {

        // ... reverse direction of movement.
        this.speedX = -this.speedX;
      }

      // If coin flip comes up and no friends below in this
      // invader's column...
      if (Math.random() > 0.995 &&
          !this.game.invadersBelow(this)) {

        // ... create a bullet just below the invader that will move
        // downward...
        var bullet = new Bullet({ x: this.center.x, y: this.center.y + this.size.y / 2 },
                                { x: Math.random() - 0.5, y: 2 });

        // ... and add the bullet to the game.
        this.game.addBody(bullet);
      }

      // Move according to current x speed.
      this.center.x += this.speedX;

      // Update variable that keeps track of current position in patrol.
      this.patrolX += this.speedX;
    }
  };

  // **createInvaders()** returns an array of twenty-four invaders.
  var createInvaders = function(game) {
    var invaders = [];
    for (var i = 0; i < 24; i++) {

      // Place invaders in eight columns.
      var x = 30 + (i % 8) * 30;

      // Place invaders in three rows.
      var y = 30 + (i % 3) * 30;

      // Create invader.
      invaders.push(new Invader(game, { x: x, y: y}));
    }

    return invaders;
  };

  // Player
  // ------

  // **new Player()** creates a player.
  var Player = function(game, gameSize) {
    this.game = game;
    this.size = { x: 15, y: 15 };
    this.center = { x: gameSize.x / 2, y: gameSize.y - this.size.y * 2 };

    // Create a keyboard object to track button presses.
    this.keyboarder = new Keyboarder();
  };

  Player.prototype = {
    isPlayer: true,
    // **update()** updates the state of the player for a single tick.
    update: function() {
      // If left cursor key is down...
      if (this.keyboarder.isDown(this.keyboarder.KEYS.LEFT)) {

        // ... move left.
        this.center.x -= 1.5;

      } else if (this.keyboarder.isDown(this.keyboarder.KEYS.RIGHT)) {
        this.center.x += 1.5;
      }

      // If S key is down...
      if (this.keyboarder.isDown(this.keyboarder.KEYS.S)) {
        // ... create a bullet just above the player that will move upwards...
        var bullet = new Bullet({ x: this.center.x, y: this.center.y - this.size.y - 3},
                                { x: 0, y: -5 });

        // ... add the bullet to the game...
        this.game.addBody(bullet);
      }
    }
  };

  // Bullet
  // ------

  // **new Bullet()** creates a new bullet.
  var Bullet = function(center, velocity) {
    this.center = center;
    this.size = { x: 3, y: 3 };
    this.velocity = velocity;
  };

  Bullet.prototype = {

    // **update()** updates the state of the bullet for a single tick.
    update: function() {

      // Add velocity to center to move bullet.
      this.center.x += this.velocity.x;
      this.center.y += this.velocity.y;
    }
  };

  // Keyboard input tracking
  // -----------------------

  // **new Keyboarder()** creates a new keyboard input tracking object.
  var Keyboarder = function() {

    // Records up/down state of each key that has ever been pressed.
    var keyState = {};

    // When key goes down, record that it is down.
    window.addEventListener('keydown', function(e) {
      keyState[e.keyCode] = true;
    });

    // When key goes up, record that it is up.
    window.addEventListener('keyup', function(e) {
      keyState[e.keyCode] = false;
    });

    // Returns true if passed key is currently down.  `keyCode` is a
    // unique number that represents a particular key on the keyboard.
    this.isDown = function(keyCode) {
      return keyState[keyCode] === true;
    };

    // Handy constants that give keyCodes human-readable names.
    this.KEYS = { LEFT: 37, RIGHT: 39, S: 83 };
  };

  // Other functions
  // ---------------

  var drawRect = function(screen, body) {
    screen.fillStyle = 'white';
    screen.fillRect(body.center.x - body.size.x / 2, body.center.y - body.size.y / 2,
                   body.size.x, body.size.y);
    //screen.ellipse(body.center.x - body.size.x / 2, body.center.y - body.size.y / 2, body.size.x, body.size.y,0,0,0);
    //drawEgg();
  };
// **drawEllipse()** draws passed body as a rectangle to `screen`, the drawing context.
  var drawEllipse = function(screen, body) {
    screen.fillStyle = "#FA3";
    screen.beginPath();
    screen.ellipse(body.center.x - body.size.x / 2, body.center.y - body.size.y / 2, body.size.x  / 2 , body.size.y  / 2, Math.PI / 4, 0, 2 * Math.PI);
    screen.fill();
    //screen.fillStyle = 'white';
    //screen.fillRect(body.center.x - body.size.x / 2, body.center.y - body.size.y / 2,
    //               body.size.x, body.size.y);
    //drawEgg();
  };

  // **colliding()** returns true if two passed bodies are colliding.
  // The approach is to test for five situations.  If any are true,
  // the bodies are definitely not colliding.  If none of them
  // are true, the bodies are colliding.
  // 1. b1 is the same body as b2.
  // 2. Right of `b1` is to the left of the left of `b2`.
  // 3. Bottom of `b1` is above the top of `b2`.
  // 4. Left of `b1` is to the right of the right of `b2`.
  // 5. Top of `b1` is below the bottom of `b2`.
  var colliding = function(b1, b2) {
    return !(
      b1 === b2 ||
        b1.center.x + b1.size.x / 2 < b2.center.x - b2.size.x / 2 ||
        b1.center.y + b1.size.y / 2 < b2.center.y - b2.size.y / 2 ||
        b1.center.x - b1.size.x / 2 > b2.center.x + b2.size.x / 2 ||
        b1.center.y - b1.size.y / 2 > b2.center.y + b2.size.y / 2
    );
  };

  // Start game
  // ----------

  // When the DOM is ready, create (and start) the game.
  window.addEventListener('DOMNodeInserted', function() {
    new Game();
  });
})();
