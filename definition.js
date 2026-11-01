const StemKitColorBlock = '#44cbc6';
const ImgUrl = 'https://ohstem-public.s3.ap-southeast-1.amazonaws.com/extensions/AITT-VN/yolobit_extension_stem_starterkit/images/';
const ImgUrl2 = 'https://ohstem-public.s3.ap-southeast-1.amazonaws.com/extensions/AITT-VN/yolobit_extension_rover/images/';
// RGB LED
Blockly.Blocks["stemkit_led_tiny"] = {
  init: function () {
    this.jsonInit({
      inputsInline: true,
      colour: StemKitColorBlock,
      nextStatement: null,
      tooltip: Blockly.Msg.BLOCK_STEMKIT_LED_TINY_TOOLTIP,
      message0: Blockly.Msg.BLOCK_STEMKIT_LED_TINY_MESSAGE0,
      previousStatement: null,
      args0: [
        {
          type: "field_dropdown",
          name: "port",
          "options": [
            [
              "A",
              "pin0"
            ],
            [
              "B",
              "pin1"
            ]
          ],
        },
        {
          type: "field_dropdown",
          name: "option",
          options: [
            [Blockly.Msg.BLOCK_STEMKIT_ALL_MSG, "0"],
            ["1", "1"],
            ["2", "2"],
            ["3", "3"],
            ["4", "4"],
          ],
        },
        { type: "input_value", name: "COLOR" },
        {type: "input_dummy"},
        {
          "type": "field_image",
          "src": ImgUrl + 'tiny-rgb.png',
          "width": 30,
          "height": 30,
          "alt": "*",
          "flipRtl": false
        }
      ],
      helpUrl: ""
    });
  },
};

Blockly.Python['stemkit_led_tiny'] = function(block) {
  var port = block.getFieldValue('port');
  var option = block.getFieldValue('option');
  var color = Blockly.Python.valueToCode(block, 'COLOR', Blockly.Python.ORDER_ATOMIC);
  Blockly.Python.definitions_['import_yolobit'] = 'from yolobit import *';
  Blockly.Python.definitions_['import_led_tiny'] = 'from stemkit_rgbled import RGBLed';
  Blockly.Python.definitions_['import_led_tiny_init'] = 'tiny_rgb = RGBLed(' + port + '.pin, 4)';
  // TODO: Assemble Python into code variable.
  var code = "tiny_rgb.show(" + option + ", hex_to_rgb(" + color + "))\n";
  return code;
};


// Ultrasonic

Blockly.Blocks['stemkit_ultrasonic_read'] = {
  init: function () {
    this.jsonInit(
      {
        "type": "stemkit_ultrasonic_read",
        "message0": Blockly.Msg.BLOCK_STEMKIT_SONIC_READ_MESSAGE0,
        "args0": [
          {
            "type": "field_dropdown",
            "name": "PORT",
            "options": [
              [
                "A",
                "A"
              ],
              [
                "B",
                "B"
              ]
            ]
          },
          {
            "type": "field_image",
            "src": ImgUrl + 'ultrasonic.png',
            "width": 30,
            "height": 30,
            "alt": "*",
            "flipRtl": false
          }
        ],
        "output": null,
        "colour": StemKitColorBlock,
        "tooltip": Blockly.Msg.BLOCK_STEMKIT_SONIC_READ_TOOLTIP,
        "helpUrl": ""
      }
    );
  },

};

Blockly.Python['stemkit_ultrasonic_read'] = function (block) {
  var dropdown_port = block.getFieldValue('PORT');
  var port ;
  if (dropdown_port == 'A'){
    port = "stemkit_ultrasonic = HCSR04(trigger_pin=pin0.pin, echo_pin=pin13.pin)\n";
  
  }  else {
    port = "stemkit_ultrasonic = HCSR04(trigger_pin=pin1.pin, echo_pin=pin14.pin)\n";
  }
  Blockly.Python.definitions_['import_yolobit'] = 'from yolobit import *';
  Blockly.Python.definitions_['import_ultrasonic'] = 'from stemkit_hcsr04 import HCSR04\n' + port;
    
  // TODO: Assemble Python into code variable.
  var code = 'stemkit_ultrasonic.distance_cm()';
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.Python.ORDER_NONE];
};

Blockly.Blocks['stemkit_ultrasonic_checkdistance'] = {
  init: function () {
    this.jsonInit(
      {
        "type": "stemkit_ultrasonic_checkdistance",
        "message0": Blockly.Msg.BLOCK_STEMKIT_SONIC_CHECK_MESSAGE0,
        "args0": [
          {
            "type": "input_dummy"
          },
          {
            "type": "input_value",
            "name": "DISTANCE",
            "check": "Number"
          },
          {
            "type": "field_dropdown",
            "name": "PORT",
            "options": [
              [
                "A",
                "A"
              ],
              [
                "B",
                "B"
              ]
            ]
          },
          {
            "type": "field_image",
            "src": ImgUrl + 'ultrasonic.png',
            "width": 30,
            "height": 30,
            "alt": "*",
            "flipRtl": false
          }
        ],
        "output": "Boolean",
        "colour": StemKitColorBlock,
        "tooltip": Blockly.Msg.BLOCK_STEMKIT_SONIC_CHECK_TOOLTIP,
        "helpUrl": ""
      }
    );
  },
};

Blockly.Python['stemkit_ultrasonic_checkdistance'] = function (block) {
  var value_distance = Blockly.Python.valueToCode(block, 'DISTANCE', Blockly.Python.ORDER_ATOMIC);
  var dropdown_port = block.getFieldValue('PORT');
  var port ;
  if (dropdown_port == 'A'){
    port = "stemkit_ultrasonic = HCSR04(trigger_pin=pin0.pin, echo_pin=pin13.pin)\n";
  
  }  else {
    port = "stemkit_ultrasonic = HCSR04(trigger_pin=pin1.pin, echo_pin=pin14.pin)\n";
  }
  Blockly.Python.definitions_['import_yolobit'] = 'from yolobit import *';
  Blockly.Python.definitions_['import_ultrasonic'] = 'from stemkit_hcsr04 import HCSR04\n' + port;
  // TODO: Assemble Python into code variable.
  var code = 'stemkit_ultrasonic.distance_cm() < ' + value_distance;
  return [code, Blockly.Python.ORDER_NONE];
};

// Cảm biến độ ẩm đất
Blockly.Blocks['stemkit_soil_sensor'] = {
  init: function() {
    this.jsonInit(
      {
        "type": "stemkit_soil_sensor",
        "message0": Blockly.Msg.BLOCK_STEMKIT_SOIL_SENSOR_MESSAGE0,
        "tooltip": Blockly.Msg.BLOCK_STEMKIT_SOIL_SENSOR_TOOLTIP,
        "args0": [
          {
            "type": "field_dropdown",
            "name": "NAME",
            "options": [
              [
                "A",
                "pin0"
              ],
              [
                "B",
                "pin1"
              ]
            ]
          },
          {
            "type": "field_image",
            "src": ImgUrl + 'soil.png',
            "width": 30,
            "height": 30,
            "alt": "*",
            "flipRtl": false
          }
        ],
        "output": "Number",
        "colour": StemKitColorBlock,
        "tooltip": Blockly.Msg.BLOCK_STEMKIT_SOIL_SENSOR_TOOLTIP,
        "helpUrl": ""
      }
    );
  }
};

Blockly.Python['stemkit_soil_sensor'] = function(block) {
  Blockly.Python.definitions_['import_yolobit'] = 'from yolobit import *';
  var dropdown_name = block.getFieldValue('NAME');
  // TODO: Assemble Python into code variable.
  var code = 'round(translate(('+dropdown_name+'.read_analog()), 0, 4095, 0, 100))';
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.Python.ORDER_NONE];
};

// Cảm biến ánh sáng

Blockly.Blocks['stemkit_light_sensor'] = {
  init: function() {
    this.jsonInit(
      {
        "type": "stemkit_light_sensor",
        "message0": Blockly.Msg.BLOCK_STEMKIT_LIGHT_SENSOR_MESSAGE0,
        "args0": [
          {
            "type": "field_dropdown",
            "name": "NAME",
            "options": [
              [
                "A",
                "pin0"
              ],
              [
                "B",
                "pin1"
              ]
            ]
          },
          {
            "type": "field_image",
            "src": ImgUrl + 'light.png',
            "width": 20,
            "height": 20,
            "alt": "*",
            "flipRtl": false
          }
        ],
        "output": null,
        "colour": StemKitColorBlock,
        "tooltip": Blockly.Msg.BLOCK_STEMKIT_LIGHT_SENSOR_TOOLTIP,
        "helpUrl": ""
      }
    );
  }
};

Blockly.Python['stemkit_light_sensor'] = function(block) {
  Blockly.Python.definitions_['import_yolobit'] = 'from yolobit import *';
  var dropdown_name = block.getFieldValue('NAME');
  // TODO: Assemble Python into code variable.
  var code = 'round(translate((' + dropdown_name + '.read_analog()), 0, 4095, 0, 100))';
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.Python.ORDER_NONE];
};
// bơm mini

