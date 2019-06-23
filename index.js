const rp = require('request-promise');
const $ = require('cheerio');
const fs = require('fs');
const reviewParse = require('./reviewScrapper');

const url = 'https://www.tripadvisor.com.sg/Attraction_Review-g293891-d16813813-Reviews-Ankit_Treks-Pokhara_Gandaki_Zone_Western_Region.html';

rp(url)
  .then(function(html){
    const reviewPages = $('a.pageNum', html);
    const reviewContainer = $('div.reviewSelector', html);
    const reviewPageUrls = [];
    const reviewsDiv = [];

    const oKeys = Object.keys(reviewPages)
    const rightKeys = oKeys.filter((number) => {
        return Number.isInteger(parseInt(number)); 
    })

    for (let i = 0; i < rightKeys.length; i++) {
        const element = reviewPages[i];
        reviewPageUrls.push(element.attribs.href);
        // console.log(reviewParse('https://www.tripadvisor.com.sg' + element.attribs.href))
    }
    console.log(reviewPageUrls);

    return Promise.all(
        reviewPageUrls.map(function(url) {
          return reviewParse('https://www.tripadvisor.com.sg' + url);
        })
      );
    })
    .then(function(reviews) {  
        console.log(reviews)
        var jsonObj = JSON.parse(reviews);
        console.log(jsonObj);
        
        // stringify JSON Object
        var jsonContent = JSON.stringify(jsonObj);
        console.log(jsonContent);
        
        fs.writeFile("output.json", jsonContent, 'utf8', function (err) {
            if (err) {
                console.log("An error occured while writing JSON Object to File.");
                return console.log(err);
            }
        
            console.log("JSON file has been saved.");
        });
    })
  .catch(function(err){
    console.error(err);
});
