import $ from "jquery";

/**
 * PDP / author “in the media” — GraphQL cards into `.custom-blog-list`.
 * Markup aligned with Latest News `components/blog/post.html` (+ summary kept).
 */
export default (function (context) {
  const $list = $(".custom-blog-list");
  if (!$list.length) {
    return;
  }

  const catename = $(".catename").first().text().trim();
  if (!catename) {
    return;
  }

  function graphqlquery(tag) {
    const query = `
      query paginateProducts {
        site {
          content {
            blog {
              posts(
                after: ""
                filters: { tags: "${tag}" }
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
      type: "POST",
      headers: {
        Authorization: `Bearer ${context.bearerToken}`,
      },
      data: JSON.stringify({ query }),
    });
  }

  function formatUTCDate(utcDate) {
    const localDate = new Date(utcDate);
    const options = { year: "numeric", month: "long", day: "numeric" };
    return localDate.toLocaleDateString(undefined, options);
  }

  function buildBlogPostHTML(post) {
    const date = formatUTCDate(post.node.publishedDate.utc);
    const name = post.node.name;
    const summary = post.node.plainTextSummary || "";
    const url = post.node.path;
    const image =
      post?.node?.thumbnailImage?.urlOriginal ||
      "https://cdn11.bigcommerce.com/s-4rbj5oww8j/images/stencil/original/image-manager/noimage.png";

    // Summary kept (JS media cards). Title h4 + in-flow or-btn match Latest News.
    return `
    <article class="blog">
      <div class="blog-post-figure">
        <figure class="blog-thumbnail">
          <a href="${url}">
            <img src="${image}" alt="${name}" loading="lazy">
          </a>
        </figure>
      </div>
      <div class="blog-post-body with-img">
        <header class="blog-header">
          <p class="blog-date">${date}</p>  
          <h4 class="blog-title">
            <a href="${url}">${name}</a>
          </h4>
        </header>
        <div class="blog-post">
          ${summary}
        </div>
      </div>
      <div class="read-btn">
        <div class="read-sub-btn">
          <a class="button button--primary or-btn or-btn-block" href="${url}" aria-label="${name} read now">read now</a>
        </div>
      </div>
      <div class="blog-share"></div>
    </article>
  `;
  }

  graphqlquery(catename)
    .done((response) => {
      const posts = response?.data?.site?.content?.blog?.posts?.edges;
      if (!posts || !posts.length) {
        return;
      }
      let htmlContent = "";
      posts.forEach((post) => {
        htmlContent += buildBlogPostHTML(post);
      });
      $list.html(htmlContent);
    })
    .fail(() => {
      // Fail fast: leave empty list; no invented posts
    });
});