Blockly.Blocks['stemkit_mini_pump'] = {
  /**
   * Block for waiting.
   * @this Blockly.Block
   */
  init: function() {
    this.jsonInit(
      {
        "type": "stemkit_mini_pump",
        "message0": Blockly.Msg.BLOCK_STEMKIT_MINI_PUMP_MESSAGE0,
        "args0": [
          {
            "type": "field_dropdown",
            "name": "NAME",
            "options": [
              [
                "M1",
                "0"
              ],
              [
                "M2",
                "1"
              ]
            ]
          },
          {
            "type": "input_value",
            "name": "percent",
            "check": "Number"
          },
          {
            "type": "field_image",
            "src": ImgUrl + 'motor.svg',
            "width": 30,
            "height": 30,
            "alt": "*",
            "flipRtl": false
          }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": StemKitColorBlock,
        "tooltip": Blockly.Msg.BLOCK_STEMKIT_MINI_PUMP_TOOLTIP,
        "helpUrl": ""
      }
    );
  }
};

Blockly.Python['stemkit_mini_pump'] = function(block) {
  Blockly.Python.definitions_['import_stemkit_motor'] = 'from stemkit_motor import *';
  var dropdown_name = block.getFieldValue('NAME');
  var value_percent = Blockly.Python.valueToCode(block, 'percent', Blockly.Python.ORDER_ATOMIC);
  
  // TODO: Assemble Python into code variable.
  if (dropdown_name == "0") {
    return "motor.set_wheel_speed(" + value_percent + ")\n";  
  } else {
    return "motor.set_wheel_speed(None, " + value_percent + ")\n";  
  }
};

Blockly.Blocks['stemkit_move_motor'] = {
  init: function () {
    this.jsonInit(
      {
        "type": "stemkit_move_motor",
        "message0": Blockly.Msg.BLOCK_STEMKIT_MOVE_MOTOR_MESSAGE0,
        "tooltip": Blockly.Msg.BLOCK_STEMKIT_MOVE_MOTOR_TOOLTIP,
        "args0": [
          {
            "type": "input_value",
            "name": "left_wheel_speed",
            "check": "Number",
          },
          {
            "type": "input_value",
            "name": "right_wheel_speed",
            "check": "Number",
          },
          {
            "type": "field_image",
            "src": ImgUrl + 'move.svg',
            "width": 30,
            "height": 30,
            "alt": "*",
            "flipRtl": false
          }
        ],
        "inputsInline": true,
        "previousStatement": null,
        "nextStatement": null,
        "colour": StemKitColorBlock,
      }
    );
  }
};

Blockly.Python["stemkit_move_motor"] = function (block) {
  Blockly.Python.definitions_['import_stemkit_motor'] = 'from stemkit_motor import *';
  var left_wheel_speed = Blockly.Python.valueToCode(block, 'left_wheel_speed', Blockly.Python.ORDER_ATOMIC);
  var right_wheel_speed = Blockly.Python.valueToCode(block, 'right_wheel_speed', Blockly.Python.ORDER_ATOMIC);
  // TODO: Assemble Python into code variable.
  var code = "motor.set_wheel_speed(" + left_wheel_speed + ", " + right_wheel_speed + ")\n";
  return code;
};

Blockly.Blocks['motor_stop'] = {
  init: function () {
    this.jsonInit({
      "type": "motor_stop",
      "message0": Blockly.Msg.BLOCK_STEMKIT_STOP_MESSAGE0,
      "tooltip": Blockly.Msg.BLOCK_STEMKIT_STOP_TOOLTIP,
      "args0": [
        {
          "type": "field_image",
          "src": ImgUrl + 'stop.svg',
          "width": 30,
          "height": 30,
          "alt": "",
          "flipRtl": false
        }
        ],
      "inputsInline": true,
      "previousStatement": null,
      "nextStatement": null,
      "colour": StemKitColorBlock,
    });
  }
};

Blockly.Python["motor_stop"] = function (block) {
  Blockly.Python.definitions_['import_stemkit_motor'] = 'from stemkit_motor import *';
  // TODO: Assemble Python into code variable.
  var code = "motor.stop()\n";
  return code;
};

Blockly.Blocks["servo_write_angle"] = {
  init: function () {
    this.jsonInit({
      colour: StemKitColorBlock,
      nextStatement: null,
      message0: Blockly.Msg.BLOCK_STEMKIT_SERVO_WRITE_MESSAGE0,
      tooltip: Blockly.Msg.BLOCK_STEMKIT_SERVO_WRITE_TOOLTIP,
      previousStatement: null,
      args0: [
        { type: "input_value", name: "angle", check: "Number" },
        {
          type: "field_dropdown",
          name: "pin",
          options: [
            ["S1", "1"],
            ["S2", "2"],
          ],
        },
        {
          "type": "field_image",
          "src": ImgUrl + 'servo.png',
          "width": 30,
          "height": 30,
          "alt": "*",
          "flipRtl": false
        }
      ],
      helpUrl: null,
    });
  },
};

Blockly.Python['servo_write_angle'] = function (block) {
  Blockly.Python.definitions_['import_yolobit'] = 'from yolobit import *';
  var value_output = Blockly.Python.valueToCode(block, 'angle', Blockly.Python.ORDER_ATOMIC);
  var dropdown_pin = block.getFieldValue('pin');
  var code = '';
  if (dropdown_pin == '1'){
    code = 'pin6.servo_write('+ value_output + ')\n';
  }
  else{
    code = 'pin16.servo_write('+ value_output + ')\n';
  }  
  return code;
};

Blockly.Blocks['servo360_write'] = {
  init: function () {
    this.jsonInit(
      {
        "type": "servo360_write",
        "message0": Blockly.Msg.BLOCK_STEMKIT_SERVO360_WRITE_MESSAGE0,
        "tooltip": Blockly.Msg.BLOCK_STEMKIT_SERVO360_WRITE_TOOLTIP,
        "args0": [
          {
            type: "field_dropdown",
            name: "pin",
            options: [
              ["S1", "1"],
              ["S2", "2"],
            ],
          },
          {
            "type": "input_value",
            "name": "speed",
            "check": "Number"
          },
          {
            "type": "field_image",
            "src": ImgUrl + 'servo.png',
            "width": 30,
            "height": 30,
            "alt": "*",
            "flipRtl": false
          }
        ],
        "inputsInline": true,
        "previousStatement": null,
        "nextStatement": null,
        colour: StemKitColorBlock
      }
    );
  }
};

Blockly.Python['servo360_write'] = function (block) {
  Blockly.Python.definitions_['import_yolobit'] = 'from yolobit import *';
  var value_output = Blockly.Python.valueToCode(block, 'speed', Blockly.Python.ORDER_ATOMIC);
  var dropdown_pin = block.getFieldValue('pin');
  var code = '';
  if (dropdown_pin == '1'){
    code = 'pin6.servo360_write('+ value_output + ')\n';
  }
  else{
    code = 'pin16.servo360_write('+ value_output + ')\n';
  }  
  return code;
};

Blockly.Blocks['stemkit_sound_playtrack'] = {
  init: function() {
    this.jsonInit(
      {
        type: "stemkit_sound_playtrack",
        message0: Blockly.Msg.BLOCK_STEMKIT_SOUND_PLAY_MESSAGE0,
        args0: [
          {
            type: "input_value",
            name: "track"
          },
          {
            "type": "field_dropdown",
            "name": "PORT",
            "options": [
              [
                "A",
                "A"
              ],
              [
                "B",
                "B"
              ]
            ]
          },
          {
            "type": "input_value",
            "name": "vol",
            "check": "Number"
          },
          {
            "type": "field_image",
            "src": "https://i.ibb.co/1mM59bs/sound.png",
            "width": 30,
            "height": 30,
            "alt": "*",
            "flipRtl": false
          }
        ],
        inputsInline: true,
        previousStatement: null,
        nextStatement: null,
        colour: StemKitColorBlock,
        tooltip: Blockly.Msg.BLOCK_STEMKIT_SOUND_PLAY_TOOLTIP,
        helpUrl: ""
      }
    );
  }
};

Blockly.Python['stemkit_sound_playtrack'] = function(block) {
  var number_track = Blockly.Python.valueToCode(block, 'track', Blockly.Python.ORDER_ATOMIC);
  var dropdown_port = block.getFieldValue('PORT');
  var port;

  if (dropdown_port == 'A'){
    port = 'sound = machine.UART(1, baudrate=9600, rx=pin0.pin, tx=pin13.pin)\n';
  }
  else{
    port = 'sound = machine.UART(1, baudrate=9600, rx=pin1.pin, tx=pin14.pin)\n';
  }
  Blockly.Python.definitions_['import_yolobit'] = 'from yolobit import *';
  Blockly.Python.definitions_['import_sound_player'] = 'from stemkit_sound_player import *\n'+ port;
  var number_vol = Blockly.Python.valueToCode(block, 'vol', Blockly.Python.ORDER_ATOMIC);
  // TODO: Assemble Python into code variable.

  var code = 'sound.write(set_volume(' + number_vol + '))\n'+'sound.write(play_track(' + number_track + '))\n';
  return code;
};

// MPR121 blocks

// nếu có phím được nhấn
Blockly.Blocks["stemkit_mpr121_scan"] = {
  init: function() {
    this.jsonInit({
      "message0": Blockly.Msg.BLOCK_STEMKIT_MPR121_SCAN_MESSAGE0,
      "args0":[
        {
          "type": "field_image",
          "src": ImgUrl + 'keypad.png',
          "width": 30,
          "height": 30,
          "alt": "*",
          "flipRtl": false
        }
      ],
      "output": null,
      "colour": StemKitColorBlock,
      "tooltip": Blockly.Msg.BLOCK_STEMKIT_MPR121_SCAN_TOOLTIP,
      "helpUrl": ""
    });
  }
};

Blockly.Python["stemkit_mpr121_scan"] = function(block) {
  Blockly.Python.definitions_["import_stemkit_mpr121"] = "from stemkit_mpr121 import touchpad\ntouchpad.reset()";
  // TODO: Assemble Python into code variable.
  var code ="touchpad.scan() != -1";
  return [code, Blockly.Python.ORDER_NONE];
};


// nếu đọc phím dg nhấn = #
Blockly.Blocks['stemkit_mpr121_check'] = {
  init: function() {
    this.jsonInit(
      {
        "type": "stemkit_mpr121_check",
        "message0": Blockly.Msg.BLOCK_STEMKIT_MPR121_CHECK_MESSAGE0,
        "args0": [
          {
            "type": "field_dropdown",
            "name": "KEY",
            "options": [
              [
                "0",
                "0"
              ],
              [
                "1",
                "1"
              ],
              [
                "2",
                "2"
              ],
              [
                "3",
                "3"
              ],
              [
                "4",
                "4"
              ],
              [
                "5",
                "5"
              ],
              [
                "6",
                "6"
              ],
              [
                "7",
                "7"
              ],
              [
                "8",
                "8"
              ],
              [
                "9",
                "9"
              ],
              [
                "*",
                "10"
              ],
              [
                "#",
                "11"
              ]
            ]
          },
          {
            "type": "field_image",
            "src": ImgUrl + 'keypad.png',
            "width": 30,
            "height": 30,
            "alt": "*",
            "flipRtl": false
          }
        ],
        "output": "Boolean",
        "colour": StemKitColorBlock,
        "tooltip": Blockly.Msg.BLOCK_STEMKIT_MPR121_CHECK_TOOLTIP,
        "helpUrl": ""
      }
    );
  }
};

Blockly.Python['stemkit_mpr121_check'] = function(block) {
  Blockly.Python.definitions_["import_stemkit_mpr121"] = "from stemkit_mpr121 import touchpad\ntouchpad.reset()";
  // TODO: Assemble Python into code variable.
  var key = block.getFieldValue('KEY');
  var code = 'touchpad.scan() == ' + key;
  return [code, Blockly.Python.ORDER_NONE];
};

// đọc hết chữ đã nhấn = abc

Blockly.Blocks["stemkit_mpr121_read"] = {
  init: function() {
    this.jsonInit({
      "message0": Blockly.Msg.BLOCK_STEMKIT_MPR121_READ_MESSAGE0,
      "args0": [
        { type: "input_value", name: "VALUE", check: "String" },
        {
          "type": "field_image",
          "src": ImgUrl + 'keypad.png',
          "width": 30,
          "height": 30,
          "alt": "*",
          "flipRtl": false
        },
        {
          "type": "input_dummy"
        }
        
      ],
      "output": null,
      "colour": StemKitColorBlock,
      "tooltip": Blockly.Msg.BLOCK_STEMKIT_MPR121_READ_TOOLTIP,
      "helpUrl": ""
    });
  }
};

Blockly.Python["stemkit_mpr121_read"] = function(block) {
  Blockly.Python.definitions_["import_stemkit_mpr121"] = "from stemkit_mpr121 import touchpad\ntouchpad.reset()";

  // TODO: Assemble Python into code variable.
  var value = Blockly.Python.valueToCode(block, 'VALUE', Blockly.Python.ORDER_ATOMIC);
  var code ="touchpad.read() == " + value;
  return [code, Blockly.Python.ORDER_NONE];
};

// xóa chữ đã nhấn

Blockly.Blocks['stemkit_mpr121_clear'] = {
  init: function () {
    this.jsonInit({
      "colour": StemKitColorBlock,
      nextStatement: null,
      tooltip: Blockly.Msg.BLOCK_STEMKIT_MPR121_CLEAR_TOOLTIP,
      message0: Blockly.Msg.BLOCK_STEMKIT_MPR121_CLEAR_MESSAGE0,
      previousStatement: null,
      args0: [
        {
          "type": "field_image",
          "src": ImgUrl + 'keypad.png',
          "width": 30,
          "height": 30,
          "alt": "*",
          "flipRtl": false
        }
      ],
      helpUrl: "",
    });
  },
};

Blockly.Python['stemkit_mpr121_clear'] = function(block) {
  Blockly.Python.definitions_["import_stemkit_mpr121"] = "from stemkit_mpr121 import touchpad\ntouchpad.reset()";
  // TODO: Assemble Python into code variable.
  var code ="touchpad.clear()\n";
  return code;
};

Blockly.Blocks['stemkit_mpr121_sound_off'] = {
  init: function () {
    this.jsonInit({
      "colour": StemKitColorBlock,
      nextStatement: null,
      tooltip: Blockly.Msg.BLOCK_STEMKIT_MPR121_SOUND_TOOLTIP,
      message0: Blockly.Msg.BLOCK_STEMKIT_MPR121_SOUND_MESSAGE0,
      previousStatement: null,
      args0: [
        {
          "type": "field_image",
          "src": ImgUrl + 'keypad.png',
          "width": 30,
          "height": 30,
          "alt": "*",
          "flipRtl": false
        }
      ],
      helpUrl: "",
    });
  },
};

Blockly.Python['stemkit_mpr121_sound_off'] = function(block) {
  Blockly.Python.definitions_["import_stemkit_mpr121"] = "from stemkit_mpr121 import touchpad\ntouchpad.reset()";
  // TODO: Assemble Python into code variable.
  var code ="touchpad.sound = False\n";
  return code;
};
//Gas sensor block

Blockly.Blocks["stemkit_gas_sensor"] = {
  init: function () {
    this.jsonInit({
      colour: StemKitColorBlock,
      tooltip: Blockly.Msg.BLOCK_STEMKIT_GAS_SENSOR_TOOLTIP,
      message0: Blockly.Msg.BLOCK_STEMKIT_GAS_SENSOR_MESSAGE0,
      args0: [
        {
          "type": "field_dropdown",
          "name": "PORT",
          "options": [
            [
              "A",
              "A"
            ],
            [
              "B",
              "B"
            ]
          ]
        },
        {
          "type": "field_image",
          "src": "https://thumb.silhouette-ac.com/t/d3/d3b6690d14b7257b7cfe59a179a862a0_w.jpeg",
          "width": 30,
          "height": 30,
          "alt": "*",
          "flipRtl": false
        }
      ],
      output: "Number",
      helpUrl: "",
    });
  },
};

Blockly.Python["stemkit_gas_sensor"] = function (block) {
  var dropdown_port = block.getFieldValue('PORT');
  var mq_pin;

  if (dropdown_port == 'A'){
    mq_pin = 'mq = MQ(Pin(pin0.adc_pin)) # analog PIN';
  }
  else{
    mq_pin = 'mq = MQ(Pin(pin1.adc_pin)) # analog PIN';
  }
  Blockly.Python.definitions_['import_yolobit'] = 'from yolobit import *';
  Blockly.Python.definitions_['import_mq'] = 'from stemkit_mq import MQ';
  Blockly.Python.definitions_["import_create_mq"] = mq_pin;
  // TODO: Assemble Python into code variable.

  var code = 'mq.get_ppm()';
  return [code, Blockly.Python.ORDER_NONE];
};

Blockly.Blocks["stemkit_gas_detected"] = {
  init: function () {
    this.jsonInit({
      colour: StemKitColorBlock,
      tooltip: Blockly.Msg.BLOCK_STEMKIT_GAS_DETECT_TOOLTIP,
      message0: Blockly.Msg.BLOCK_STEMKIT_GAS_DETECT_MESSAGE0,
      args0: [
        {
          "type": "field_dropdown",
          "name": "PORT",
          "options": [
            [
              "A",
              "A"
            ],
            [
              "B",
              "B"
            ]
          ]
        },
        {
          "type": "field_image",
          "src": "https://thumb.silhouette-ac.com/t/d3/d3b6690d14b7257b7cfe59a179a862a0_w.jpeg",
          "width": 30,
          "height": 30,
          "alt": "*",
          "flipRtl": false
        }
      ],
      output: "Boolean",
      helpUrl: "",
    });
  },
};

Blockly.Python["stemkit_gas_detected"] = function (block) {
  var dropdown_port = block.getFieldValue('PORT');
  var mq_pin;

  if (dropdown_port == 'A'){
    mq_pin = 'mq = MQ(Pin(pin0.adc_pin)) # analog PIN';
  }
  else{
    mq_pin = 'mq = MQ(Pin(pin1.adc_pin)) # analog PIN';
  }
  Blockly.Python.definitions_['import_yolobit'] = 'from yolobit import *';
  Blockly.Python.definitions_['import_mq'] = 'from stemkit_mq import MQ';
  Blockly.Python.definitions_["import_create_mq"] = mq_pin;
  // TODO: Assemble Python into code variable.

  var code = 'mq.get_ppm() > 50';
  return [code, Blockly.Python.ORDER_NONE];
};


// Robot Move
Blockly.Blocks['robot_move'] = {
  init: function () {
    this.jsonInit(
      {
        "type": "robot_move",
        "message0": Blockly.Msg.BLOCK_STEMKIT_ROBOT_MOVE_MESSAGE0,
        "args0": [
          {
            "type": "field_image",
            "src": ImgUrl2 + 'move.svg',
            "width": 20,
            "height": 20,
            "alt": "",
            "flipRtl": false
          },
          {
            "type": "field_dropdown",
            "name": "direction",
            "options": [
              [
                {
                  "src": ImgUrl2 + 'arrow-up.svg',
                  "width": 15,
                  "height": 15,
                  "alt": "*"
                },
                "forward"
              ],
              [
                {
                  "src": ImgUrl2 + 'arrow-down.svg',
                  "width": 15,
                  "height": 15,
                  "alt": "*"
                },
                "backward"
              ],
              [
                {
                  "src": ImgUrl2 + 'arrow-left.svg',
                  "width": 15,
                  "height": 15,
                  "alt": "*"
                },
                "turn_left"
              ],
              [
                {
                  "src": ImgUrl2 + 'arrow-right.svg',
                  "width": 15,
                  "height": 15,
                  "alt": "*"
                },
                "turn_right"
              ]
            ]
          },
          {
            min: 0,
            type: "input_value",
            check: "Number",
            value: 50,
            name: "speed",
          }
        ],
        "inputsInline": true,
        "previousStatement": null,
        "nextStatement": null,
        "colour": StemKitColorBlock,
        "tooltip": Blockly.Msg.BLOCK_STEMKIT_ROBOT_MOVE_TOOLTIP,
        "helpUrl": ""
      }
    );
  }
};

Blockly.Python["robot_move"] = function (block) {
  Blockly.Python.definitions_['import_robot'] = 'from stemkit_motor import *';
  var dir = block.getFieldValue("direction");
  var speed = Blockly.Python.valueToCode(block, 'speed', Blockly.Python.ORDER_ATOMIC);
  // TODO: Assemble Python into code variable.
  var code = "motor." + dir + "(" + speed + ")\n";
  return code;
};

Blockly.Blocks['robot_move_delay'] = {
  init: function () {
    this.jsonInit(
      {
        "type": "robot_move_delay",
        "message0": Blockly.Msg.BLOCK_STEMKIT_ROBOT_MOVE_DELAY_MESSAGE0,
        "args0": [
          {
            "type": "field_image",
            "src": ImgUrl2 + 'move.svg',
            "width": 20,
            "height": 20,
            "alt": "",
            "flipRtl": false
          },
          {
            "type": "field_dropdown",
            "name": "direction",
            "options": [
              [
                {
                  "src": ImgUrl2 + 'arrow-up.svg',
                  "width": 15,
                  "height": 15,
                  "alt": "*"
                },
                "forward"
              ],
              [
                {
                  "src": ImgUrl2 + 'arrow-down.svg',
                  "width": 15,
                  "height": 15,
                  "alt": "*"
                },
                "backward"
              ],
              [
                {
                  "src": ImgUrl2 + 'arrow-left.svg',
                  "width": 15,
                  "height": 15,
                  "alt": "*"
                },
                "turn_left"
              ],
              [
                {
                  "src": ImgUrl2 + 'arrow-right.svg',
                  "width": 15,
                  "height": 15,
                  "alt": "*"
                },
                "turn_right"
              ]
            ]
          },
          {
            min: 0,
            type: "input_value",
            check: "Number",
            value: 50,
            name: "speed",
          },
          {
            min: 0,
            type: "input_value",
            check: "Number",
            name: "time",
          }
        ],
        "inputsInline": true,
        "previousStatement": null,
        "nextStatement": null,
        "colour": StemKitColorBlock,
        "tooltip": Blockly.Msg.BLOCK_STEMKIT_ROBOT_MOVE_DELAY_TOOLTIP,
        "helpUrl": ""
      }
    );
  }
};

Blockly.Python["robot_move_delay"] = function (block) {
  Blockly.Python.definitions_['import_robot'] = 'from stemkit_motor import *';
  var dir = block.getFieldValue("direction");
  var speed = Blockly.Python.valueToCode(block, 'speed', Blockly.Python.ORDER_ATOMIC);
  var time = Blockly.Python.valueToCode(block, 'time', Blockly.Python.ORDER_ATOMIC);
  // TODO: Assemble Python into code variable.
  var code = "motor." + dir + "(" + speed + ", " + time + ")\n";
  return code;
};

Blockly.Blocks['robot_move_motor'] = {
  init: function () {
    this.jsonInit(
      {
        "type": "robot_move_motor",
        "message0": Blockly.Msg.BLOCK_STEMKIT_MOVE_MOTOR_MESSAGE0,
        "args0": [
          {
            "type": "input_value",
            "name": "left_wheel_speed",
            "check": "Number",
          },
          {
            "type": "input_value",
            "name": "right_wheel_speed",
            "check": "Number",
          },
          {
            "type": "field_image",
            "src": ImgUrl2 + 'motor.svg',
            "width": 20,
            "height": 20,
            "alt": "*",
            "flipRtl": false
          }
        ],
        "inputsInline": true,
        "previousStatement": null,
        "nextStatement": null,
        "colour": StemKitColorBlock,
        "tooltip": Blockly.Msg.BLOCK_STEMKIT_MOVE_MOTOR_TOOLTIP,
        "helpUrl": ""
      }
    );
  }
};

Blockly.Python["robot_move_motor"] = function (block) {
  Blockly.Python.definitions_['import_robot'] = 'from stemkit_motor import *';
  var left_wheel_speed = Blockly.Python.valueToCode(block, 'left_wheel_speed', Blockly.Python.ORDER_ATOMIC);
  var right_wheel_speed = Blockly.Python.valueToCode(block, 'right_wheel_speed', Blockly.Python.ORDER_ATOMIC);
  // TODO: Assemble Python into code variable.
  var code = "motor.set_wheel_speed(" + left_wheel_speed + ", " + right_wheel_speed + ")\n";
  return code;
};

Blockly.Blocks['robot_stop'] = {
  init: function () {
    this.jsonInit({
      "type": "robot_stop",
      "message0": Blockly.Msg.BLOCK_STEMKIT_ROBOT_STOP_MESSAGE0,
      "args0": [
        {
          "type": "field_image",
          "src":  ImgUrl2 + 'stop.svg',
          "width": 20,
          "height": 20,
          "alt": "*",
          "flipRtl": false
        }],
      "inputsInline": true,
      "previousStatement": null,
      "nextStatement": null,
      "colour": StemKitColorBlock,
      "tooltip": Blockly.Msg.BLOCK_STEMKIT_ROBOT_STOP_TOOLTIP,
      "helpUrl": ""
    });
  }
};

Blockly.Python["robot_stop"] = function (block) {
  Blockly.Python.definitions_['import_robot'] = 'from stemkit_motor import *';
  // TODO: Assemble Python into code variable.
  var code = "motor.stop()\n";
  return code;
};


// Line Array
Blockly.Blocks['robot_line_sensor_read_all'] = {
  init: function () {
    this.jsonInit(
      {
        "type": "robot_line_sensor_read_all",
        "message0": Blockly.Msg.BLOCK_STEMKIT_LINE_READ_ALL_MESSAGE0,
        "args0": [
          {
            "type": "field_image",
            "src": ImgUrl2 + 'line.svg',
            "width": 15,
            "height": 15,
            "alt": "*",
            "flipRtl": false
          },
          {
            "type": "field_dropdown",
            "name": "S1",
            "options": [
              [
                {
                  "src": ImgUrl2 + 'line_finder_none_detect.png',
                  "width": 15,
                  "height": 15,
                  "alt": "none"
                },
                "0"
              ],
              [
                {
                  "src": ImgUrl2 + 'line_finder_detect.png',
                  "width": 15,
                  "height": 15,
                  "alt": "detect"
                },
                "1"
              ]
            ]
          },
          {
            "type": "field_dropdown",
            "name": "S2",
            "options": [
              [
                {
                  "src": ImgUrl2 + 'line_finder_none_detect.png',
                  "width": 15,
                  "height": 15,
                  "alt": "none"
                },
                "0"
              ],
              [
                {
                  "src": ImgUrl2 + 'line_finder_detect.png',
                  "width": 15,
                  "height": 15,
                  "alt": "detect"
                },
                "1"
              ]
            ]
          },
          {
            "type": "field_dropdown",
            "name": "S3",
            "options": [
              [
                {
                  "src": ImgUrl2 + 'line_finder_none_detect.png',
                  "width": 15,
                  "height": 15,
                  "alt": "none"
                },
                "0"
              ],
              [
                {
                  "src": ImgUrl2 + 'line_finder_detect.png',
                  "width": 15,
                  "height": 15,
                  "alt": "detect"
                },
                "1"
              ]
            ]
          },
          {
            "type": "field_dropdown",
            "name": "S4",
            "options": [
              [
                {
                  "src": ImgUrl2 + 'line_finder_none_detect.png',
                  "width": 15,
                  "height": 15,
                  "alt": "none"
                },
                "0"
              ],
              [
                {
                  "src": ImgUrl2 + 'line_finder_detect.png',
                  "width": 15,
                  "height": 15,
                  "alt": "detect"
                },
                "1"
              ]
            ]
          }
        ],
        "colour": StemKitColorBlock,
        "output": "Boolean",
        "tooltip": Blockly.Msg.BLOCK_STEMKIT_LINE_READ_ALL_TOOLTIP,
        "helpUrl": ""
      }
    );
  }
};

Blockly.Python["robot_line_sensor_read_all"] = function (block) {
  Blockly.Python.definitions_['import_robot'] = 'from stemkit_motor import *';
  var S1 = block.getFieldValue("S1");
  var S2 = block.getFieldValue("S2");
  var S3 = block.getFieldValue("S3");
  var S4 = block.getFieldValue("S4");
  // TODO: Assemble Python into code variable.
  var code = "motor.read_line_sensors() == (" + S1 + ", " + S2 + ", " + S3 + ", " + S4 + ")";
  return [code, Blockly.Python.ORDER_NONE];
};


Blockly.Blocks['robot_line_sensor_read_single'] = {
  init: function () {
    this.jsonInit(
      {
        "type": "robot_line_sensor_read_single",
        "message0": Blockly.Msg.BLOCK_STEMKIT_LINE_READ_SINGLE_MESSAGE0,
        "args0": [
          {
            "type": "field_image",
            "src": ImgUrl2 + 'line.svg',
            "width": 15,
            "height": 15,
            "alt": "*",
            "flipRtl": false
          },
          {
            "type": "field_dropdown",
            "name": "pin",
            "options": [
              ["S1", "1"],
              ["S2", "2"],
              ["S3", "3"],
              ["S4", "4"],
            ],
          },
        ],
        "colour": StemKitColorBlock,
        "output": "",
        "tooltip": Blockly.Msg.BLOCK_STEMKIT_LINE_READ_SINGLE_TOOLTIP,
        "helpUrl": ""
      }
    );
  }
};

Blockly.Python["robot_line_sensor_read_single"] = function (block) {
  Blockly.Python.definitions_['import_robot'] = 'from stemkit_motor import *';
  var pin = block.getFieldValue("pin");
  // TODO: Assemble Python into code variable.
  var code = "motor.read_line_sensors(" + pin + ")";
  return [code, Blockly.Python.ORDER_NONE];
};


//Robocon

Blockly.Blocks['stemkit_robocon_follow_line_until_cross'] = {
  init: function () {
    this.jsonInit(
      {
        "type": "stemkit_robocon_follow_line_until_cross",
        "message0": Blockly.Msg.BLOCK_STEMKIT_ROBOCON_LINE_UNTIL_CROSS_MESSAGE0,
        "args0": [
          {
            type: "input_value",
            check: "Number",
            value: 50,
            name: "speed",
          },
          {
            type: "field_dropdown",
            name: "stop",
            options: [
              [Blockly.Msg.ROBOCON_THEN_ACTION_BRAKE, "BRAKE"],
              [Blockly.Msg.ROBOCON_THEN_ACTION_NONE, "None"],
            ]
          },
          {
            "type": "field_image",
            "src": ImgUrl2 + 'line.svg',
            "width": 15,
            "height": 15,
            "alt": "*",
            "flipRtl": false
          }
        ],
        "inputsInline": true,
        "previousStatement": null,
        "nextStatement": null,
        "colour": StemKitColorBlock,
        "tooltip": Blockly.Msg.BLOCK_STEMKIT_ROBOCON_LINE_UNTIL_CROSS_TOOLTIP,
        "helpUrl": ""
      }
    );
  }
};

Blockly.Python["stemkit_robocon_follow_line_until_cross"] = function (block) {
  Blockly.Python.definitions_['import_robot'] = 'from stemkit_motor import *';
  Blockly.Python.definitions_['import_robocon'] = 'from stemkit_robocon import *';
  var speed = Blockly.Python.valueToCode(block, 'speed', Blockly.Python.ORDER_ATOMIC);
  var stop = block.getFieldValue('stop');
  // TODO: Assemble Python into code variable.
  var code = "follow_line_until_cross(" + speed + ", 15000, " + stop + ")\n";
  return code;
};

Blockly.Blocks['stemkit_robocon_follow_line_until_end'] = {
  init: function () {
    this.jsonInit(
      {
        "type": "stemkit_robocon_follow_line_until_end",
        "message0": Blockly.Msg.BLOCK_STEMKIT_ROBOCON_LINE_UNTIL_END_MESSAGE0,
        "args0": [
          {
            type: "input_value",
            check: "Number",
            value: 50,
            name: "speed",
          },
          {
            type: "field_dropdown",
            name: "stop",
            options: [
              [Blockly.Msg.ROBOCON_THEN_ACTION_BRAKE, "BRAKE"],
              [Blockly.Msg.ROBOCON_THEN_ACTION_NONE, "None"],
            ]
          },
          {
            "type": "field_image",
            "src": ImgUrl2 + 'line.svg',
            "width": 15,
            "height": 15,
            "alt": "*",
            "flipRtl": false
          }
        ],
        "inputsInline": true,
        "previousStatement": null,
        "nextStatement": null,
        "colour": StemKitColorBlock,
        "tooltip": Blockly.Msg.BLOCK_STEMKIT_ROBOCON_LINE_UNTIL_END_TOOLTIP,
        "helpUrl": ""
      }
    );
  }
};

Blockly.Python["stemkit_robocon_follow_line_until_end"] = function (block) {
  Blockly.Python.definitions_['import_robot'] = 'from stemkit_motor import *';
  Blockly.Python.definitions_['import_robocon'] = 'from stemkit_robocon import *';
  var speed = Blockly.Python.valueToCode(block, 'speed', Blockly.Python.ORDER_ATOMIC);
  var stop = block.getFieldValue('stop');
  // TODO: Assemble Python into code variable.
  var code = "follow_line_until_end(" + speed + ", 15000, " + stop + ")\n";
  return code;
};

Blockly.Blocks['stemkit_robocon_turn_until_line_detected_then'] = {
  init: function () {
    this.jsonInit(
      {
        "type": "stemkit_robocon_turn_until_line_detected_then",
        "message0": Blockly.Msg.BLOCK_STEMKIT_ROBOCON_LINE_TURN_UNTIL_LINE_MESSAGE0,
        "args0": [
          {
            "type": "field_dropdown",
            "name": "direction",
            "options": [
              [
                {
                  "src": "static/blocks/block_images/860774.svg",
                  "width": 15,
                  "height": 15,
                  "alt": "*"
                },
                "left"
              ],
              [
                {
                  "src": "static/blocks/block_images/74474.svg",
                  "width": 15,
                  "height": 15,
                  "alt": "*"
                },
                "right"
              ]
            ]
          },
          {
            "type": "input_value",
            "name": "speed",
            "check": "Number",
          },
          {
            type: "field_dropdown",
            name: "stop",
            options: [
              [Blockly.Msg.ROBOCON_THEN_ACTION_BRAKE, "BRAKE"],
              [Blockly.Msg.ROBOCON_THEN_ACTION_NONE, "None"],
            ]
          },
          {
            "type": "field_image",
            "src": ImgUrl2 + 'line.svg',
            "width": 15,
            "height": 15,
            "alt": "*",
            "flipRtl": false
          }
        ],
        "inputsInline": true,
        "previousStatement": null,
        "nextStatement": null,
        "colour": StemKitColorBlock,
        "tooltip": Blockly.Msg.BLOCK_STEMKIT_ROBOCON_LINE_TURN_UNTIL_LINE_TOOLTIP,
        "helpUrl": ""
      }
    );
  }
};

Blockly.Python["stemkit_robocon_turn_until_line_detected_then"] = function (block) {
  Blockly.Python.definitions_['import_robot'] = 'from stemkit_motor import *';
  Blockly.Python.definitions_['import_robocon'] = 'from stemkit_robocon import *';
  var dir = block.getFieldValue('direction');
  var speed = Blockly.Python.valueToCode(block, 'speed', Blockly.Python.ORDER_ATOMIC);
  var stop = block.getFieldValue('stop');
  // TODO: Assemble Python into code variable.
  var code = "";
  if (dir == "left") {
    code = "turn_until_line_detected(" + -speed + ", " + speed + ", 5000, " + stop + ")\n";
  } else {
    code = "turn_until_line_detected(" + speed + ", " + -speed + ", 5000, " + stop + ")\n";
  }
  return code;
};

Blockly.Blocks['stemkit_robocon_follow_line_until'] = {
  init: function () {
    this.jsonInit(
      {
        "type": "stemkit_robocon_follow_line_until",
        "message0": Blockly.Msg.BLOCK_STEMKIT_ROBOCON_LINE_FOLLOW_UNTIL_MESSAGE0,
        "args0": [
          {
            type: "input_value",
            check: "Number",
            value: 50,
            name: "speed",
          },
          {
            "type": "input_value",
            "name": "condition",
          },
          {
            "type": "field_image",
            "src": ImgUrl2 + 'line.svg',
            "width": 15,
            "height": 15,
            "alt": "*",
            "flipRtl": false
          }
        ],
        "inputsInline": true,
        "previousStatement": null,
        "nextStatement": null,
        "colour": StemKitColorBlock,
        "tooltip": Blockly.Msg.BLOCK_STEMKIT_ROBOCON_LINE_FOLLOW_UNTIL_TOOLTIP,
        "helpUrl": ""
      }
    );
  }
};
Blockly.Python["stemkit_robocon_follow_line_until"] = function (block) {
  Blockly.Python.definitions_['import_robot'] = 'from stemkit_motor import *';
  Blockly.Python.definitions_['import_robocon'] = 'from stemkit_robocon import *';
  var speed = Blockly.Python.valueToCode(block, 'speed', Blockly.Python.ORDER_ATOMIC);
  var condition = Blockly.Python.valueToCode(block, 'condition', Blockly.Python.ORDER_ATOMIC);
  var timeout = 30;
  // TODO: Assemble Python into code variable.
  var code = "follow_line_until(" + speed + ", " + "lambda: (" + condition + "), " + timeout * 1000 + ")\n";
  return code;
};

Blockly.Blocks['stemkit_robocon_follow_line_delay'] = {
  init: function () {
    this.jsonInit(
      {
        "type": "stemkit_robocon_follow_line_delay",
        "message0": Blockly.Msg.BLOCK_STEMKIT_ROBOCON_LINE_FOLLOW_DELAY_MESSAGE0,
        "args0": [

          {
            min: 0,
            type: "input_value",
            check: "Number",
            value: 50,
            name: "speed",
          },
          {
            min: 0,
            type: "input_value",
            check: "Number",
            name: "timeout",
          },
          {
            "type": "field_image",
            "src": ImgUrl2 + 'line.svg',
            "width": 15,
            "height": 15,
            "alt": "*",
            "flipRtl": false
          }
        ],
        "inputsInline": true,
        "previousStatement": null,
        "nextStatement": null,
        "colour": StemKitColorBlock,
        "tooltip": Blockly.Msg.BLOCK_STEMKIT_ROBOCON_LINE_FOLLOW_DELAY_TOOLTIP,
        "helpUrl": ""
      }
    );
  }
};

Blockly.Python["stemkit_robocon_follow_line_delay"] = function (block) {
  Blockly.Python.definitions_['import_robot'] = 'from stemkit_motor import *';
  Blockly.Python.definitions_['import_robocon'] = 'from stemkit_robocon import *';
  var speed = Blockly.Python.valueToCode(block, 'speed', Blockly.Python.ORDER_ATOMIC);
  var timeout = Blockly.Python.valueToCode(block, 'timeout', Blockly.Python.ORDER_ATOMIC);
  // TODO: Assemble Python into code variable.
  var code = "follow_line_until(" + speed + ", " + "lambda: (False), " + timeout * 1000 + ")\n";
  return code;
};


// REMOTE CONTROL BLOCK

Blockly.Blocks['stemkit_remote_control_init'] = {
  init: function () {
    this.jsonInit(
      {
        type: "stemkit_remote_control_init",
        message0: Blockly.Msg.BLOCK_STEMKIT_REMOTE_CONTROL_INIT_MESSAGE0,
        previousStatement: null,
        nextStatement: null,
        args0: [
        ],
        colour: StemKitColorBlock,
        tooltip: Blockly.Msg.BLOCK_STEMKIT_REMOTE_CONTROL_INIT_TOOLTIP,
        helpUrl: ""
      }
    )
  },
};

Blockly.Python['stemkit_remote_control_init'] = function (block) {
  Blockly.Python.definitions_['import_stemkit_remotecontrol'] = 'from stemkit_remotecontrol import *';
  // TODO: Assemble Python into code variable.
  var code = "";
  return code;
};

Blockly.Blocks['stemkit_remote_control_processing'] = {
  init: function () {
    this.jsonInit(
      {
        type: "stemkit_remote_control_processing",
        message0: Blockly.Msg.BLOCK_STEMKIT_REMOTE_CONTROL_PROCESS_MESSAGE0,
        previousStatement: null,
        nextStatement: null,
        args0: [
        ],
        colour: StemKitColorBlock,
        tooltip: Blockly.Msg.BLOCK_STEMKIT_REMOTE_CONTROL_PROCESS_TOOLTIP,
        helpUrl: ""
      }
    )
  },
};

Blockly.Python['stemkit_remote_control_processing'] = function (block) {
  Blockly.Python.definitions_['import_stemkit_remote_control'] = 'from stemkit_remotecontrol import *';
  // TODO: Assemble Python into code variable.
  var code = "stemkit_rc_mode.run()\n";
  return code;
};

Blockly.Blocks["stemkit_remote_control_on_button_pressed"] = {
  init: function () {
    this.jsonInit({
      colour: StemKitColorBlock,
      message0: Blockly.Msg.BLOCK_STEMKIT_REMOTE_CONTROL_ON_BTN_MESSAGE0,
      tooltip: Blockly.Msg.BLOCK_STEMKIT_REMOTE_CONTROL_ON_BTN_TOOLTIP,
      args0: [
        {
          type: "field_dropdown",
          name: "BUTTON",
          options: [
            ['A', 'BTN_A'],
            ['B', 'BTN_B'],
            ['C', 'BTN_C'],
            ['D', 'BTN_D'],
            [
              {
                "src": 'static/blocks/block_images/gamepad-square.png',
                "width": 15,
                "height": 15,
                "alt": "*"
              },
              "BTN_SQUARE"
            ],
            [
              {
                "src": 'static/blocks/block_images/gamepad-circle.png',
                "width": 15,
                "height": 15,
                "alt": "*"
              },
              "BTN_CIRCLE"
            ],
            [
              {
                "src": 'static/blocks/block_images/gamepad-cross.png',
                "width": 15,
                "height": 15,
                "alt": "*"
              },
              "BTN_CROSS"
            ],
            [
              {
                "src": 'static/blocks/block_images/gamepad-triangle.png',
                "width": 15,
                "height": 15,
                "alt": "*"
              },
              "BTN_TRIANGLE"
            ],
            ["L1", "BTN_L1"],
            ["R1", "BTN_R1"],
            ["L2", "BTN_L2"],
            ["R2", "BTN_R2"],
            ["SHARE", "BTN_M1"],
            ["OPTIONS", "BTN_M2"],
            ["Left Joystick", "BTN_THUMBL"],
            ["Right Joystick", "BTN_THUMBR"],
            [
              {
                "src": "static/blocks/block_images/59043.svg",
                "width": 15,
                "height": 15,
                "alt": "*"
              },
              "BTN_FORWARD"
            ],
            [
              {
                "src": "static/blocks/block_images/959159.svg",
                "width": 15,
                "height": 15,
                "alt": "*"
              },
              "BTN_BACKWARD"
            ],
            [
              {
                "src": "static/blocks/block_images/arrow-left.svg",
                "width": 15,
                "height": 15,
                "alt": "side left"
              },
              "BTN_LEFT"
            ],
            [
              {
                "src": "static/blocks/block_images/arrow-right.svg",
                "width": 15,
                "height": 15,
                "alt": "side right"
              },
              "BTN_RIGHT"
            ],
          ],
        },
        {
          type: "input_dummy",
        },
        {
          type: "input_statement",
          name: "ACTION",
        },
      ],
      helpUrl: "",
    });
  },
};

Blockly.Python['stemkit_remote_control_on_button_pressed'] = function (block) {
  Blockly.Python.definitions_['import_stemkit_remote_control'] = 'from stemkit_remotecontrol import *';
  var button = block.getFieldValue('BUTTON');
  var statements_action = Blockly.Python.statementToCode(block, 'ACTION');

  var globals = buildGlobalString(block);

  var cbFunctionName = Blockly.Python.provideFunction_(
    'on_gamepad_button_' + button,
    (globals != '') ?
      ['def ' + Blockly.Python.FUNCTION_NAME_PLACEHOLDER_ + '():',
        globals,
      statements_action || Blockly.Python.PASS
      ] :
      ['def ' + Blockly.Python.FUNCTION_NAME_PLACEHOLDER_ + '():',
      statements_action || Blockly.Python.PASS
      ]);

  var code = 'stemkit_rc_mode.set_command(' + button + ', ' + cbFunctionName + ')\n';
  Blockly.Python.definitions_['on_gamepad_button_callback' + button] = code;

  return '';
};


// DHT20

Blockly.Blocks["stemkit_dht_measure"] = {
  init: function() {
    this.jsonInit({
      message0: Blockly.Msg.BLOCK_STEMKIT_DHT_MEANSURE_MESSAGE0,
      args0: [
        {
          "type": "field_image",
          "src": ImgUrl + 'temp-humi.png',
          "width": 20,
          "height": 20,
          "alt": "*",
          "flipRtl": false
        }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: StemKitColorBlock,
      tooltip: Blockly.Msg.BLOCK_STEMKIT_DHT_MEANSURE_TOOLTIP,
      helpUrl: Blockly.Msg.BLOCK_STEMKIT_DHT_MEANSURE_HELPURL
    });
  },
};

Blockly.Python["stemkit_dht_measure"] = function(block) {
  // TODO: Assemble Python into code variable.
  Blockly.Python.definitions_['import_i2c'] = 'from machine import Pin, SoftI2C';
  Blockly.Python.definitions_["import_dht20"] = "from stemkit_dht20 import DHT20";
  Blockly.Python.definitions_["import_create_dht20"] = "stemkit_dht20 = DHT20()";
  var code = "stemkit_dht20.read_dht20()\n";
  return code;
};

Blockly.Blocks["stemkit_dht_read"] = {
  init: function() {
    this.jsonInit({
      message0: Blockly.Msg.BLOCK_STEMKIT_DHT_READ_MESSAGE0,
      args0: [
        {
          type: "field_dropdown",
          name: "DATA",
          options: [
            [Blockly.Msg.BLOCK_STEMKIT_DHT_READ_MESSAGE1, "TEMP"],
            [Blockly.Msg.BLOCK_STEMKIT_DHT_READ_MESSAGE2, "HUMID"]
          ]
        },
        {
          "type": "field_image",
          "src": ImgUrl + 'temp-humi.png',
          "width": 20,
          "height": 20,
          "alt": "*",
          "flipRtl": false
        }
        
      ],
      output: null,
      colour: StemKitColorBlock,
      tooltip: Blockly.Msg.BLOCK_STEMKIT_DHT_READ_TOOLTIP,
      helpUrl: Blockly.Msg.BLOCK_STEMKIT_DHT_READ_HELPURL
    });
  },
  getDeveloperVars: function() {
    return ['stemkit_dht_read'];
  }
};

Blockly.Python["stemkit_dht_read"] = function(block) {
  var dropdown_data = block.getFieldValue("DATA");
  // TODO: Assemble Python into code variable.
  Blockly.Python.definitions_['import_i2c'] = 'from machine import Pin, SoftI2C';
  Blockly.Python.definitions_["import_dht20"] = "from stemkit_dht20 import DHT20";
  Blockly.Python.definitions_["import_create_dht20"] = "stemkit_dht20 = DHT20()";
  var code = "";
  if (dropdown_data == "TEMP")
    code = "stemkit_dht20.dht20_temperature()";
  else 
    code = "stemkit_dht20.dht20_humidity()";
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.Python.ORDER_NONE];
};


// LCD 1602

Blockly.Blocks["stemkit_lcd1602_display_sample"] = {
  init: function () {
    this.jsonInit({
      colour: StemKitColorBlock,
      tooltip: "",
      message0: Blockly.Msg.BLOCK_STEMKIT_LCD1602_SAMPLE_MESSAGE0,
      args0: [
        {
          type: "input_value",
          name: "data_name"
        },
        {
          type: "input_value",
          name: "data_value",
          check: "Number",
        },
        {
          type: "input_value",
          name: "data_unit",
        },
        {
          type: "input_value",
          name: "X",
          check: "Number",
          min: 0,
          max: 16
        },
        {
          type: "input_value",
          name: "Y",
          check: "Number",
          min: 0,
          max: 2
        },
        {
          type: "input_dummy"
        },
        {
          "type": "field_image",
          "src": ImgUrl + 'lcd.png',
          "width": 20,
          "height": 20,
          "alt": "*",
          "flipRtl": false
        }
      ],
      previousStatement: null,
      nextStatement: null,
      helpUrl: "",
    });
  },
};

Blockly.Python["stemkit_lcd1602_display_sample"] = function (block) {
  Blockly.Python.definitions_['import_lcd1602'] = 'from stemkit_lcd1602 import LCD1602';
  Blockly.Python.definitions_['import_lcd1602_init'] = 'stemkit_lcd1602 = LCD1602()';
  var data_name = Blockly.Python.valueToCode(block, 'data_name', Blockly.Python.ORDER_ATOMIC);
  var data_value = Blockly.Python.valueToCode(block, 'data_value', Blockly.Python.ORDER_ATOMIC);
  var data_unit = Blockly.Python.valueToCode(block, 'data_unit', Blockly.Python.ORDER_ATOMIC);
  var data = data_name + ' + ": " + str(' + data_value + ') + ' + data_unit;
  var x = Blockly.Python.valueToCode(block, 'X', Blockly.Python.ORDER_ATOMIC);
  var y = Blockly.Python.valueToCode(block, 'Y', Blockly.Python.ORDER_ATOMIC);  // TODO: Assemble Python into code variable.
  var code = "stemkit_lcd1602.move_to(" + x + ", "+ y +")\n" + "stemkit_lcd1602.putstr("+ data +")\n";
  return code;
};

Blockly.Blocks["stemkit_lcd1602_display"] = {
  init: function () {
    this.jsonInit({
      colour: StemKitColorBlock,
      tooltip: "",
      message0: Blockly.Msg.BLOCK_STEMKIT_LCD1602_MESSAGE0,
      args0: [
        {
          type: "input_value",
          name: "string"
        },
        {
          type: "input_value",
          name: "X",
          check: "Number",
          min: 0,
          max: 16
        },
        {
          type: "input_value",
          name: "Y",
          check: "Number",
          min: 0,
          max: 2
        },
        {
          type: "input_dummy"
        },
        {
          "type": "field_image",
          "src": ImgUrl + 'lcd.png',
          "width": 20,
          "height": 20,
          "alt": "*",
          "flipRtl": false
        }
      ],
      previousStatement: null,
      nextStatement: null,
      helpUrl: "",
    });
  },
  getDeveloperVars: function() {
    return ['stemkit_lcd1602_display'];
  }
};

Blockly.Python["stemkit_lcd1602_display"] = function (block) {
  Blockly.Python.definitions_['import_lcd1602'] = 'from stemkit_lcd1602 import LCD1602';
  Blockly.Python.definitions_['import_lcd1602_init'] = 'stemkit_lcd1602 = LCD1602()';
  var string = Blockly.Python.valueToCode(block, 'string', Blockly.Python.ORDER_ATOMIC);
  var x = Blockly.Python.valueToCode(block, 'X', Blockly.Python.ORDER_ATOMIC);
  var y = Blockly.Python.valueToCode(block, 'Y', Blockly.Python.ORDER_ATOMIC);  // TODO: Assemble Python into code variable.
  var code = "stemkit_lcd1602.move_to(" + x + ", "+ y +")\n" + "stemkit_lcd1602.putstr("+ string +")\n";
  return code;
};

Blockly.Blocks["stemkit_lcd1602_clear"] = {
  init: function () {
    this.jsonInit({
      colour: StemKitColorBlock,
      tooltip: "",
      message0: Blockly.Msg.BLOCK_STEMKIT_LCDCLEAR_MESSAGE0,
      args0: [
        {
          "type": "field_image",
          "src": ImgUrl + 'lcd.png',
          "width": 20,
          "height": 20,
          "alt": "*",
          "flipRtl": false
        }
      ],
      previousStatement: null,
      nextStatement: null,
      helpUrl: "",
    });
  },
  getDeveloperVars: function() {
    return ['stemkit_lcd1602_clear'];
  }
};

Blockly.Python["stemkit_lcd1602_clear"] = function (block) {
  // TODO: Assemble Python into code variable.
  Blockly.Python.definitions_['import_lcd1602'] = 'from stemkit_lcd1602 import LCD1602';
  Blockly.Python.definitions_['import_lcd1602_init'] = 'stemkit_lcd1602 = LCD1602()';
  var code = "stemkit_lcd1602.clear()\n";
  return code;
};

// OLED
Blockly.Blocks["stemkit_oled_display_sample"] = {
  init: function () {
    this.jsonInit({
      colour: StemKitColorBlock,
      tooltip: "",
      message0: Blockly.Msg.BLOCK_STEMKIT_OLED_SAMPLE_MESSAGE0,
      args0: [
        {
          type: "input_value",
          name: "data_name"
        },
        {
          type: "input_value",
          name: "data_value",
          check: "Number",
        },
        {
          type: "input_value",
          name: "data_unit",
        },
        {
          type: "input_value",
          name: "X",
          check: "Number",
          min: 0,
          max: 128
        },
        {
          type: "input_value",
          name: "Y",
          check: "Number",
          min: 0,
          max: 64
        },
        {
          type: "input_dummy"
        },
        {
          "type": "field_image",
          "src": ImgUrl + 'oled.png',
          "width": 20,
          "height": 20,
          "alt": "*",
          "flipRtl": false
        }
      ],
      previousStatement: null,
      nextStatement: null,
      helpUrl: "",
    });
  },
};

Blockly.Python['stemkit_oled_display_sample'] = function(block) {
  Blockly.Python.definitions_['import_oled'] = 'from stemkit_ssd1306 import SSD1306_I2C';
  Blockly.Python.definitions_['import_oled_init'] = 'stemkit_oled = SSD1306_I2C()';
  var data_name = Blockly.Python.valueToCode(block, 'data_name', Blockly.Python.ORDER_ATOMIC);
  var data_value = Blockly.Python.valueToCode(block, 'data_value', Blockly.Python.ORDER_ATOMIC);
  var data_unit = Blockly.Python.valueToCode(block, 'data_unit', Blockly.Python.ORDER_ATOMIC);
  var value_x = Blockly.Python.valueToCode(block, 'X', Blockly.Python.ORDER_ATOMIC);
  var value_y = Blockly.Python.valueToCode(block, 'Y', Blockly.Python.ORDER_ATOMIC);
  // TODO: Assemble Python into code variable.
  var data = data_name + ' + ": " + str(' + data_value + ') + ' + data_unit;
  var code = 'stemkit_oled.text(str(' + data + '), ' + value_x + ', ' + value_y + ', 1);\nstemkit_oled.show()\n';
  return code;
};

Blockly.Blocks["stemkit_oled_display"] = {
  init: function () {
    this.jsonInit({
      colour: StemKitColorBlock,
      tooltip: "",
      message0: Blockly.Msg.BLOCK_STEMKIT_OLED_MESSAGE0,
      args0: [
        {
          type: "input_value",
          name: "string"
        },
        {
          type: "input_value",
          name: "X",
          check: "Number",
          min: 0,
          max: 128
        },
        {
          type: "input_value",
          name: "Y",
          check: "Number",
          min: 0,
          max: 64
        },
        {
          type: "input_dummy"
        },
        {
          "type": "field_image",
          "src": ImgUrl + 'oled.png',
          "width": 20,
          "height": 20,
          "alt": "*",
          "flipRtl": false
        }
      ],
      previousStatement: null,
      nextStatement: null,
      helpUrl: "",
    });
  },
  getDeveloperVars: function() {
    return ['stemkit_oled_display'];
  }
};

Blockly.Python['stemkit_oled_display'] = function(block) {
  Blockly.Python.definitions_['import_oled'] = 'from stemkit_ssd1306 import SSD1306_I2C';
  Blockly.Python.definitions_['import_oled_init'] = 'stemkit_oled = SSD1306_I2C()';
  var value_text = Blockly.Python.valueToCode(block, 'string', Blockly.Python.ORDER_ATOMIC);
  var value_x = Blockly.Python.valueToCode(block, 'X', Blockly.Python.ORDER_ATOMIC);
  var value_y = Blockly.Python.valueToCode(block, 'Y', Blockly.Python.ORDER_ATOMIC);
  // TODO: Assemble Python into code variable.
  var code = 'stemkit_oled.text(str(' + value_text + '), ' + value_x + ', ' + value_y + ', 1);\nstemkit_oled.show()\n';
  return code;
};

Blockly.Blocks["stemkit_oled_clear"] = {
  init: function () {
    this.jsonInit({
      colour: StemKitColorBlock,
      tooltip: "",
      message0: Blockly.Msg.BLOCK_STEMKIT_OLEDCLEAR_MESSAGE0,
      args0: [
        {
          "type": "field_image",
          "src": ImgUrl + 'oled.png',
          "width": 20,
          "height": 20,
          "alt": "*",
          "flipRtl": false
        }
      ],
      previousStatement: null,
      nextStatement: null,
      tooltip: Blockly.Msg.BLOCK_STEMKIT_OLEDCLEAR_TOOLTIP,
      helpUrl: Blockly.Msg.BLOCK_STEMKIT_OLEDCLEAR_HELPURL
    });
  },
  getDeveloperVars: function() {
    return ['stemkit_oled_clear'];
  }
};

Blockly.Python['stemkit_oled_clear'] = function(block) {
  Blockly.Python.definitions_['import_oled'] = 'from stemkit_ssd1306 import SSD1306_I2C';
  Blockly.Python.definitions_['import_oled_init'] = 'stemkit_oled = SSD1306_I2C()';
  // TODO: Assemble Python into code variable.
  //oled.fill(1); oled.show()
  var code = 'stemkit_oled.fill(0);\nstemkit_oled.show()\n';
  return code;
};

// Cảm biến âm thanh

Blockly.Blocks['stemkit_sound_sensor'] = {
  init: function() {
    this.jsonInit(
      {
        "type": "stemkit_sound_sensor",
        "message0": Blockly.Msg.BLOCK_STEMKIT_SOUND_SENSOR_MESSAGE0,
        "args0": [
          {
            "type": "field_dropdown",
            "name": "NAME",
            "options": [
              [
                "A",
                "pin0"
              ],
              [
                "B",
                "pin1"
              ]
            ]
          },
          {
            "type": "field_image",
            "src": "https://i.ibb.co/1mM59bs/sound.png",
            "width": 30,
            "height": 30,
            "alt": "*",
            "flipRtl": false
          }
        ],
        "output": null,
        "colour": StemKitColorBlock,
        "tooltip": Blockly.Msg.BLOCK_STEMKIT_SOUND_SENSOR_TOOLTIP,
        "helpUrl": ""
      }
    );
  }
};

Blockly.Python['stemkit_sound_sensor'] = function(block) {
  Blockly.Python.definitions_['import_yolobit'] = 'from yolobit import *';
  var dropdown_name = block.getFieldValue('NAME');
  // TODO: Assemble Python into code variable.
  var code = 'round(translate((' + dropdown_name + '.read_analog()), 0, 4095, 0, 100))';
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.Python.ORDER_NONE];
};

