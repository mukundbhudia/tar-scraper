const rp = require('request-promise');
const $ = require('cheerio');
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
    }
    console.log(reviewPageUrls);

    for (let i = 0; i < 10; i++) {
        const reviewTitle = $('span.noQuotes', reviewContainer[i])[0].children[0].data
        const reviewText = $('p.partial_entry', reviewContainer[i])[0].children[0].data
        const reviewUserName = $('div.info_text > div', reviewContainer[i])[0].children[0].data
        const reviewDate = $('span.ratingDate', reviewContainer[i])[0].children[0].parent.attribs.title
        const reviewUserAvatar = $('div.ui_avatar.resp > img.basicImg', reviewContainer[i])[0].attribs.src
        reviewsDiv.push({
            'reviewTitle': reviewTitle,
            'reviewText': reviewText,
            'reviewUserName': reviewUserName,
            'reviewDate': reviewDate,
            'reviewUserAvatar': reviewUserAvatar
        });
    }
  })
  .catch(function(err){
    console.error(err);
});
