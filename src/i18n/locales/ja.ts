export const ja = {
    brand: {
        name: "Hobr.Site",
        switcherLabel: "言語",
        themeLabel: "テーマ",
    },
    nav: {
        home: "ホーム",
        blog: "ブログ",
        archive: "アーカイブ",
        contact: "連絡先",
    },
    common: {
        noPosts: "まだ記事はありません",
        tagsLabel: "タグ",
    },
    error: {
        metaTitle: "Hobr.Site | ページが見つかりません",
        command: "cd /requested/path && ls",
        title: "ページが見つかりません",
        message: "お探しのページは存在しないか、移動しました。",
        homeAction: "ホームへ戻る",
    },
    home: {
        metaTitle: "Hobr.Site | ポータル",
        profileSubtitle: "whoami && cat ~/個人情報.txt",
        sitesSubtitle: "ls ~/サイト && open ~/サイト/<ページ>",
        latestSubtitle: "tail -n 5 ~/記事.log",
        viewAll: "ls ~/記事",
    },
    blogIndex: {
        metaTitle: "Hobr.Site | ブログ",
        listSubtitle: "ls -lt ~/記事",
        navSubtitle: "ls ~/移動先 && open ~/移動先/<ページ>",
        openArchive: "./archive",
        openTag: (tag: string) => `./tags/${tag}`,
    },
    archive: {
        metaTitle: "Hobr.Site | アーカイブ",
        panelSubtitle:
            "find ~/記事 -type f | xargs stat -c %y | cut -d- -f1,2 | sort -ur",
    },
    contact: {
        metaTitle: "Hobr.Site | 連絡先",
        imSubtitle:
            "ls ~/連絡先/インスタントメッセージ && open ~/連絡先/インスタントメッセージ/<方法>",
        socialSubtitle:
            "ls ~/連絡先/ソーシャルメディア && open ~/連絡先/ソーシャルメディア/<サービス>",
    },
    tagPage: {
        metaTitle: (tag: string) => `Hobr.Site | #${tag}`,
        panelSubtitle: (tag: string) => `grep -r ${tag} ~/記事`,
        empty: "このタグの記事はまだありません",
    },
    articlePage: {
        metaTitle: (title: string) => `Hobr.Site | ${title}`,
        previous: "前へ",
        next: "次へ",
        startOfLog: "これが最初の記事です",
        latestEntry: "最新の記事に到達しました",
    },
} as const;
