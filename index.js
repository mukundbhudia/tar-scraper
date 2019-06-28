const rp = require('request-promise');
const $ = require('cheerio');
const fs = require('fs');
const reviewParse = require('./reviewScraper');

process.argv.shift()
process.argv.shift()

const url = process.argv.join(" ")

console.log('Finding reviews from: ' + url + '\n')
let numberOfReviewsFound = 0;

rp(url)
  .then(function(html){
    const reviewCount = $('div.pagination-details > b:last-child', html);
    const reviewPageUrls = [];

    numberOfReviewsFound = reviewCount[0].children[0].data.replace(',', '').match(/\d+/)[0]
    const numberOfReviewPages = Math.ceil(numberOfReviewsFound/10)

    reviewPageUrls.push(url);
    for (let i = 1; i < numberOfReviewPages; i++) {
      let reviewUrl = url.replace("-Reviews-", "-Reviews-or" + i + "0-");
      reviewPageUrls.push(reviewUrl);
    }

    console.log('Found ' + reviewPageUrls.length + ' review pages with ' + numberOfReviewsFound + ' reviews...\n');

    return Promise.all(
        reviewPageUrls.map(function(url) {
          return reviewParse(url);
        })
      );
    })
    .then(function(reviews) {
      let merged = [].concat.apply([], reviews);
      console.log('There are ' + numberOfReviewsFound + ' reviews on the page and ' + merged.length + ' have been scraped');
      if (numberOfReviewsFound != merged.length) {
        return console.log('Error: There is a mismatch between the number of reviews on the page and the number scraped');
      } else {
        var jsonContent = JSON.stringify(merged);
        
        fs.writeFile("out/output.json", jsonContent, 'utf8', function (err) {
          if (err) {
            console.log("An error occurred while writing JSON Object to File.");
            return console.log(err);
          }          
          console.log("JSON file has been saved.");
        });
      }
    })
  .catch(function(err){
    console.error(err);
  }
);
