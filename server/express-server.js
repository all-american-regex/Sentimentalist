var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var scraper = require('./modules/searchscrape');
var indico = require('indico.io');
var Path = require('path');

app.use('/', express.static('client'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.listen(process.env.PORT || 3000, function() {
	console.log('Server Started!');
});

var routes = express.Router();
app.use('/', routes);

var assetFolder = Path.resolve(__dirname, '../client/');
routes.use(express.static(assetFolder));

var options = {
  query: 'donald trump',
  host: 'www.google.com',
  age: 'd1', // last 24 hours ([hdwmy]\d? as in google URL)
  limit: 1,
  params: {news: 'tbm=nws'} // params will be copied as-is in the search URL query string
};

scraper.search(options, function(err, url) {
  // This is called for each result
  if(err) throw err;
  console.log(url)
});

indico.apiKey =  'b9e9ccab87575fd3963bfb0150da6fe4';

var response = function(res) { console.log(res); }
var logError = function(err) { console.log(err); }

// single example
indico.political("Marco Rubio is moving to lock down his delegates until the Republican convention so no one else can claim them just yet, in an unconventional move that represents the latest bid to stall Donald Trump’s front-running campaign – and perhaps give the Florida senator and ex-candidate a bigger role to play in July.\n\nA Rubio spokesman confirmed the push Wednesday, while suggesting it’s more an effort to thwart Trump by denying him the necessary delegates than to somehow get Rubio back in the game in the event of a contested convention.\n\n\"Of course, he's no longer a candidate and wants to give voters a chance to stop Trump,\" spokesman Alex Burgos told FoxNews.com.\n\nRubio is making his personal appeal in a letter to the chairs of state Republican parties across the country, the entities that decide how to divvy up delegates.\n\nWhile some of the senator’s delegates might otherwise be allowed to support other candidates before the July convention, Rubio is asking that those delegates be “bound” to him through at least the first round of voting at the convention.\n\nThe letter, a copy of which was obtained by FoxNews.com, says the decision to suspend his campaign was “not intended to release any National Convention Delegates bound to me as a result of the 2016 delegate selection process that took place in your State.\n\n2016 Election Headquarters The latest headlines on the 2016 elections from the biggest name in politics. See Latest Coverage →\n\n“It is my desire at this time that the delegates allocated to me by your rules remain bound to vote for me on at least the first nominating ballot at the National Convention.”\n\nAccording to MSNBC, Rubio is sending the letter to parties in all 21 states and territories where he won delegates.\n\nAs of Wednesday afternoon, Rubio had 171 delegates to his name. In a normal year, such a delegate haul might not matter much – but in the competitive 2016 GOP primary race, keeping all those delegates off the field could potentially keep Trump from clinching the nomination pre-convention with the necessary 1,237.\n\nTrump currently has 736; Texas Sen. Ted Cruz has 463; and Ohio Gov. John Kasich has 143.\n\nUnder the complex set of rules governing each state’s primary, dozens of Rubio’s delegates – though not all of them -- would normally become “unbound” before the convention and free to vote for whomever they choose.\n\nEver since Rubio suspended his campaign, those delegates have been an attractive target for the remaining candidates. Barry Bennett, a senior adviser to the Trump campaign, recently told FoxNews.com the campaign already had started “going after” the “unbound” delegates.\n\n“We aren’t going to waste resources on them, but if you’re 'wooable' we plan to woo,” Bennett said.\n\nIt’s unclear whether any sizeable number of Rubio’s delegates would back Trump anyway, as Rubio himself describes Cruz as the only true conservative left in the race. But Rubio’s letter-writing push is an attempt to prevent Trump from peeling off any before the convention.\n\nMSNBC reported that the chairman of the Alaska GOP already has agreed to grant Rubio’s request.\n\nAlaska previously had divvied up Rubio's five delegates to Trump and Cruz. However, since the actual people have not been selected yet, the state party said the delegates will go back to Rubio.\n\nIn Oklahoma, state party Chairwoman Pam Pollard said she also received a letter from Rubio saying he has not released his 12 delegates from that state.\n\nMeanwhile, the three remaining Republican candidates are ramping up efforts to win over Rubio's delegates, in addition to claiming dozens more unbound delegates, in the contentious battle for the 1,237 delegate majority.\n\nAcknowledging a late start in the nuts-and-bolts business of political wrangling, Trump's campaign will open a Washington, D.C. office in the coming days to run its delegate operation and congressional relations team, Bennett told the AP. In addition to the new space, Trump has hired a veteran political operative to serve as the campaign's convention manager. Paul Manafort, a seasoned Washington hand, will oversee the campaign's \"entire convention presence\" including a potential contested convention, said Bennett.\n\nThere are certain states where the allocation of delegates to the GOP convention is so complicated that they could produce outcomes where a candidate who did not prevail in a given primary might yet win that state’s delegates to the convention.\n\nTrump has vowed to both file a lawsuit and an internal challenge within the Republican National Committee over reports that Cruz, despite losing the Louisiana primary to Trump in early March, could draw the support of enough “unbound” delegates and from Rubio supporters to actually overtake Trump in the state by as many as 10 delegates.\n\nAsked on March 15 if he was preparing for a contested convention, Cruz told Fox News, “We make preparations for every contingency.”\n\nFoxNews.com’s Judson Berger and Adam Shaw, Fox News’ James Rosen and The Associated Press contributed to this report.")
  .then(response)
  .catch(logError);

// batch example
// var batchInput = [
//     "I love writing code!",
//     "Alexander and the Terrible, Horrible, No Good, Very Bad Day"
// ];
// indico.sentimentHQ(batchInput)
//   .then(response)
//   .catch(logError);

