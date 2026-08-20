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

  function setMediaTabVisible(hasPosts) {
    $list.closest(".accordion-tab").attr("hidden", hasPosts ? null : true);
  }

  // Empty shell must not show — hide until posts actually arrive.
  setMediaTabVisible(false);

  const catename = $(".catename").first().text().trim();
  if (!catename) {
    return;
  }

  function graphqlquery(tag) {
    const query = `
      query BlogByTag($tags: [String!]) {
        site {
          content {
            blog {
              posts(first: 50, filters: { tags: $tags }) {
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
      data: JSON.stringify({
        query,
        variables: { tags: [tag] },
      }),
    });
  }

  function formatUTCDate(utcDate) {
    const localDate = new Date(utcDate);
    const options = { year: "numeric", month: "long", day: "numeric" };
    return localDate.toLocaleDateString(undefined, options);
  }

  function buildBlogPostHTML(post) {
    const utc = post.node.publishedDate.utc;
    const date = formatUTCDate(utc);
    const name = post.node.name;
    const summary = post.node.plainTextSummary || "";
    const url = post.node.path;
    const image =
      post?.node?.thumbnailImage?.urlOriginal ||
      "https://cdn11.bigcommerce.com/s-4rbj5oww8j/images/stencil/original/image-manager/noimage.png";

    // Same stack as listing-card.html: figure → time → h4 → optional p.
    // 2.5 — In the media: no Read Now. Restore:
    // <div class="read-btn"><div class="read-sub-btn"><a class="button button--primary or-btn or-btn-block" href="URL" aria-label="NAME read now">read now</a></div></div>
    return `
    <article class="listing-card">
      <a href="${url}">
        <figure>
          <img src="${image}" alt="${name}" loading="lazy">
        </figure>
        <time datetime="${utc}">${date}</time>
        <h4>${name}</h4>
        ${summary ? `<p>${summary}</p>` : ""}
      </a>
    </article>
  `;
  }

  graphqlquery(catename)
    .done((response) => {
      const posts = response?.data?.site?.content?.blog?.posts?.edges;
      if (!posts || !posts.length) {
        setMediaTabVisible(false);
        return;
      }
      let htmlContent = "";
      posts.forEach((post) => {
        htmlContent += buildBlogPostHTML(post);
      });
      $list.html(htmlContent);
      setMediaTabVisible(true);
    })
    .fail(() => {
      setMediaTabVisible(false);
    });
});
