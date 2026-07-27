Suggestion insertedYou have one new message.

Skip to content
Using Gmail with screen readers

4 of 31,597
Urgent Help needed
Inbox
Summarize this email

Antara Ghosh
5:32 AM (11 hours ago)
to me, Colin

Hi Rus,

This is something that has come up out of the blue: Monotype Foundry has contacted us saying that they have detected Helvetica usage on our website and we need to buy a license for it. The pricing is exorbitant and we definitely cannot afford it. I did some research and what I understand is that if the font is not embedded on our website, we can get away with it, but it seems like it is actually embedded on our website.

Could you please confirm this for us? Also, in your experience, if you have any advice on how to handle this, we'd really appreciate it. We'd really prefer to not have to pay this fee. However, we have used Helvetica as our brand font for a while now and would ideally like to continue doing so.

Based on what ChatGPT tells me, if we can use Helvetica as a 'font stack' with fallback font options, we can get away with this. Would you be able to do this modification for us? We would obviously compensate you for your time.

Thank you in advance!
Antara

## --

Antara Ghosh
Production and Design Director

OR Books
ALTERNATIVE PUBLISHING
www.orbooks.com
Join our mailing list for latest OR news and special offers

Rus Miller <lancemonotone@gmail.com>
9:06 AM (8 hours ago)
to Antara, Colin

Hi Antara,

I confirmed that the site is indeed currently serving several Helvetica font files (Regular, Medium, Bold, Condensed, and Helvetica Neue) directly from the site's assets. This is considered embedding the fonts, which requires a webfont license and is what Monotype detected.

The good news - as you mentioned above - is that we can remove those embedded fonts and instead use a standard system font stack, such as Helvetica, Arial, sans-serif.

This approach doesn't distribute the Helvetica font itself. Instead, each visitor's browser uses Helvetica only if it's already installed on their device. On Apple devices (Mac, iPhone, and iPad), Helvetica is included with the operating system, so those users will continue to see the brand font. On Windows and most Android devices, Helvetica isn't installed, so the browser will automatically fall back to Arial or another similar sans-serif font. In practice, the visual differences are fairly minor, and many websites use this approach rather than licensing and serving Helvetica as a webfont.

The one exception is the condensed version of Helvetica that's currently used for headings. Because there isn't a widely available system version of Helvetica Condensed, we'll need to replace it with a comparable free condensed font. Here are a few good options you can preview:

Roboto Condensed – https://fonts.google.com/specimen/Roboto+Condensed
IBM Plex Sans Condensed – https://fonts.google.com/specimen/IBM+Plex+Sans+Condensed
Archivo Narrow – https://fonts.google.com/specimen/Archivo+Narrow
Oswald – https://fonts.google.com/specimen/Oswald

Once you've had a chance to look at those options, let me know which you prefer and I can update the site accordingly. I'll also audit the rest of the theme to make sure all embedded Helvetica font files have been removed so there are no remaining licensing concerns.

Rus

---

This screenshot of the network activity shows the Helvetica font files are being served by the site and downloaded by my browser:

image.png

This style block in the theme markup is the source:

image.png

These are a couple of examples from the homepage:
image.png

image.png

Antara Ghosh
1:10 PM (4 hours ago)
to me

Hi Rus,

Thank you so much for doing this at such short notice! Really appreciate it.

I think Archivo Narrow or Roboto Condensed are both good replacements for the condensed headers. For the main font, is it possible to use Roboto condensed or Archivo Narrow as the fallback font instead of Arial?

## --

Antara Ghosh
Production and Design Director

OR Books
ALTERNATIVE PUBLISHING
www.orbooks.com
Join our mailing list for latest OR news and special offers

Rus Miller <lancemonotone@gmail.com>
3:23 PM (1 hour ago)
to Antara

Hi Antara,

Yep, we can use Archivo Narrow or Roboto Condensed as the fallback font instead of Arial.

I'll proceed with removing all embedded Helvetica files and implementing the system stack for the main font.

I do have a couple of questions about the BigCommerce interface.

Should I be seeing other pages in this dropdown? It just stays on 'Loading...'

image.png

Do you edit your theme files directly vs setting the styles in the config interface?

image.png

image.png

Rus

Antara Ghosh
4:09 PM (1 hour ago)
to me

Hi Rus,

All theme files need to be edited by going into Edit Theme Files. Some changes can be made via the 'Edit Storefront' panel. In case it is of any help, here is a document that the web developers who had built this website had given us with instructions for editing stuff on the website.

You should be seeing these pages as well:
image.png

You have access to edit theme files in our account but let me know in case you have issues doing so.

Best,
Antara

---

Antara Ghosh
(latest — retroactive licensing)

Also, on another front, the Monotype guys have asked us to pay them a fee for retroactive usage from 2024 January when this website was launched. Do you know if the company who designed this should have a license for the fonts they have used in the website?

---

## Draft reply to Antara (retroactive licensing — not sent)

Hi Antara,

On the retroactive fee: **I'm not a lawyer**, so take this as general background, not legal advice. Before you pay anything or reply to Monotype in a way that commits you, I'd get someone who handles IP or licensing to read their letter.

**Who Monotype usually goes after**

When font files are hosted on the site and downloaded by visitors' browsers (which is what the embedded Helvetica was doing), foundries usually contact whoever owns and runs the website. That's OR Books, even if the agency put the fonts in the theme.

**Whether the original designers should have had a license**

The original designers might have had a license, but there are different kinds:

- A **desktop or design license** covers mockups and internal work. It doesn't automatically let you serve the font to everyone who visits orbooks.com.
- A **webfont license** (often tied to your domain) is what you normally need when font files are hosted on the site and downloaded by browsers. That's the piece that was missing here.

So the build team should either have not embedded proprietary Helvetica files, or made sure you had the right webfont license for orbooks.com before launch. A lot of agencies don't check that. It doesn't automatically mean Monotype goes after them instead of you, but it might matter under your contract with them.

**What I'd do**

1. **Don't pay or admit fault over email** until someone qualified has read Monotype's letter. These are often negotiable, especially once the fonts are off the site.

2. **Dig up your contract or statement of work** with whoever built the site. See if it says anything about fonts, licensed assets, or who's responsible if something like this comes up.

3. **Ask the original developers in writing** whether they bought a webfont license for orbooks.com, who added the Helvetica files, and what they thought the licensing situation was at launch.

4. **Hang on to a record of the fix.** We've documented that the theme was serving Helvetica files, and the updated theme removes them so the site won't distribute those files after deploy. That helps if you need to show Monotype you've fixed it. It doesn't wipe out past use, which is what they're asking retroactive fees for.

5. **Get a short legal consult** before you respond to Monotype. They can tell you what's normal, what's worth pushing back on, and whether you have any leverage with the original builders.

I'm happy to put together technical notes for your lawyer or Monotype (what was embedded, when we removed it, how the site works now) if that would help.

Rus
