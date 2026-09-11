export const zhCN = {
    brand: {
        name: "Hobr.Site",
        switcherLabel: "语言",
        themeLabel: "主题",
    },
    nav: {
        home: "首页",
        blog: "博客",
        archive: "归档",
        contact: "联系",
    },
    common: {
        noPosts: "暂无文章",
        tagsLabel: "标签",
    },
    error: {
        metaTitle: "Hobr.Site | 页面未找到",
        command: "cd /requested/path && ls",
        title: "页面未找到",
        message: "啊嘞, 怎么回事呢",
        homeAction: "返回首页",
    },
    home: {
        metaTitle: "Hobr.Site | 首页",
        profileSubtitle: "whoami && cat ~/个人资料.txt",
        sitesSubtitle: "ls ~/页面 && open ~/页面/<目标>",
        latestSubtitle: "tail -n 5 ~/博客.log",
        viewAll: "ls ~/博客",
    },
    blogIndex: {
        metaTitle: "Hobr.Site | 博客",
        listSubtitle: "ls -lt ~/博客",
        navSubtitle: "ls ~/导航 && open ~/导航/<目标>",
        openArchive: "./archive",
        openTag: (tag: string) => `./tags/${tag}`,
    },
    archive: {
        metaTitle: "Hobr.Site | 归档",
        panelSubtitle:
            "find ~/博客 -type f | xargs stat -c %y | cut -d- -f1,2 | sort -ur",
    },
    contact: {
        metaTitle: "Hobr.Site | 联系",
        imSubtitle: "ls ~/联系/即时通讯 && open ~/联系/即时通讯/<方式>",
        socialSubtitle: "ls ~/联系/社交媒体 && open ~/联系/社交媒体/<平台>",
    },
    tagPage: {
        metaTitle: (tag: string) => `Hobr.Site | #${tag}`,
        panelSubtitle: (tag: string) => `grep -r ${tag} ~/博客`,
        empty: "这个标签下还没有文章",
    },
    articlePage: {
        metaTitle: (title: string) => `Hobr.Site | ${title}`,
        previous: "上一篇",
        next: "下一篇",
        startOfLog: "这是最早的一篇",
        latestEntry: "已经到达最新一篇",
    },
} as const;