// Cảm biến chuyển động PIR

Blockly.Blocks['stemkit_motion'] = {
  /**
   * Block for waiting.
   * @this Blockly.Block
   */
  init: function() {
    this.jsonInit(
      {
        "type": "stemkit_motion",
        "message0": Blockly.Msg.BLOCK_STEMKIT_PIR_MESSAGE0,
        "args0": [
          {
            "type": "field_dropdown",
            "name": "NAME",
            "options": [
              [
                "A",
                "pin0"
              ],
              [
                "B",
                "pin1"
              ],
            ]
          },
          {
            "type": "field_image",
            "src": ImgUrl + 'pir.png',
            "width": 20,
            "height": 20,
            "alt": "*",
            "flipRtl": false
          }
        ],
        output: "Boolean",
        "colour": StemKitColorBlock,
        "tooltip": "",
        "helpUrl": ""
      }
    );
  }
};

Blockly.Python['stemkit_motion'] = function(block) {
  Blockly.Python.definitions_['import_yolobit'] = 'from yolobit import *';
  var dropdown_name = block.getFieldValue('NAME');
  // TODO: Assemble Python into code variable.
  var code = '' + dropdown_name + '.read_digital() == 1';
  return [code, Blockly.Python.ORDER_NONE];
};

// Relay Module
Blockly.Blocks['stemkit_relay'] = {
  /**
   * Block for waiting.
   * @this Blockly.Block
   */
  init: function() {
    this.jsonInit(
      {
        "type": "stemkit_relay",
        "message0": Blockly.Msg.BLOCK_STEMKIT_RELAY_MESSAGE0,
        "args0": [
          {
            "type": "field_dropdown",
            "name": "NAME",
            "options": [
              [
                "A",
                "pin0"
              ],
              [
                "B",
                "pin1"
              ],
            ]
          },
          {
            "type": "field_dropdown",
            "name": "state",
            "options": [
              [
                "bật",
                "1"
              ],
              [
                "tắt",
                "0"
              ]
            ]
          },
          {
            "type": "field_image",
            "src": ImgUrl + 'relay.png',
            "width": 20,
            "height": 20,
            "alt": "*",
            "flipRtl": false
          }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": StemKitColorBlock,
        "tooltip": "",
        "helpUrl": ""
      }
    );
  }
};

Blockly.Python['stemkit_relay'] = function(block) {
  Blockly.Python.definitions_['import_yolobit'] = 'from yolobit import *';
  var dropdown_name = block.getFieldValue('NAME');
  var dropdown_state = block.getFieldValue('state');
  // TODO: Assemble Python into code variable.
  var code = ''+dropdown_name+'.write_digital('+dropdown_state+')\n';
  return code;
};

Blockly.Blocks['stemkit_water_sensor'] = {
  init: function() {
    this.jsonInit(
      {
        "type": "stemkit_water_sensor",
        "message0": Blockly.Msg.BLOCK_STEMKIT_WATER_MESSAGE0,
        "args0": [
          {
            "type": "field_dropdown",
            "name": "NAME",
            "options": [
              [
                "A",
                "pin0"
              ],
              [
                "B",
                "pin1"
              ]
            ]
          },
          {
            "type": "field_image",
            "src": ImgUrl + 'water.png',
            "width": 20,
            "height": 20,
            "alt": "*",
            "flipRtl": false
          }

        ],
        "output": null,
        "colour": StemKitColorBlock,
        "tooltip": Blockly.Msg.BLOCK_STEMKIT_WATER_SENSOR_TOOLTIP,
        "helpUrl": ""
      }
    );
  }
};

Blockly.Python['stemkit_water_sensor'] = function(block) {
  Blockly.Python.definitions_['import_yolobit'] = 'from yolobit import *';
  var dropdown_name = block.getFieldValue('NAME');
  // TODO: Assemble Python into code variable.
  var code = dropdown_name + '.read_digital() == 0';
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.Python.ORDER_NONE];
};

