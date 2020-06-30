$(document).ready(function() {

    var articleContainer = $(".article-container");
    $(document).on("click", ".scrape", handleArticleScrape);
  
    function initPage() {
      $.get("/api/headlines/").then(function(data) {
        articleContainer.empty();
        console.log(data);
        if (data && data.length) {
          console.log("Rendered articles");
          renderArticles(data);
        } else {
          console.log("Rendered empty.");
          renderEmpty();
        }
      });
    }
  
    function renderArticles(articles) {
      var articleCards = [];
      for (var i = 0; i < articles.length; i++) {
        articleCards.push(createCard(articles[i]));
      }
      articleContainer.append(articleCards);
    }
  
    function createCard(article) {
      var card = $("<div class='card'>");
      var cardHeader = $("<div class='card-header bg-dark'>").append(
        $("<h3>").append(
          $("<a class='article-link' target='_blank' rel='noopener noreferrer'>")
            .attr("href", article.link)
            .text(article.headline)
        )
      );
  
      var cardBody = $("<div class='card-body'>").text(article.description);
  
      card.append(cardHeader, cardBody);
      card.data("_id", article._id);
      return card;
    }
  
    function renderEmpty() {
      articleContainer.append(
          "<div class='alert alert-warning text-center'>" +
          "<h4>Uh Oh. Looks like we don't have any new articles.</h4>"+
          "</div>"+
          "<div class='card'>"+
          "<div class='card-header text-center'>"+
          "<h3>What Would You Like To Do?</h3>"+
          "</div>"+
          "<div class='card-body text-center'>"+
          "<h4><a class='scrape-new'>Try Scraping New Articles</a></h4>"+
          "<h4><a href='/saved'>Go to Saved Articles</a></h4>"+
          "</div>"+
          "</div>"
        );
    }
  
    function handleArticleScrape() {
      $.get("/api/scrape/").then(function() {
        setTimeout(initPage,500);
      });
    }

  });