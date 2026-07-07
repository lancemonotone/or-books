# Client decisions needed

Items that block implementation or require editorial/business input before dev work proceeds.

---

## 1. Carousel control style — **blocks task 2.9**

**Question for client:** Which slider navigation do you prefer site-wide?

| Option | Where it appears today | Screenshots |
|--------|------------------------|-------------|
| **Dots** (pagination indicators) | Homepage product carousels | `120911` |
| **Arrows** (circular black buttons, white chevrons) | About video slider, Featured Author, also mixed on homepage | `123850`, `125607`, `120911` |

**Recommendation for the conversation:** Show side-by-side crops from `120911` (dots) and `123850` (arrows) on mobile. Pick one — mixing both on the homepage reads as unfinished.

**User note:** `123850` is another arrow-style slider; client preference should drive 2.9, not developer guesswork.

---

## 2. Rights Catalogs placeholder content

`/rights-catalogs` is entirely Lorem Ipsum (`125507`). Confirm whether page should be hidden, populated, or removed from nav until ready.

---

## 3. Mailchimp bookseller signup — **blocks task 2.15**

Bookseller mailing list uses external Mailchimp hosted form (`125535` — URL `*.list-manage.com`).

**Question for client:** How should the bookseller mailing list signup work?

| Option | Dev path | Best when |
|--------|----------|-----------|
| **A. Embed** | Paste Mailchimp embedded form HTML on a BC web page; theme CSS overrides | Fastest on-brand fix; OK with some MC markup |
| **B. Custom BC form** | Theme form POSTs to Mailchimp `action` URL + merge tags (Store, Contact name, Website) | Full visual control; more dev |
| **C. Keep hosted** | No change; link out to `list-manage.com` | No budget; accept off-site UX |

**Options comparison:**

| Approach | Pros | Cons |
|----------|------|------|
| **Keep hosted form** (current) | Zero dev; MC maintains fields | Leaves site; MC default styles; typography bugs (small email link) |
| **Embed MC form on a BC page** | Same audience/fields; user stays on `orbooks.com` URL | MC embed HTML; style overrides needed; may still load MC assets |
| **Custom BC page + MC form action** | Full theme typography; posts to same Mailchimp audience via form `action` URL + merge tags | Dev effort; must map Store, Contact name, Website to MC merge fields |
| **BC Mailchimp app only** | Official integration; customer/order sync | **Does not replace this form** — app syncs store customers, not custom bookseller fields |

**Recommendation:** Option A or B — user stays on `orbooks.com`, Mailchimp still receives signups. The official BC Mailchimp app handles **customer/order sync** separately; it does not replace this form.

**Roadmap:** [Task 2.15](../plan/roadmap.md) — implementation starts after client picks A, B, or C.

See also: [Mailchimp embedded forms](https://mailchimp.com/help/add-a-signup-form-to-your-website/), [Mailchimp for BigCommerce](https://mailchimp.com/help/connect-or-disconnect-mailchimp-for-bigcommerce/).

---

## 4. Email display policy

Dev recommendation: all emails as `mailto:` links with `@` everywhere (task 1.4). Confirm client is OK dropping `[at]` anti-spam obfuscation — or use a single consistent pattern if spam harvest is still a concern.

**Evidence:** Same Booksellers page shows both `orders [at] orbooks.com` and `rights@orbooks.com` (`125307`).
