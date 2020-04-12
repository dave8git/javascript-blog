'use strict';

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
  optArticleAuthorSelector = '.post-author'; 

function generateTitleLinks(customSelector = '') {
  const titleList = document.querySelector(optTitleListSelector); // remove contents of titleList
  titleList.innerHTML = '';
  const articles = document.querySelectorAll(optArticleSelector  + customSelector);
  console.log(customSelector);
  let linkHTML = ''; 
  for (let article of articles) { // for each article
    const articleId = article.getAttribute('id'); // get the article id 
    const articleTitle = article.querySelector(optTitleSelector).innerHTML; // find the title element // get the title from the titile element 
    linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>'; // create HTML of the link 
    titleList.insertAdjacentHTML('beforeend', linkHTML);
  }
  console.log(linkHTML);
  const links = document.querySelectorAll('.titles a'); //find all links in element with class titles and add event listener click to all of them
  for (let link of links) {
    link.addEventListener('click', titleClickHandler);
  }
}
generateTitleLinks();

function generateTags() {
  const articles = document.querySelectorAll(optArticleSelector);// find all articles
  for (let article of articles) {// START LOOP: for every article: 
    console.log(article);
    const tagsWrapper = article.querySelector(optArticleTagsSelector); // find tags wrapper 
    let html = '';  // make html variable with empty string 
    const tags = article.getAttribute('data-tags'); // get tags from data-tags attribute 
    const splitTags = tags.split(' '); // split tags into array 
    for (let splitTag of splitTags) { // START LOOP: for each tag 
      let htmlLink = '<li><a href="#tag-' + splitTag + '">' + splitTag + '</a></li>' + ' '; // generate HTML of the link 
      html += htmlLink; // add generated code to html variable 
    } // END LOOP: for each tag  
    tagsWrapper.insertAdjacentHTML('beforeend', html); //insert HTML of all the links into the tags wrapper 
  }// END LOOP: for every article
}
generateTags(); 

function tagClickHandler(event) {
  event.preventDefault(); // prevent default action for this event
  const clickedElement = this; // make new constant named "clickedElement" and give it the value of "this"
  const href = clickedElement.getAttribute('href'); // make a new constant "href" and read the attribute "href" of the clicked element 
  const tag = href.replace('#tag-',''); // make a new constant "tag" and extract tag from the "href" constant 
  console.log(tag);
  const activeTags = document.querySelectorAll('a.active[href^="#tag-"]'); // find all tag links with class active 
  console.log(activeTags);
  for (let activeTag of activeTags) {// START LOOP: for each active tag link 
    activeTag.classList.remove('active');// remove class active 
  }// END LOOP: for each actie tag link 
  const hrefTagLinks = document.querySelectorAll('a[href="' + href + '"]'); // find all tag links with "href" attribute equal to the "href" constant constant */
  for (let hrefTagLink of hrefTagLinks) { // START LOOP: for each found tag link 
    hrefTagLink.classList.add('active');// add class active 
  }// END LOOP: for each found tag link 
  generateTitleLinks('[data-tags~="' + tag + '"]'); // execute function "generateTitleLinks" with article selector as argument  
}

function addClickListenersToTags() {
  const linksTags = document.querySelectorAll('a[href^="#tag-"]');// find all links to tags 
  for (let linkTag of linksTags) { // START LOOP: for each link 
    linkTag.addEventListener('click', tagClickHandler); // add tagClickHandler as event listener for that link 
  }// END LOOP: for each link 
}
addClickListenersToTags(); 

function generateAuthors() {
  const articles = document.querySelectorAll(optArticleSelector);
  for (let article of articles) {
    const authorsWrapper = article.querySelector(optArticleAuthorSelector);
    let html = ''; 
    const author = article.getAttribute('data-author'); 
    html = '<a href="#author-' + author +  '">' + author + '</a>';
    console.log(html);
    authorsWrapper.insertAdjacentHTML('beforeend', html);
  }
}
generateAuthors();

function authorClickHandler(event) {
  console.log('now!'); 
  event.preventDefault(); 
  const clickedElement = this;
  const href = clickedElement.getAttribute('href'); 
  const author = href.replace('#author-',''); 
  console.log(author); 
  const activeAuthors = document.querySelectorAll('a.active[href^="#author-"]'); 
  console.log(activeAuthors); 
  for (let activeAuthor of activeAuthors) {
    activeAuthor.classList.remove('active'); 
  }
  const hrefAuthorLinks = document.querySelectorAll('a[href="' + href + '"]'); 
  for (let hrefAuthorLink of hrefAuthorLinks) {
    hrefAuthorLink.classList.add('active');
  }
  generateTitleLinks('[data-author="' + author + '"]');
}
function  addClickListenersToAuthors() {
  const authorTags = document.querySelectorAll('a[href^="#author-"]');
  for (let authorTag of authorTags) {
    authorTag.addEventListener('click', authorClickHandler);
  }
}
addClickListenersToAuthors();
