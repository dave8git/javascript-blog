'use strict';
const templates = {
  articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
  tagLink: Handlebars.compile(document.querySelector('#template-tag-link').innerHTML),
  authorLink: Handlebars.compile(document.querySelector('#template-author-link').innerHTML),
  tagCloudLink: Handlebars.compile(document.querySelector('#template-tag-cloud-link').innerHTML),
  authorCloudLink: Handlebars.compile(document.querySelector('#template-authors-cloud-link').innerHTML)
}
function titleClickHandler(event) {
  event.preventDefault();
  const clickedElement = this;
  const activeLinks = document.querySelectorAll('.titles a.active'); // remove class 'active' from all article links
  for (let activeLink of activeLinks) {
    activeLink.classList.remove('active');
  }
  clickedElement.classList.add('active'); // add class 'active' to the clicked link
  const activeArticles = document.querySelectorAll('.posts article.active'); // remove class 'active' from all articles
  for (let activeArticle of activeArticles) {
    activeArticle.classList.remove('active');
  }
  const clickedHref = clickedElement.getAttribute('href'); //get 'href' attribute from the clicked link
  const targetArticle = document.querySelector(clickedHref); // find the correct article using the selector (value of 'href' attribute)
  targetArticle.classList.add('active'); // add class 'active' to the correct article
}

const optArticleSelector = '.post',
  optTitleSelector = '.post-title',
  optTitleListSelector = '.titles',
  optArticleTagsSelector = '.post-tags .list',
  optArticleAuthorSelector = '.post-author',
  optTagsListSelector = '.tags .list',
  optCloudClassCount = 5,
  optCloudClassPrefix = 'tag-size-',
  optAuthorsListSelector = '.authors .list';

function generateTitleLinks(customSelector = '') {
  const titleList = document.querySelector(optTitleListSelector); // remove contents of titleList
  titleList.innerHTML = '';
  const articles = document.querySelectorAll(optArticleSelector + customSelector);
  // console.log(customSelector);
  let linkHTML = '';
  for (let article of articles) { // for each article
    const articleId = article.getAttribute('id'); // get the article id
    const articleTitle = article.querySelector(optTitleSelector).innerHTML; // find the title element // get the title from the titile element
    //linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>'; // create HTML of the link
    const linkHTMLData = {id: articleId, title: articleTitle};
    const linkHTML = templates.articleLink(linkHTMLData);
    titleList.insertAdjacentHTML('beforeend', linkHTML);
  }
  // console.log(linkHTML);
  const links = document.querySelectorAll('.titles a'); //find all links in element with class titles and add event listener click to all of them
  for (let link of links) {
    link.addEventListener('click', titleClickHandler);
  }
}
generateTitleLinks();

function calculateTagsParams(tags) {
  const params = {
    max: 0,
    min: 999999
  };
  for (let tag in tags) {
    if (tags[tag] > params.max) {
      params.max = tags[tag];
    }
    if (tags[tag] < params.min) {
      params.min = tags[tag];
    }
    // console.log(tag + ' is used ' + tags[tag] + ' times');
  }
  return params;
}

function calculateTagClass(count, params) {
  const normalizedCount = count - params.min;
  const normalizedMax = params.max - params.min;
  const percentage = normalizedCount / normalizedMax;
  const classNumber = Math.floor(percentage * (optCloudClassCount - 1) + 1);
  return classNumber;
}

function generateTags() {
  let allTags = {}; // create a new variable allTags with an empty array

  const articles = document.querySelectorAll(optArticleSelector); // find all articles
  for (let article of articles) { // START LOOP: for every article:
    // console.log(article);
    const tagsWrapper = article.querySelector(optArticleTagsSelector); // find tags wrapper
    let html = ''; // make html variable with empty string
    const articleTags = article.getAttribute('data-tags'); // get tags from data-tags attribute
    const articleTagsArray = articleTags.split(' '); // split tags into array
    for (let tag of articleTagsArray) { // START LOOP: for each tag
      // console.log('splitTags:' + splitTags);
      // const linkHTML = '<li><a href="#tag-' + tag + '">' + tag + '</a></li>'; // generate HTML of the link
      const tagHTMLData = {id: tag, title: tag};
      const tagHTML = templates.tagLink(tagHTMLData);
      // console.log('tagHTML:', tagHTML);
      html += tagHTML; // add generated code to html variable
      // console.log('html:', html);
      if (!allTags.hasOwnProperty(tag)) { //(allTags.indexOf(htmlLink) == -1) { // add generated code to allTags array
        // console.log('allTags: ', allTags);
        allTags[tag] = 1; // allTags.push(htmlLink); // add generated code to allTags array
      } else {
        allTags[tag]++;
      }
    } // END LOOP: for each tag
    // console.log('allTags:', allTags);
    // console.log('tagsWrapper:', tagsWrapper);
    tagsWrapper.insertAdjacentHTML('beforeend', html); //insert HTML of all the links into the tags wrapper
  } // END LOOP: for every article
  const tagList = document.querySelector('.tags'); // find list of tags in right column
  // tagList.innerHTML = allTags.join(' ');
  // console.log('allTags:', allTags);
  const tagsParams = calculateTagsParams(allTags);
  // console.log('tagsParams:', tagsParams);
  //let allTagsHTML = ''; // create variable for all links HTML code
  const allTagsData = {tags: []};
  for (let tag in allTags) {
    //const tagLinkHTML = '<li><a class="' + optCloudClassPrefix + calculateTagClass(allTags[tag], tagsParams) + '" href="#tag-' + tag + '">' + tag + '</a></li>' + ' ';
    // console.log('tagLinkHTML:', tagLinkHTML);
    /* [NEW] generate code of a link and add it to allTagsHTML */
    //allTagsHTML += tagLinkHTML;
    allTagsData.tags.push({
      tag: tag,
      count: allTags[tag],
      className: optCloudClassPrefix + calculateTagClass(allTags[tag], tagsParams)
    });
    /* [NEW] END LOOP: for each tag in allTags: */
  }

  /*[NEW] add HTML from allTagsHTML to tagList */
  //tagList.innerHTML = allTagsHTML;
  tagList.innerHTML = templates.tagCloudLink(allTagsData);
  // console.log(allTagsData);

}
generateTags();
///*' (' + allTags[tag] + ')*/
// class="' + optCloudClassPrefix + '"' + ' ' +  + calculateTagClass(optCloudClassCount, calculateTagsParams())

