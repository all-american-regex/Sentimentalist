angular.module('sL.about', [])

.service('About', function(){
	this.text = 'SentimentaList gathers the top results for a given topic\
	  from Google News and passes the text of those articles to indico’s \
	  Sentiment Analysis API. Along with the articles, Sentimentalist \
	  provides the user with scores that reflect the general sentiment \
	  (positivity/negativity) of those articles, their political sentiment, \
	  the predominant emotion expressed by the author and the personality type \
	  of the author.For more information on indico and its sentiment scores, \
	  visit https://indico.io/product.';
})