const NGROK = `${window.location.hostname}`;

let socket = io(NGROK, { path: '/real-time' });
console.log('Server IP: ', NGROK);

/*WEBSOCKET COMMUNICATION __________________________________________*/

const LED1 = document.getElementById('CheckLED1');
LED1.addEventListener('change', Lights);

const LED2 = document.getElementById('CheckLED2');
LED2.addEventListener('change', Lights);

function Lights(){

    const checkbox = this;
    let msn = '';

    if (checkbox.id === 'CheckLED1') {
    if (checkbox.checked) {
        msn = 'A1'
        console.log(msn);
        socket.emit('orderForArduino', msn);
        } else {
            msn = 'A0'
            console.log(msn);
            socket.emit('orderForArduino', msn);
        }
    }
    else if (checkbox.id === 'CheckLED2') {
    if (checkbox.checked) {
        msn = 'B1'
        console.log(msn);
        socket.emit('orderForArduino', msn);
        } else {
            msn = 'B0'
            console.log(msn);
            socket.emit('orderForArduino', msn);
        }
    }
};

socket.on('arduinoMessage', (arduinoMessage) => { //Recibe mensaje arduino
    console.log(arduinoMessage);
    let { actionA, actionB, signal } = arduinoMessage;
    updateLightLevel(actionA, signal);
    updateLEDstatus(actionA, actionB, signal);
})

function updateLightLevel(actionA, signal) {
    
    let levelMessage;

    if(actionA == 'P'){

        if (signal <= 500) {
            levelMessage = `  <div id="Light_Level_Text">
                                  <div class="Light_Bar_Grey">
                                      <div class="Bar" id="Low_Bar"></div>
                                  </div>
                                  <h3>Low Light</h3> <br>
                                  <p>Consider turning on both lights</p>
                              </div>
                          `;
          } else if (signal >= 500 && signal <= 800) {
            levelMessage = `   
                              <div id="Light_Level_Text">
                                  <div class="Light_Bar_Grey">
                                      <div class="Bar" id="Medium_Bar""></div>
                                  </div>
                                  <h3>Medium Light</h3> <br>
                                  <p>Consider turning on one light</p>
                              </div>
                          `;
          } else {
            levelMessage = `   
                              <div id="Light_Level_Text">
                                  <div class="Light_Bar_Grey">
                                      <div class="Bar" id="High_Bar""></div>
                                  </div>
                                  <h3>High Light</h3> <br>
                                  <p>Consider turning off both lights</p>
                              </div>
                          `;
          }
          document.getElementById("Light_Level").innerHTML = levelMessage;      
    }

    };

    function updateLEDstatus(actionA, actionB, signal){

        var Bulb1 = document.getElementById("Bulb1");
        var Bulb2 = document.getElementById("Bulb2");

        var Light1 = document.getElementById("Light1");
        var Light2 = document.getElementById("Light2");

        var Label1 = document.getElementById("Label1");
        var Label2 = document.getElementById("Label2");

        var Status1 = document.getElementById("Status1");
        var Status2 = document.getElementById("Status2");
        
        if (actionA == 'L'){

            if(actionB == 'A'){

                switch (signal) {
                    case 0:
                        console.log('LED 1 Off');
                        Status1.innerHTML = 'is off';
                                    
                        Bulb1.src = "./img/Bulb_off.png";
                        Light1.style.backgroundColor = "#05055d";
                        Label1.style.color = "#ffffff";
                        Status1.style.color = "#ffffff";

                        break;
                
                    case 1:
                        console.log('LED 1 On');
                        Status1.innerHTML = 'is on';

                        Bulb1.src = "./img/Bulb_on.png";
                        Light1.style.backgroundColor = "#f8e8cc";
                        Label1.style.color = "#444444";
                        Status1.style.color = "#444444";

                        break;
                }
            }

            if(actionB == 'B'){

                switch (signal) {
                    case 0:
                        console.log('LED 2 Off');
                        Status2.innerHTML = 'is off';

                        Bulb2.src = "./img/Bulb_off.png";
                        Light2.style.backgroundColor = "#05055d";
                        Label2.style.color = "#ffffff";
                        Status2.style.color = "#ffffff";

                        break;
                
                    case 1:
                        console.log('LED 2 On');
                        Status2.innerHTML = 'is on';

                        Bulb2.src = "./img/Bulb_on.png";
                        Light2.style.backgroundColor = "#f8e8cc";
                        Label2.style.color = "#444444";
                        Status2.style.color = "#444444";

                        break;
                }
            }
        }
    }