function tagClickHandler(event) {
  event.preventDefault(); // prevent default action for this event
  const clickedElement = this; // make new constant named "clickedElement" and give it the value of "this"
  const href = clickedElement.getAttribute('href'); // make a new constant "href" and read the attribute "href" of the clicked element
  const tag = href.replace('#tag-', ''); // make a new constant "tag" and extract tag from the "href" constant
  // console.log(tag);
  const activeTags = document.querySelectorAll('a.active[href^="#tag-"]'); // find all tag links with class active
  // console.log(activeTags);
  for (let activeTag of activeTags) { // START LOOP: for each active tag link
    activeTag.classList.remove('active'); // remove class active
  } // END LOOP: for each actie tag link
  const hrefTagLinks = document.querySelectorAll('a[href="' + href + '"]'); // find all tag links with "href" attribute equal to the "href" constant constant */
  for (let hrefTagLink of hrefTagLinks) { // START LOOP: for each found tag link
    hrefTagLink.classList.add('active'); // add class active
  } // END LOOP: for each found tag link
  generateTitleLinks('[data-tags~="' + tag + '"]'); // execute function "generateTitleLinks" with article selector as argument
}

function addClickListenersToTags() {
  const linksTags = document.querySelectorAll('a[href^="#tag-"]'); // find all links to tags
  for (let linkTag of linksTags) { // START LOOP: for each link
    linkTag.addEventListener('click', tagClickHandler); // add tagClickHandler as event listener for that link
  } // END LOOP: for each link
}
addClickListenersToTags();

function generateAuthors() {
  let allAuthors = {};
  const articles = document.querySelectorAll(optArticleSelector);
  for (let article of articles) {
    const authorsWrapper = article.querySelector(optArticleAuthorSelector);
    let html = '';
    const author = article.getAttribute('data-author');
    //html = '<a href="#author-' + author + '">' + author + '</a>';
    const authorsHTMLData = {id: author, title: author};
    const authorsHTML = templates.authorLink(authorsHTMLData);
    // console.log(html);
    html = html + authorsHTML;
    if(!allAuthors.hasOwnProperty(author)) {
      allAuthors[author] = 1;
    } else {
      allAuthors[author]++;
    }
    authorsWrapper.insertAdjacentHTML('beforeend', html);
  }
  // console.log('allAuthors', allAuthors);
  const authorList = document.querySelector('.authors');
  const authorsParams = calculateTagsParams(allAuthors);
  //let allAuthorsHTML = '';
  const allAuthorsData = {authors: []};
  let authorLinkHTML = '';
  for (let author in allAuthors) {
    //authorLinkHTML = '<li><a href="#tag-' + author + '">' + author + ' ' + '(' + calculateTagClass(allAuthors[author], authorsParams) + ')' + '</a></li>' + ' ';
    // console.log('authorLinkHTML:', authorLinkHTML);
    allAuthorsData.authors.push({
      author: author,
      count: allAuthors[author],
    });
    //allAuthorsHTML += authorLinkHTML;
  }
  authorList.innerHTML = templates.authorCloudLink(allAuthorsData);
  // console.log(allAuthorsData);
}
generateAuthors();

function authorClickHandler(event) {
  // console.log('now!');
  event.preventDefault();
  const clickedElement = this;
  const href = clickedElement.getAttribute('href');
  const author = href.replace('#author-', '');
  // console.log(author);
  const activeAuthors = document.querySelectorAll('a.active[href^="#author-"]');
  // console.log(activeAuthors);
  for (let activeAuthor of activeAuthors) {
    activeAuthor.classList.remove('active');
  }
  const hrefAuthorLinks = document.querySelectorAll('a[href="' + href + '"]');
  for (let hrefAuthorLink of hrefAuthorLinks) {
    hrefAuthorLink.classList.add('active');
  }
  generateTitleLinks('[data-author="' + author + '"]');
}

function addClickListenersToAuthors() {
  const authorTags = document.querySelectorAll('a[href^="#author-"]');
  // console.log(authorTags);

  for (let authorTag of authorTags) {
    authorTag.addEventListener('click', authorClickHandler);
  }
}
addClickListenersToAuthors();
