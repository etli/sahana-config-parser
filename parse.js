/*
  node parse
*/

var fs = require('fs');
var input = 'config.py';
var output = 'output.csv';

var regexSettings = /settings\.[\w]+\.[\w()\_\-\[\]]+/i;
var regexDefaultVal = /settings\.[\w]+\.[\w()\_\-\[\]]+[\s=]+([\w\W]+)/i;
var regexDesc = /[^\s#][\w\W]+/i;

function parseFile() {
  // clear output file
  fs.writeFile(output, '', function(err) {
    if (err) console.log(err);
  });

  // read input file
  fs.readFile(input, 'utf8', function(err, data) {
    var lines = data.split('\n');
    for (var i = 0; i < lines.length; i++) {
      
      // test for presence of settings.x.y
      var test = lines[i].match(regexSettings);
      
      if (test) {
        var setting = test[0];
        var lineNum = i + 1;
        var module = setting.split('.')[1];
        var name = setting.split('.')[2];
        var defaultVal = lines[i].match(regexDefaultVal)[1];
        var lastChar = defaultVal.charAt(defaultVal.length-1);
        if(lastChar == '{' || lastChar == ',' || lastChar == '['){
          // if the default value has several lines 
          var j = i;
          var newline;
          while(true){
            j++;
            if(!lines[j]) break;
            newline = lines[j].replace(/ /g,'')
            defaultVal += newline.substr(1);
            if(newline.charAt(newline.length-1) == '}' || newline.charAt(newline.length-1) == ')') break;
          }
          while(defaultVal.indexOf(',')!=-1){
            defaultVal = defaultVal.replaceAt(defaultVal.indexOf(','),';');
          }      
        }
        var desc = getDesc(lines[i - 1]);     

        var outputRow = [lineNum, setting, module, name, defaultVal, desc].join(',');

        // write to output file
        fs.appendFile(output, outputRow + '\n', function(err) {
          if (err) console.log(err);
        });
      }
    }
  });
}

function getDesc(line) {
  var descLine = line.match(regexDesc);
  if (descLine) {
    var containsSettings = descLine[0].match(regexSettings);
    if (containsSettings)
      return '';
    else {
      return descLine[0];
    }
  }         
}

String.prototype.replaceAt=function(index, character) {
    return this.substr(0, index) + character + this.substr(index+character.length);
}

parseFile();
