export const en = {
  brand: {
    name: "Hobr.Site",
    switcherLabel: "Language",
    themeLabel: "Theme",
  },
  nav: {
    home: "Home",
    blog: "Blog",
    tags: "Tags",
    archive: "Archive",
    friends: "Friends",
  },
  common: {
    noPosts: "No posts published yet",
    tagsLabel: "Tags",
  },
  error: {
    metaTitle: "Hobr.Site | Page Not Found",
    command: "cd /requested/path && ls",
    title: "Page not found",
    message: "What happened???",
    homeAction: "Return home",
  },
  serverError: {
    metaTitle: "Hobr.Site | Internal Server Error",
    title: "Internal server error",
    message:
      "The server encountered an unexpected error. Please try again later.",
  },
  home: {
    metaTitle: "Hobr.Site | Homepage",
    profileSubtitle: "whoami && cat ~/profile.txt",
    latestSubtitle: "tail -n 5 ~/posts.log",
    viewAll: "ls ~/posts",
  },
  blogIndex: {
    metaTitle: "Hobr.Site | Blog",
    listSubtitle: "ls -lt ~/posts",
    navSubtitle: "ls ~/browse && open ~/browse/<target>",
    openArchive: "./archive",
    openTag: (tag: string) => `./tags/${tag}`,
  },
  tagsPage: {
    metaTitle: "Hobr.Site | Tags",
    title: "All tags",
    panelSubtitle: "find ~/posts -type f | xargs grep '^tags:' | sort -u",
  },
  archive: {
    metaTitle: "Hobr.Site | Archive",
    panelSubtitle:
      "find ~/posts -type f | xargs stat -c %y | cut -d- -f1,2 | sort -ur",
  },
  friendsPage: {
    metaTitle: "Hobr.Site | Friends",
    panelSubtitle: "cat ~/links/friends.txt",
    empty: "Friend links are being collected",
  },
  contact: {
    imSubtitle: "ls ~/contact/im && open ~/contact/im/<target>",
    developmentSubtitle: "ls ~/development && open ~/development/<platform>",
    socialSubtitle:
      "ls ~/contact/social-media && open ~/contact/social-media/<target>",
  },
  tagPage: {
    metaTitle: (tag: string) => `Hobr.Site | #${tag}`,
    panelSubtitle: (tag: string) => `grep -r ${tag} ~/posts`,
    empty: "No posts found for this tag",
  },
  articlePage: {
    metaTitle: (title: string) => `Hobr.Site | ${title}`,
    tableOfContents: "TOC",
    comments: "Comments",
    previous: "Previous",
    next: "Next",
    startOfLog: "Start of the log",
    latestEntry: "Latest entry reached",
  },
} as const;
