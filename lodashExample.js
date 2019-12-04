const _ = require('lodash');


const arr = [
    { username: 'A', grade: 20},
    { username: 'A', grade: 20},
    { username: 'A', grade: 20},
    { username: 'B', grade: 20},
    { username: 'C', grade: 20},
];


const L = _.uniqBy(_.map(arr, i => i.username));
console.log(L);
console.log(_.map(arr, 'username'));


// let m = _.uniqBy(arr, function (e) {
//     return e.username;
//   });
// console.log(m);  


//------------- GroupBy ---------------------------
console.log('------ GroupBy -------------------');
const groupByResult = _.groupBy(arr, 'username');
console.log(groupByResult);
console.log('A has '+groupByResult['A'].length + 'records:');
console.log(groupByResult['A']);
console.log(groupByResult['A'][0]);



_.uniqBy(_.map(arr, i => i.username))
  .forEach(username => {

  })


//-----------------------------------------
var users = [
    { 'user': 'barney',  'age': 36 },
    { 'user': 'fred',    'age': 40 },
    { 'user': 'pebbles', 'age': 1 }
  ];
   
  var youngest = _
    .chain(users)
    .sortBy('age')
    .map(function(o) {
      return o.user + ' is ' + o.age;
    })
    .head()
    .value();
  // => 'pebbles is 1'
  console.log(youngest);



  //-----------------------------------------