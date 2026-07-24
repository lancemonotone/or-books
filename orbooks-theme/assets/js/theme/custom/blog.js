import $ from 'jquery';

// import { Fancybox } from "@fancyapps/ui";
// import "@fancyapps/ui/dist/fancybox/fancybox.css";

export default (function (context) {
  var productIdname = $(".pr_name").first().text();
var catename = $(".catename").first().text();
console.log("Product ID Name:", productIdname);

function graphqlquery(catename) {
  var query = `
    query paginateProducts {
      site {
        content {
          blog {
            posts(
              after: ""
              filters: { tags: "${catename}" }
            ) {
              edges {
                node {
                  name
                  publishedDate {
                    utc
                  }
                  plainTextSummary
                  path
                  thumbnailImage {
                urlOriginal
              }
                }
              }
            }
          }
        }
      }
    }
  `;

  return $.ajax({
    url: "/graphql",
    contentType: "application/json",
    type: 'POST',
    headers: {
      'Authorization': 'Bearer ' + context.bearerToken
    },
    data: JSON.stringify({ query: query }),
    success: function (response) {
      console.log("GraphQL query successful:", response);
    },
    error: function (error) {
      console.error("Error making GraphQL query:", error);
    }
  });
}

function formatUTCDate(utcDate) {
  var localDate = new Date(utcDate);
  var options = { year: 'numeric', month: 'long', day: 'numeric' };
  return localDate.toLocaleDateString(undefined, options);
}

function buildBlogPostHTML(post) {
  var date = formatUTCDate(post.node.publishedDate.utc);
  var name = post.node.name;
  var summary = post.node.plainTextSummary;
  var url = post.node.path;
  var image = post?.node?.thumbnailImage?.urlOriginal || `https://cdn11.bigcommerce.com/s-4rbj5oww8j/images/stencil/original/image-manager/noimage.png`;

  const blogPostHtml = `
    <article class="blog">
      <div class="blog-post-figure">
        <figure class="blog-thumbnail">
          <a href="${url}">
            <img src="${image}" alt="${name}" data-sizes="auto" srcset="${image}" class="lazyautosizes ls-is-cached lazyloaded" sizes="249px">
          </a>
        </figure>
      </div>
      <div class="read-btn">
        <div class="read-sub-btn">
          <a class="button button--primary read-btn-link" href="${url}" aria-label="${name} read now">read now</a>
        </div>
      </div>
      <div class="blog-post-body with-img">
        <header class="blog-header">
          <div class="blog-date">${date}</div>
          <h2 class="blog-title">
            <a href="${url}">${name}</a>
          </h2>
        </header>
        <div class="blog-post">
          ${summary}
        </div>
      </div>
      <div class="blog-share"></div>
    </article>
  `;

  return blogPostHtml;
}

// Execute the GraphQL query and handle the response
graphqlquery(catename).done(function(response) {
  var posts = response.data.site.content.blog.posts.edges;
  var htmlContent = '';

  posts.forEach(function(post) {
    htmlContent += buildBlogPostHTML(post);
  });

  // Inject the built HTML content into the target container
  $(".custom-blog-list").html(htmlContent);
}).fail(function(error) {
  console.error("GraphQL query failed:", error);
});
});
