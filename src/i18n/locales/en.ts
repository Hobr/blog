export const en = {
    brand: {
        name: "Hobr.Site",
        switcherLabel: "Language",
        themeLabel: "Theme",
    },
    nav: {
        home: "Home",
        blog: "Blog",
        archive: "Archive",
        contact: "Contact",
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
    home: {
        metaTitle: "Hobr.Site | Homepage",
        profileSubtitle: "whoami && cat ~/profile.txt",
        sitesSubtitle: "ls ~/sites && open ~/sites/<target>",
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
    archive: {
        metaTitle: "Hobr.Site | Archive",
        panelSubtitle:
            "find ~/posts -type f | xargs stat -c %y | cut -d- -f1,2 | sort -ur",
    },
    contact: {
        metaTitle: "Hobr.Site | Contact",
        imSubtitle: "ls ~/contact/im && open ~/contact/im/<target>",
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
        previous: "Previous",
        next: "Next",
        startOfLog: "Start of the log",
        latestEntry: "Latest entry reached",
    },
} as const;