// RFID

Blockly.Blocks['stemkit_scan_card'] = {
  init: function() {
    this.jsonInit({
      "type": "stemkit_scan_card",
      "message0": Blockly.Msg.BLOCK_STEMKIT_RFID_SCAN_MESSAGE0,
      "args0": [
        {
          "type": "field_image",
          "src": ImgUrl + 'rfid.png',
          "width": 20,
          "height": 20,
          "alt": "*",
          "flipRtl": false
        }
      ],
      "output": "String",
      "colour": StemKitColorBlock,
      "tooltip": Blockly.Msg.BLOCK_STEMKIT_RFID_SCAN_TOOLTIP,
      "helpUrl": Blockly.Msg.BLOCK_STEMKIT_RFID_SCAN_HELPURL
    });
  },
  getDeveloperVars: function() {
    return ['stemkit_scan_card'];
  }
};

Blockly.Python['stemkit_scan_card'] = function(block) {
  Blockly.Python.definitions_['import_rfid'] = 'from stemkit_rfid import *';
  Blockly.Python.definitions_['import_rfid_init'] = 'stemkit_rfid = RFID()';
  var code = 'stemkit_rfid.scan_card()';
  return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Blocks['stemkit_scan_and_check'] = {
  init: function() {
    this.jsonInit({
      "type": "stemkit_scan_and_check",
      "message0": Blockly.Msg.BLOCK_STEMKIT_RFID_CHECK_MESSAGE0,
      "args0": [
        {
          type: "field_dropdown",
          name: "list_name",
          options: [
            ["1", "1"],
            ["2", "2"],
            ["3", "3"],
            ["4", "4"],
            ["5", "5"]
          ],
        },
        {
          "type": "field_image",
          "src": ImgUrl + 'rfid.png',
          "width": 20,
          "height": 20,
          "alt": "*",
          "flipRtl": false
        }
      ],
      "output": "Boolean",
      "colour": StemKitColorBlock,
      "tooltip": Blockly.Msg.BLOCK_STEMKIT_RFID_CHECK_TOOLTIP,
      "helpUrl": Blockly.Msg.BLOCK_STEMKIT_RFID_CHECK_HELPURL
    });
  },
  getDeveloperVars: function() {
    return ['stemkit_scan_and_check'];
  }
};

Blockly.Python['stemkit_scan_and_check'] = function(block) {
  var list_name = block.getFieldValue('list_name');
  Blockly.Python.definitions_['import_rfid'] = 'from stemkit_rfid import *';
  Blockly.Python.definitions_['import_rfid_init'] = 'stemkit_rfid = RFID()';
  var code = `stemkit_rfid.scan_and_check("rfids_${list_name}")`;
  return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Blocks['stemkit_scan_and_add_card'] = {
  init: function() {
    this.jsonInit({
      "type": "stemkit_scan_and_add_card",
      "message0": Blockly.Msg.BLOCK_STEMKIT_RFID_ADD_MESSAGE0,
      "args0": [
        {
          type: "field_dropdown",
          name: "list_name",
          options: [
            ["1", "1"],
            ["2", "2"],
            ["3", "3"],
            ["4", "4"],
            ["5", "5"]
          ],
        },
        {
          "type": "field_image",
          "src": ImgUrl + 'rfid.png',
          "width": 20,
          "height": 20,
          "alt": "*",
          "flipRtl": false
        }
      ],
      "previousStatement": null,
      "nextStatement": null,
      "colour": StemKitColorBlock,
      "tooltip": Blockly.Msg.BLOCK_STEMKIT_RFID_ADD_TOOLTIP,
      "helpUrl": Blockly.Msg.BLOCK_STEMKIT_RFID_ADD_HELPURL
    });
  },
  getDeveloperVars: function() {
    return ['stemkit_scan_and_add_card'];
  }
};

Blockly.Python['stemkit_scan_and_add_card'] = function(block) {
  var list_name = block.getFieldValue('list_name');
  Blockly.Python.definitions_['import_rfid'] = 'from stemkit_rfid import *';
  Blockly.Python.definitions_['import_rfid_init'] = 'stemkit_rfid = RFID()';
  var code = code = `stemkit_rfid.scan_and_add_card("rfids_${list_name}")\n`;
  return code;
};

Blockly.Blocks['stemkit_scan_and_remove_card'] = {
  init: function() {
    this.jsonInit({
      "type": "scan_and_remove_card",
      "message0": Blockly.Msg.BLOCK_STEMKIT_RFID_REMOVE_MESSAGE0,
      "args0": [
        {
          type: "field_dropdown",
          name: "list_name",
          options: [
            ["1", "1"],
            ["2", "2"],
            ["3", "3"],
            ["4", "4"],
            ["5", "5"]
          ],
        },
        {
          "type": "field_image",
          "src": ImgUrl + 'rfid.png',
          "width": 20,
          "height": 20,
          "alt": "*",
          "flipRtl": false
        }
      ],
      "previousStatement": null,
      "nextStatement": null,
      "colour": StemKitColorBlock,
      "tooltip": Blockly.Msg.BLOCK_STEMKIT_RFID_REMOVE_TOOLTIP,
      "helpUrl": Blockly.Msg.BLOCK_STEMKIT_RFID_REMOVE_HELPURL
    });
  },
  getDeveloperVars: function() {
    return ['stemkit_scan_and_remove_card'];
  }
};

Blockly.Python['stemkit_scan_and_remove_card'] = function(block) {
  var list_name = block.getFieldValue('list_name');
  Blockly.Python.definitions_['import_rfid'] = 'from stemkit_rfid import *';
  Blockly.Python.definitions_['import_rfid_init'] = 'stemkit_rfid = RFID()';
  var code = `stemkit_rfid.scan_and_remove_card("rfids_${list_name}")\n`;
  return code;
};

Blockly.Blocks['stemkit_clear_list'] = {
  init: function() {
    this.jsonInit({
      "type": "stemkit_clear_list",
      "message0": Blockly.Msg.BLOCK_STEMKIT_RFID_CLEAR_MESSAGE0 ,
      "args0": [
        {
          type: "field_dropdown",
          name: "list_name",
          options: [
            ["1", "1"],
            ["2", "2"],
            ["3", "3"],
            ["4", "4"],
            ["5", "5"]
          ],
        },
        {
          "type": "field_image",
          "src": ImgUrl + 'rfid.png',
          "width": 20,
          "height": 20,
          "alt": "*",
          "flipRtl": false
        }
      ],
      "previousStatement": null,
      "nextStatement": null,
      "colour": StemKitColorBlock,
      "tooltip": Blockly.Msg.BLOCK_STEMKIT_RFID_CLEAR_TOOLTIP,
      "helpUrl": Blockly.Msg.BLOCK_STEMKIT_RFID_CLEAR_HELPURL
    });
  },
  getDeveloperVars: function() {
    return ['stemkit_clear_list'];
  }
};

Blockly.Python['stemkit_clear_list'] = function(block) {
  var list_name = block.getFieldValue('list_name');
  Blockly.Python.definitions_['import_rfid'] = 'from stemkit_rfid import *';
  Blockly.Python.definitions_['import_rfid_init'] = 'stemkit_rfid = RFID()';
  var code = `stemkit_rfid.clear_list("rfids_${list_name}")\n`;
  return code;
};

// ============================================================================
//  Cam bien do line 5 mat (5 Channel Line Finder Array, STM32G030 I2C 0x24)
//  cam vao cong I2C. Cac lenh ROBOCON do line tu dung cam bien nay khi tim thay.
// ============================================================================

Blockly.Blocks['stemkit_robocon_line_sensor_type'] = {
  init: function () {
    this.jsonInit({
      "type": "stemkit_robocon_line_sensor_type",
      "message0": Blockly.Msg.BLOCK_STEMKIT_LINE_SENSOR_TYPE_MESSAGE0,
      "args0": [
        { "type": "field_image", "src": ImgUrl2 + 'line.svg', "width": 15, "height": 15, "alt": "*", "flipRtl": false },
        {
          "type": "field_dropdown",
          "name": "type",
          "options": [
            [Blockly.Msg.BLOCK_STEMKIT_LINE_SENSOR_AUTO, "LINE_AUTO"],
            [Blockly.Msg.BLOCK_STEMKIT_LINE_SENSOR_4, "LINE_STEMKIT"],
            [Blockly.Msg.BLOCK_STEMKIT_LINE_SENSOR_5, "LINE_ARRAY5"]
          ]
        }
      ],
      "inputsInline": true,
      "previousStatement": null,
      "nextStatement": null,
      "colour": StemKitColorBlock,
      "tooltip": Blockly.Msg.BLOCK_STEMKIT_LINE_SENSOR_TYPE_TOOLTIP,
      "helpUrl": ""
    });
  }
};

Blockly.Python["stemkit_robocon_line_sensor_type"] = function (block) {
  Blockly.Python.definitions_['import_robot'] = 'from stemkit_motor import *';
  Blockly.Python.definitions_['import_robocon'] = 'from stemkit_robocon import *';
  return "line_sensor_type(" + block.getFieldValue('type') + ")\n";
};

function stemkitLine5Option(name) {
  return {
    "type": "field_dropdown",
    "name": name,
    "options": [
      [{ "src": ImgUrl2 + 'line_finder_none_detect.png', "width": 15, "height": 15, "alt": "none" }, "0"],
      [{ "src": ImgUrl2 + 'line_finder_detect.png', "width": 15, "height": 15, "alt": "detect" }, "1"]
    ]
  };
}

Blockly.Blocks['stemkit_line5_read_all'] = {
  init: function () {
    this.jsonInit({
      "type": "stemkit_line5_read_all",
      "message0": Blockly.Msg.BLOCK_STEMKIT_LINE5_READ_ALL_MESSAGE0,
      "args0": [
        { "type": "field_image", "src": ImgUrl2 + 'line.svg', "width": 15, "height": 15, "alt": "*", "flipRtl": false },
        stemkitLine5Option("S1"),
        stemkitLine5Option("S2"),
        stemkitLine5Option("S3"),
        stemkitLine5Option("S4"),
        stemkitLine5Option("S5")
      ],
      "colour": StemKitColorBlock,
      "output": "Boolean",
      "tooltip": Blockly.Msg.BLOCK_STEMKIT_LINE5_READ_ALL_TOOLTIP,
      "helpUrl": ""
    });
  }
};

Blockly.Python["stemkit_line5_read_all"] = function (block) {
  Blockly.Python.definitions_['import_robot'] = 'from stemkit_motor import *';
  Blockly.Python.definitions_['import_robocon'] = 'from stemkit_robocon import *';
  var s = ["S1", "S2", "S3", "S4", "S5"].map(function (n) { return block.getFieldValue(n); });
  return ["read_line_array5() == (" + s.join(", ") + ")", Blockly.Python.ORDER_RELATIONAL];
};

Blockly.Blocks['stemkit_line5_read'] = {
  init: function () {
    this.jsonInit({
      "type": "stemkit_line5_read",
      "message0": Blockly.Msg.BLOCK_STEMKIT_LINE5_READ_MESSAGE0,
      "args0": [
        { "type": "field_image", "src": ImgUrl2 + 'line.svg', "width": 15, "height": 15, "alt": "*", "flipRtl": false },
        {
          "type": "field_dropdown",
          "name": "mode",
          "options": [
            [Blockly.Msg.BLOCK_STEMKIT_LINE5_MODE_DIGITAL, "digital"],
            [Blockly.Msg.BLOCK_STEMKIT_LINE5_MODE_ANALOG, "analog"]
          ]
        },
        {
          "type": "field_dropdown",
          "name": "index",
          "options": [["S1", "1"], ["S2", "2"], ["S3", "3"], ["S4", "4"], ["S5", "5"]]
        }
      ],
      "colour": StemKitColorBlock,
      "output": "Number",
      "tooltip": Blockly.Msg.BLOCK_STEMKIT_LINE5_READ_TOOLTIP,
      "helpUrl": ""
    });
  }
};

Blockly.Python["stemkit_line5_read"] = function (block) {
  Blockly.Python.definitions_['import_robot'] = 'from stemkit_motor import *';
  Blockly.Python.definitions_['import_robocon'] = 'from stemkit_robocon import *';
  var fn = (block.getFieldValue('mode') === 'analog') ? 'read_line_array5_raw' : 'read_line_array5';
  return [fn + "(" + block.getFieldValue('index') + ")", Blockly.Python.ORDER_FUNCTION_CALL];
};
