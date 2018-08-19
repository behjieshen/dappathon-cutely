module.exports = function(router) {
  var AWS = require('aws-sdk');

  AWS.config.update({
    region: 'ap-southeast-1',
    credentials: {
      accessKeyId: 'AKIAIBIYJGS62CRACHFA',
      secretAccessKey: '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'
    }
  });

  const s3 = new AWS.S3({
    credentials: {
      accessKeyId: 'AKIAIBIYJGS62CRACHFA',
      secretAccessKey: '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'
    }
  });

  // File upload
  var path = require('path');
  var multerS3 = require('multer-s3');
  var multer = require('multer');
  var upload = multer({
    storage: multerS3({
      s3: s3,
      bucket: 'dappathon',
      // Set public read permissions
      acl: 'public-read',
      // Auto detect content type
      contentType: multerS3.AUTO_CONTENT_TYPE,
      key: function(req, file, cb) {
        cb(null, Date.now().toString() + path.extname(file.originalname));
      }
    }),
    fileFilter: function(req, file, callback) {
      var ext = path.extname(file.originalname);
      if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg' && ext !== '.pdf' && ext !== '.docx') {
        return callback(new Error('Only images are allowed'));
      }
      callback(null, true);
    }
  });

  var conf = require('../config.json');
  var abi = require('../15-example_contract/build/contracts/CrowdFunder.json');
  var Web3 = require('web3');
  var contract = require('truffle-contract');
  var BigNumber = require('bignumber.js');
  var Url = require('url');

  var http = require('http');

  var provider = new Web3.providers.HttpProvider(conf.provider);
  var web3 = new Web3(provider);
  var MyContract = contract(abi);
  MyContract.setProvider(provider);
  MyContract.defaults({ gasPrice: 10, gas: 1000000 });

  router.get('/hookup', function(req, res) {
    var address1 = '0x2Ac4fea62228f3973a19b04072a3eDBa3EC55F0F';
    var address2 = '0x94c73E0F25c950858756d7F72eeFf9dB21507C0b';

    MyContract.at(conf.contract.address).then(function(crowdFunder) {
      crowdFunder.myNum.call().then(function(data) {
        console.log(data);
      });
      crowdFunder
        .enter(address1, address2, { from: address1 })
        .then(function() {
          console.log('yay');
          res.send('Thank you');
        })
        .catch(function(err) {
          console.log(err);
          res.send(err);
        });
    });
  });

  router.post('/face-upload', upload.single('signup-face-image'), function(req, res) {
    res.render('profile', {
      face: req.file.location
    });
  });

  router.post('/upload-photo', upload.single('signup-face-image'), function(req, res) {
    res.render('scanning', {
      face: req.body.faceImage,
      profile: req.file.location
    });
  });

  router.post('/user-list', function(req, res) {
    res.render('list', {
      face: req.body.face,
      profile: req.body.profile
    });
  });

  router.post('/matched', function(req, res) {
    res.render('matched', {
      image: req.body.matchedImage
    });
  });

  router.get('/', function(req, res) {
    res.render('index');
  });
};
