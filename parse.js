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
  // clear output file and add column headings
  fs.writeFile(output, 'Line #, Module, Name, Default Value, Description\n', function(err) {
    if (err) console.log(err);
  });

  // read input file
  fs.readFile(input, 'utf8', function(err, data) {
    var count = 0;

    var lines = data.split('\n');
    for (var i = 0; i < lines.length; i++) {
      
      // test for presence of settings.x.y
      var test = lines[i].match(regexSettings);
      
      if (test) {
        var setting = test[0];
        var lineNum = i + 1;
        var module = setting.split('.')[1];
        var name = setting.split('.')[2];
        var desc = handleQuotes(getDesc(lines[i - 1])); 

        var defaultVal = lines[i].match(regexDefaultVal)[1];
        var lastChar = defaultVal.charAt(defaultVal.length-1);
        if(lastChar == '{' || lastChar == '[' || lastChar == '(' || lastChar == ','){
          // if the default value has several lines 
          var j = i;
          var newline;
          while(true){
            j++;
            if(!lines[j]) break;
            newline = lines[j].replace(/ /g,'')
            defaultVal += newline.substr(1);
            if(newline.charAt(newline.length-1) == '}' || newline.charAt(newline.length-1) == ']' || newline.charAt(newline.length-1) == ')') break;
          }
        }
        defaultVal = handleQuotes(defaultVal);    

        var outputRow = [lineNum, module, name, defaultVal, desc].join(',') + '\n';

        // write to output file
        fs.appendFile(output, outputRow, function(err) {
          if (err) console.log(err);
        });

        count++;
      }
    }

    console.log('Success! ' + count + ' settings parsed.');
  });
}

function getDesc(line) {
  var descLine = line.match(regexDesc);
  if (descLine) {
    var hasSettings = descLine[0].match(regexSettings);
    if (hasSettings)
      return '';
    return descLine[0];
  }
  return '';        
}

// Replaces double quotes (") with two double quotes ("")
// and wraps entire field in quotes for cleaner CSV import
function handleQuotes(field) {
  return '"' + field.replace(/"/g, '""') + '"';
}

String.prototype.replaceAt = function(index, character) {
    return this.substr(0, index) + character + this.substr(index+character.length);
}

parseFile();
