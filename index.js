const rp = require('request-promise');
const $ = require('cheerio');
const fs = require('fs');
const reviewParse = require('./reviewScraper');

const url = 'https://www.tripadvisor.com.sg/Attraction_Review-g293891-d16813813-Reviews-Ankit_Treks-Pokhara_Gandaki_Zone_Western_Region.html';
// const url = 'https://www.tripadvisor.com.sg/Restaurant_Review-g293891-d8508841-Reviews-Rosemary_Kitchen-Pokhara_Gandaki_Zone_Western_Region.html'
let numberOfReviewsFound = 0;

rp(url)
  .then(function(html){
    const reviewPages = $('a.pageNum', html);
    const reviewCount = $('div.pagination-details > b:last-child', html);
    const reviewPageUrls = [];

    numberOfReviewsFound = reviewCount[0].children[0].data.match(/\d+/)[0]
    const numberOfReviewPages = Math.ceil(numberOfReviewsFound/10)

    reviewPageUrls.push(url);
    for (let i = 1; i < numberOfReviewPages; i++) {
        let reviewUrl = url.replace("-Reviews-", "-Reviews-or" + i + "0-");
        reviewPageUrls.push(reviewUrl);
    }

    console.log('Found ' + reviewPageUrls.length + ' review pages with ' + numberOfReviewsFound + ' reviews');

    return Promise.all(
        reviewPageUrls.map(function(url) {
          return reviewParse(url);
        })
      );
    })
    .then(function(reviews) {
        let merged = [].concat.apply([], reviews);
        console.log('There are ' + numberOfReviewsFound + ' reviews and ' + merged.length + ' have been scraped')

        var jsonContent = JSON.stringify(merged);
        
        fs.writeFile("out/output.json", jsonContent, 'utf8', function (err) {
            if (err) {
                console.log("An error occurred while writing JSON Object to File.");
                return console.log(err);
            }
        
            console.log("JSON file has been saved.");
        });
    })
  .catch(function(err){
    console.error(err);
  }
);
