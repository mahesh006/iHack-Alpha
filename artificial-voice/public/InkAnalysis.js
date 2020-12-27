function NetworkException(xhttp) {
    Error.call(this, xhttp.responseText);
    this.name = "NetworkException";
    this.status = xhttp.status;
}

function InkRecognitionException(message) {
    Error.call(this, message);
    this.name = "InkRecognitionException";
}

function BadRequestException(xhttp) {
    InkRecognitionException.call(this, "");
    this.name = "BadRequestException";
    this.status = xhttp.status;
    this.rawMessage = xhttp.responseText;
    var messageArray = JSON.parse(this.rawMessage).details
    var message = [];
    for (var index = 0; index < messageArray.length; index += 1) {
        messageArray[index] = messageArray[index].message;
    }
    this.message = messageArray.join("<br/>");
}

UNIT_CATEGORY_TO_TYPE = {
    inkDrawing: Shape,
    inkWord: Word,
    line: Line,
    inkBullet: Bullet
};

function RecognitionUnit(unitJObject) {
    this.json = unitJObject;
    this.id = unitJObject.id;
    this.strokeIds = unitJObject.strokeIds;
    this.category = unitJObject.category;
    this.class = unitJObject.class;
    this.isLeaf = (this.class === "leaf");
    this.children = this.isLeaf ? [] : unitJObject.childIds;
    this.parent = unitJObject.parentId;
    this.boundingRectangle = unitJObject.boundingRectangle;
    this.rotatedBoundingRectangle = unitJObject.rotatedBoundingRectangle;
}

function Shape(unitJObject) {
    RecognitionUnit.call(this, unitJObject);

    this.center = unitJObject.center;
    this.confidence = unitJObject.confidence;
    this.shape = unitJObject.recognizedObject;
    this.rotationAngle = unitJObject.rotationAngle;
    this.points = unitJObject.points;

    this.getAlternates = function (alternatesJArray) {
        if (typeof (alternatesJArray) === "undefined" || !alternatesJArray || alternatesJArray.length === 0) {
            return [];
        }
        var alternates = [];
        alternatesJArray.map(function (obj) {
            alternates.push({
                "shape": obj.recognizedString,
                "points": obj.points,
                "rotationAngle": obj.orientation
            });
        });
        return alternatesJArray;
    };
    this.alternates = this.getAlternates(unitJObject.alternates);
}

function Word(unitJObject) {
    RecognitionUnit.call(this, unitJObject);
    this.text = unitJObject.recognizedText

    this.getAlternates = function (alternatesJArray) {
        if (typeof (alternatesJArray) === "undefined" || !alternatesJArray || alternatesJArray.length === 0) {
            return [];
        }

        return alternatesJArray.map(function (obj) {
            return obj.recognizedString;
        });
    };

    this.alternates = this.getAlternates(unitJObject.alternates);
}

function Line(unitJObject) {
    RecognitionUnit.call(this, unitJObject);
    this.text = unitJObject.recognizedText
}

function Bullet(unitJObject) {
    RecognitionUnit.call(this, unitJObject);
    this.text = unitJObject.recognizedText
}

function InkRecognitionResult(xhttp) {
    var json = JSON.parse(xhttp.responseText);

    var optionalProperties = ['language', 'unit', 'version'];
    optionalProperties.forEach(function (e) {
        if (json.hasOwnProperty(e)) {
            this[e] = json[e];
        }
    });

    InkRecognitionResult.prototype.convertJObjectToUnit = function (unitJObject) {
        var category = unitJObject.category;
        var classType = UNIT_CATEGORY_TO_TYPE[category];
        if (classType) {
            return new classType(unitJObject);
        } else {
            return new RecognitionUnit(unitJObject);
        }
    };

    var that = this;
    this.recognitionUnits = json.recognitionUnits.map(function (u) {
        return that.convertJObjectToUnit(u);
    });

    InkRecognitionResult.prototype.findByCategory = function (category) {
        return this.recognitionUnits.filter(function (u) {
            return u.category === category;
        });
    };

    InkRecognitionResult.prototype.findShapes = function () {
        return this.findByCategory("inkDrawing");
    };

    InkRecognitionResult.prototype.findWords = function () {
        return this.findByCategory("inkWord");
    };

    InkRecognitionResult.prototype.findBullets = function () {
        return this.findByCategory("inkBullet");
    };

    InkRecognitionResult.prototype.findLines = function () {
        return this.findByCategory("line");
    };

    InkRecognitionResult.prototype.findParagraphs = function () {
        return this.findByCategory("paragraph");
    };

    InkRecognitionResult.prototype.findListitems = function () {
        return this.findByCategory("listItem");
    };

    InkRecognitionResult.prototype.findWritingRegions = function () {
        return this.findByCategory("writingRegion");
    };
}

function Recognizer(url, subscriptionKey, language, version) {
    this.url = url;
    this.subscriptionKey = subscriptionKey;
    this.language = (typeof (language) === "undefined" || !language) ? "en-US" : language;
    this.version = (typeof (version) === "undefined" || !version) ? 1 : version;

    this.returnFunction = null;
    this.errorFunction = null;
    this.strokes = [];

    Recognizer.prototype.addStroke = function (id, data) {
        this.strokes.push({
            "id": id,
            "points": data
        });
    };

    Recognizer.prototype.data = function () {
        var cloudIAFormat = {
            version: this.version,
            language: this.language,
            strokes: this.strokes
        };
        return JSON.stringify(cloudIAFormat);
    };

    Recognizer.prototype.recognize = function (returnFunction, errorFunction) {
        this.returnFunction = returnFunction;
        this.errorFunction = errorFunction;

        var xhttp = new XMLHttpRequest(),
            error, result;
        xhttp.onreadystatechange = function () {
            if (this.readyState === 4) {
                switch (this.status) {
                    case 200:
                        result = new InkRecognitionResult(xhttp);
                        returnFunction(result, xhttp.responseText); 
                        var response = xhttp.responseText;                       
                        var data = JSON.parse(this.response);         
                        console.log(data.recognitionUnits[0].recognizedText);
                        break;
                    case 400:
                        error = new BadRequestException(xhttp);
                        errorFunction(error);
                        break;

                    default:
                        error = new NetworkException(xhttp);
                        errorFunction(error);
                        break;
                }
            }
        };
        xhttp.open("PUT", this.url, true);
        xhttp.setRequestHeader("Ocp-Apim-Subscription-Key", this.subscriptionKey);
        xhttp.setRequestHeader("Content-Type", "application/json");
        xhttp.send(this.data());
    };
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
        "."  : "·−·−·−",
        ","  : "−−··−−",
        ":"  : "−−−···",
        ";"  : "−·−·−·",
        "?"  : "··−−··",
        "-"  : "−····−",
        "_"  : "··−−·−",
        "("  : "−·−−·",
        ")"  : "−·−−·−",
        "'"  : "·−−−−·",
        "="  : "−···−",
        "+"  : "·−·−·",
        "/"  : "−··−·",
        "@"  : "·−−·−·"
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
    let output = []; // Alternating beep and silence lenghts
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
