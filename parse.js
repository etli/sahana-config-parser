/*
  node parse
*/

var fs = require('fs');
var input = 'config.py';
var output = 'output.csv';

var regexSettings = /settings\.[\w]+\.[\w()\_\-\[\]]+[^\s=]/i;
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
        var defaultVal = handleQuotes(lines[i].match(regexDefaultVal)[1]);
        var desc = handleQuotes(getDesc(lines[i - 1]));     

        var outputRow = [lineNum, setting, module, name, defaultVal, desc].join(',') + '\n';

        // write to output file
        fs.appendFile(output, outputRow, function(err) {
          if (err) console.log(err);
        });
      }
    }
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

parseFile();
