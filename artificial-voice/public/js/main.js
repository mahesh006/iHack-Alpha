const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
var myElement = document.getElementById('chat-window');
navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate;

const socket = io(window.location.origin);
var mc = new Hammer(myElement);

mc.on("tap press swiperight swipeleft doubletap", function(ev) {
  if (ev.type == 'tap'){
    let val = ".";
    document.getElementById("msg").value += val;
    navigator.vibrate(200);
  }else if(ev.type == 'press'){
    let val = "-";
    msg.value += val;
    navigator.vibrate(400);
  }else if(ev.type == 'swiperight'){
     let msg = document.getElementById("msg").value;
  
     //msg = document.getElementById("msg").trim();
     socket.emit('chatMessage', msg);
     document.getElementById("msg").value = '';
     document.getElementById("msg").focus();
    navigator.vibrate([800,800,1000]);
  }else if(ev.type == 'swipeleft'){
    let val = "  ";
    document.getElementById("msg").value += val;
    navigator.vibrate(300);
  }else if(ev.type == 'doubletap'){ 
    var trim = String(msg.value);
    document.getElementById("msg").value = trim.substr(0,trim.length - 3);  
    navigator.vibrate(300);
  }
});





// Get username and room from URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
});

//const socket = io();

// Join chatroom
socket.emit('joinRoom', { username, room });

// Get room and users
socket.on('roomUsers', ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

// Message from server
socket.on('message', message => {
  console.log(message);
  outputMessage(message);

  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submit

function send () {
  let msg = document.getElementById("msg").value;
  
     //msg = document.getElementById("msg").trim();
     socket.emit('chatMessage', msg);
     document.getElementById("msg").value = '';
     document.getElementById("msg").focus();
}

// Output message to DOM
function outputMessage(message) {
  //const div = document.createElement('div');
  //div.classList.add('message');
  //const p = document.createElement('p');
  //p.classList.add('meta');
  //p.innerText = message.username;
  //p.innerHTML += `<span>${message.time}</span>`;
  //div.replaceChild(p);
  //const para = document.createElement('p');
  //para.classList.add('text');
  //para.innerText = decodeMorse(message.text);
  //div.replaceChild(para);  
  chatMessages.innerHTML = '<p><strong>' +  decodeMorse(message.text) + '</strong></p><br>'; 
  //document.querySelector('.chat-messages').replaceChild(div);
  morse(message.text);
}

// Add room name to DOM
function outputRoomName(room) {
  roomName.innerText = room;
}

// Add users to DOM
function outputUsers(users) {
  userList.innerHTML = '';
  users.forEach(user=>{
    const li = document.createElement('li');
    li.innerText = user.username;
    userList.appendChild(li);
  });
 }

function morse(input) {  
    const        
       outputType = 'vibrate',
       dit = 100, 
       dah = dit * 3,
       symbolSpace = dit,
       letterSpace = dah,
       wordSpace = dit * 7,       
       morseChars = {
         " "  : "/",
         "a"  : "·−",
         "b"  : "−···",
         "c"  : "−·−·",
         "d"  : "−··",
         "e"  : "·",
         "f"  : "··−·",
         "g"  : "−−·",
         "h"  : "····",
         "i"  : "··",
         "j"  : "·−−−",
         "k"  : "−·−",
         "l"  : "·−··",
         "m"  : "−−",
         "n"  : "−·",
         "o"  : "−−−",
         "p"  : "·−−·",
         "q"  : "−−·−",
         "r"  : "·−·",
         "s"  : "···",
         "t"  : "−",
         "u"  : "··−",
         "v"  : "···−",
         "w"  : "·−−",
         "x"  : "−··−",
         "y"  : "−·−−",
         "z"  : "−−··",
         "1"  : "·−−−−",
         "2"  : "··−−−",
         "3"  : "···−−",
         "4"  : "····−",
         "5"  : "·····",
         "6"  : "−····",
         "7"  : "−−···",
         "8"  : "−−−··",
         "9"  : "−−−−·",
         "0"  : "−−−−−",
         "à"  : "·−−·−",
         "ä"  : "·−·−",
         "è"  : "·−··−",
         "é"  : "··−··",
         "ö"  : "−−−·",
         "ü"  : "··−−",
         "ß"  : "···−−··",
         "ñ"  : "−−·−−",
         "."   : "·−·−·−",
         ","   : "−−··−−",
         ":"   : "−−−···",
         ";"   : "−·−·−·",
         "?"   : "··−−··",
         "-"   : "−····−",
         "_"  : "··−−·−",
         "("   : "−·−−·",
         ")"   : "−·−−·−",
         "'"   : "·−−−−·",
         "="   : "−···−",
         "+"   : "·−·−·",
         "/"   : "−··−·",
         "@"   : "·−−·−·"
       };    
     
     
     function inputToMorse(input) {
       if (!input) {return;}
       const characters = input.toLowerCase().trim().split('');
       let output = [];
       characters.forEach(character => {
         if (morseChars[character]) {
           output.push(morseChars[character]);
         }
       });
       return output;
     }
     
     function morseCodeToTime(input) {
       let output = []; 
       let morseCode = inputToMorse(input);
       morseCode.forEach((set, index) => {
         let singleCharacters = set.split('');
         singleCharacters.forEach(char => {
           switch (char) {
             case "/":
               output.pop();
               output.push(wordSpace);
               break;
             case "·":
               output.push(dit, symbolSpace);
               break;
             case "−":
               output.push(dah, symbolSpace);
               break;
           }
         });
         if (output.slice(-1)[0] !== wordSpace) {
           output.pop();
           output.push(letterSpace);
         }
       });
       return output;
     }    
     
     function runSequence(input) {
       let timeSequence = morseCodeToTime(input);
       navigator.vibrate(timeSequence);       
     };
     runSequence(input);
   };


function decodeMorse(morseCode) {
  var ref = { 
    '.-':     'a',
    '-...':   'b',
    '-.-.':   'c',
    '-..':    'd',
    '.':      'e',
    '..-.':   'f',
    '--.':    'g',
    '....':   'h',
    '..':     'i',
    '.---':   'j',
    '-.-':    'k',
    '.-..':   'l',
    '--':     'm',
    '-.':     'n',
    '---':    'o',
    '.--.':   'p',
    '--.-':   'q',
    '.-.':    'r',
    '...':    's',
    '-':      't',
    '..-':    'u',
    '...-':   'v',
    '.--':    'w',
    '-..-':   'x',
    '-.--':   'y',
    '--..':   'z',
    '.----':  '1',
    '..---':  '2',
    '...--':  '3',
    '....-':  '4',
    '.....':  '5',
    '-....':  '6',
    '--...':  '7',
    '---..':  '8',
    '----.':  '9',
    '-----':  '0',  
    '/'    :  '   ',
  };

  return morseCode
    .split('   ')
    .map(
      a => a
        .split(' ')
        .map(
          b => ref[b]
        ).join('')
    ).join(' ');
}
