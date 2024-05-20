const grpc = require("@grpc/grpc-js");
const { CalculatorServiceClient } = require("../proto/calculator_grpc_pb");
const { SumRequest } = require("../proto/sum_pb");
const { PrimeRequest } = require("../proto/primes_pb");
const { AvgRequest } = require("../proto/avg_pb");
const { MaxRequest } = require("../proto/max_pb");
const {SqrtRequest} = require('../proto/sqrt_pb');

function doSum(client) {
  console.log("doSum was invoked");
  const req = new SumRequest().setFirstNumber(1).setSecondNumber(1);

  client.sum(req, (err, res) => {
    if (err) return console.log(err);
    console.log(`Sum: ${res.getResult()}`);
  });
}

function doPrimes(client) {
  console.log("doPrimes was invoked");
  const req = new PrimeRequest();

  req.setNumber(12390392840);
  const call = client.primes(req);

  call.on("data", (res) => {
    console.log(`Primes: ${res.getResult()}`);
  });
  call.on("end", () => {
    console.log("Streaming ended.");
  });
}

function doAvg(client){
  console.log("doAvg was invoked");
  const numbers = [1,2,3,4,5];
  const call = client.avg((err, res) => {
    if (err) return console.log(err);
    console.log(`Average: ${res.getResult()}`);
  })

  numbers.map((num) => {
    return new AvgRequest().setNumber(num);
  }).forEach((req) => call.write(req));

  call.end();
}

function doMax(client) {
  console.log('doMax was invoked');
  const numbers = [4, 7, 2, 19, 4, 6, 32];
  const call = client.max();

  call.on('data', (res) => {
    console.log(`Max: ${res.getResult()}`);
  });

  numbers.map((number) => {
    return new MaxRequest().setNumber(number);
  }).forEach((req) => call.write(req));

  call.end();
}

function doSqrt(client, n) {
  console.log('doSqrt was invoked');
  const req = new SqrtRequest();

  req.setNumber(n);
  client.sqrt(req, (err, res) => {
    if (err) {
      return console.log(err);
    }

    console.log(`Sqrt: ${res.getResult()}`);
  });
}

// function doLongGreet(client){
//   console.log("doLongGreet was invoked");
//   const names = ['Sourav','Nandan','Kumuda'];
//   const call = client.longGreet((err, res) => {
//     if (err) return console.log(err);
//     console.log(`LongGreet: ${res.getResult()}`);
//   })

//   names.map((name) => {
//     return new GreetRequest().setFirstName(name);
//   }).forEach((req) => call.write(req));

//   call.end();
// }

function main() {
  const creds = grpc.ChannelCredentials.createInsecure();
  const client = new CalculatorServiceClient("0.0.0.0:50051", creds);

  //   doSum(client);
  // doPrimes(client);
  // doAvg(client);
  // doMax(client);
  doSqrt(client, 25);

  client.close();
}

main();
