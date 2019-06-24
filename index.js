const rp = require('request-promise');
const $ = require('cheerio');
const fs = require('fs');
const reviewParse = require('./reviewScraper');

const url = 'https://www.tripadvisor.com.sg/Attraction_Review-g293891-d16813813-Reviews-Ankit_Treks-Pokhara_Gandaki_Zone_Western_Region.html';

let numberOfReviewsFound = 0;

rp(url)
  .then(function(html){
    const reviewPages = $('a.pageNum', html);
    const reviewCount = $('div.pagination-details > b:last-child', html);
    const reviewPageUrls = [];

    numberOfReviewsFound = reviewCount[0].children[0].data.match(/\d+/)[0]

    const oKeys = Object.keys(reviewPages)
    const rightKeys = oKeys.filter((number) => {
        return Number.isInteger(parseInt(number)); 
    })

    for (let i = 0; i < rightKeys.length; i++) {
        const element = reviewPages[i];
        reviewPageUrls.push(element.attribs.href);
        // console.log(reviewParse('https://www.tripadvisor.com.sg' + element.attribs.href))
    }

    console.log('Found ' + reviewPageUrls.length + ' review pages');

    return Promise.all(
        reviewPageUrls.map(function(url) {
          return reviewParse('https://www.tripadvisor.com.sg' + url);
        })
      );
    })
    .then(function(reviews) {
        let merged = [].concat.apply([], reviews);
        // console.log(merged)
        console.log('There are ' + numberOfReviewsFound + ' reviews and ' + merged.length + ' have been scraped')

        var jsonContent = JSON.stringify(merged);
        // console.log(jsonContent);

        // var jsonObj = JSON.parse(jsonContent);
        // console.log(jsonObj);
        
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
