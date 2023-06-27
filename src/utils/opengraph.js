const TwitterCardSize = {
  small: 'summary',
  large: 'summary_large_image'
};

const staticMetadata = {
  home: {
    title: "Hi, I'm Gustavo Gallegos. A web developer in Los Angeles.",
    description:
      "I'm a web developer (React, NextJS, Javascript, GraphQL, HTML and CSS) living in in Los Angeles. See my portfolio and contact information",
    url: 'https://gustavo.is',
    openGraph: {
      title: "Hi, I'm Gustavo Gallegos and this is my dev portfolio",
      description:
        "I'm a web developer in Los Angeles. See a collection of previous projects, lessons learned and my contact information. Cheers!",
      siteName: "Gustavo Gallegos' Dev Portfolio"
    }
  },
  ponder: {
    title: 'A look back at building Ponder, a group blogging platform.',
    description:
      'We recently had to sunset Ponder, Check out what it was, the technologies used, and the lessons I learned building it.',
    url: 'https://gustavo.is/remembering/ponder',
    openGraph: {
      title: 'Looking back at Ponder, a group blogging platform',
      siteName: "Gustavo Gallegos' Dev Portfolio"
    }
  },
  ponderBlogs: {
    title: 'A retrospective of things I learned building Ponder Blogs',
    description:
      'After sunsetting Ponder Blogs, I spent some time reflecting on the lessons I learned building it.',
    url: 'https://gustavo.is/remembering/ponder-blogs',
    openGraph: {
      title: 'A look back at Ponder Blogs',
      siteName: "Gustavo Gallegos' Dev Portfolio"
    }
  },
  resume: {
    title: "Hi there! I'm Gustavo Gallegos. This is my resume.",
    description:
      "I'm a web developer in Los Angeles, CA and I'm looking for my tribe. This is my resume.",
    twitter: {
      card: TwitterCardSize.small
    }
  }
};

export const buildStaticMetadata = (pageName) => ({
  title: staticMetadata[pageName].title,
  description: staticMetadata[pageName].description,
  url: staticMetadata[pageName].url,
  openGraph: {
    title:
      staticMetadata[pageName].openGraph.title ||
      staticMetadata[pageName].title,
    description:
      staticMetadata[pageName].openGraph.description ||
      staticMetadata[pageName].description,
    url: staticMetadata[pageName].url,
    siteName:
      staticMetadata[pageName].openGraph.siteName ||
      staticMetadata[pageName].siteName,
    type: 'website'
  },
  twitter: {
    card: staticMetadata[pageName].twitter?.card || TwitterCardSize.large,
    title:
      staticMetadata[pageName].twitter?.title ||
      staticMetadata[pageName].openGraph.title ||
      staticMetadata[pageName].title,
    description:
      staticMetadata[pageName].twitter?.description ||
      staticMetadata[pageName].openGraph.description ||
      staticMetadata[pageName].description,
    siteName:
      staticMetadata[pageName].twitter?.siteName ||
      staticMetadata[pageName].openGraph.siteName ||
      staticMetadata[pageName].siteName,
    url: staticMetadata[pageName].url,
    creator: '@pricklywiggles'
  }
});
