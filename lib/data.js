/*
 *
 * Library for working with data
 *
 */

// Dependencies
const fs = require('fs');
const path = require('path');
const helpers = require('./helpers');

// Container for the module
const datalib = {};

// Base directory of the data folder
datalib.basedir = path.join(__dirname, '../.data/');

// write data to a file
datalib.create = (dir, file, data, callback) => {
  // check if the directory exists
  if (!fs.existsSync(datalib.basedir + dir)) {
    //Create the directory if it doesnt exist
    fs.mkdir(datalib.basedir + dir, (err) => {
      if (err) {
        callback('Error creating the directory.');
      }
    });
  }
  // open the file for writing
  fs.open(datalib.basedir + dir + '/' + file + '.json', 'wx', (err, fd) => {
    if (!err && fd) {
      // convert data to a string
      const stringData = JSON.stringify(data);

      // write to file and close it
      fs.writeFile(fd, stringData, (err) => {
        if (!err) {
          fs.close(fd, (err) => {
            if (!err) {
              callback(false);
            } else {
              callback('Error closing file');
            }
          });
        } else {
          callback('Error writing to new file');
        }
      });
    } else {
      callback('Could not create file, it may already exist');
    }
  });
};

// read data from a file
datalib.read = (dir, file, callback) => {
  // read the file
  fs.readFile(datalib.basedir + dir + '/' + file + '.json', 'utf8', (err, data) => {
    if (!err && data) {
      const parsedData = helpers.parseJsonToObject(data);
      callback(false, parsedData);
    } else {
      callback(err, data);
    }
  });
};

// update data on a file
datalib.replace = (dir, file, data, callback) => {
  // update the file
  fs.open(datalib.basedir + dir + '/' + file + '.json', 'r+', (err, fd) => {
    if (!err && fd) {
      // convert the data into a string
      const stringData = JSON.stringify(data);

      // truncate the file
      fs.truncate(fd, (err) => {
        if (!err) {
          // write to the file and close it
          fs.writeFile(fd, stringData, (err) => {
            if (!err) {
              fs.close(fd, (err) => {
                if (!err) {
                  callback(false);
                } else {
                  callback('Error closing the existing file');
                }
              });
            } else {
              callback('Error writing to the existing file');
            }
          });
        } else {
          callback('Error truncating file');
        }
      });
    } else {
      callback('Could not open file for update, it may not exist yet');
    }
  });
};

// update data on a file
datalib.update = (dir, file, dataRecieved, callback) => {
  // read the file
  fs.readFile(datalib.basedir + dir + '/' + file + '.json', 'utf8', (err, data) => {
    if (!err) {
      // parse the data to a json object
      parsedData = JSON.parse(data);
      // check if the key exists;
      for (let key in dataRecieved) {
        if (parsedData.hasOwnProperty(key)) {
          parsedData[key] = dataRecieved[key];
        }
      }

      // convert the updated data into a string
      const stringData = JSON.stringify(parsedData);

      // update the file
      fs.open(datalib.basedir + dir + '/' + file + '.json', 'r+', (err, fd) => {
        if (!err && fd) {
          fs.truncate(fd, (err) => {
            if (!err) {
              // write to the file and close it
              fs.writeFile(fd, stringData, (err) => {
                if (!err) {
                  fs.close(fd, (err) => {
                    if (!err) {
                      callback(false);
                    } else {
                      callback('Error closing the existing file');
                    }
                  });
                } else {
                  callback('Error writing to the existing file');
                }
              });
            } else {
              callback('Error truncating file');
            }
          });
        } else {
          callback('Could not open file for update, it may not exist yet');
        }
      });
    } else {
      callback('Error reading file');
    }
  });
};

// delete data on a file
datalib.delete = (dir, file, callback) => {
  //unlink the file
  fs.unlink(datalib.basedir + dir + '/' + file + '.json', (err) => {
    if (!err) {
      // delete the directory if it is empty
      fs.readdir(datalib.basedir + dir, (err, files) => {
        if (!err && files.length == 0) {
          fs.rmdir(datalib.basedir + dir, (err) => {
            if (!err) {
              callback(false);
            } else {
              callback('Error deleting directory');
            }
          });
        } else {
          callback('Directory not empty');
        }
      });
    } else {
      callback('Error deleting file');
    }
  });
};

// export the data library
module.exports = datalib;
