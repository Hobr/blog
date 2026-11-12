---
date: "2024-04-28"
tags:
  - 逆向
---

# Geetest3代点字验证逆向-w值的计算

## 流程

1. 获取源平台 _gt_ 值, 这个值一般是固定的, 获取一次即可, 不重要
2. 获取流水号challenge, 这个challenge对应本次的验证会话, 从源平台接口获取, 不重要
3. 获取验证资源, 接口为 _api.geetest.com/gettype.php_ 参数为 _gt_ 和 _callback_, callback值为 _geetest__ 加上13位毫秒级时间戳
   - 返回值包括无感验证(fullpage)\点字验证(click)的js文件, fullpage的混淆内容会时常改变, 这几个js文件是我们分析的重点
4. 第一次get.php 环境检测
   - 请求中需要 _w_, 下文称之为第一个w
   - 返回c, s
5. 第一次ajax.php 点击验证, 加载点字
   - 请求中需要 _w_, 下文称之为第二个w
   - 返回下次验证类型
6. 第二次get.php
   - 请求中没有w
   - 返回图片, c, s, gct
7. 第二次ajax.php 提交点字
   - 请求中需要 _w_, 下文称之为第三个w
   - 返回 _validate_ 校验
8. 源平台校验, 返回challenge和validate

## 注意

- 几次请求间错点时间
- 轨迹尽可能随机
- passtime `Math.floor((Math.random()*500) + 4000)`
- h9s9 在gct.js里 `function StJC(t)`
- tm都是性能数据, 自己造

## 逆向

由上文可见, 我们破解geetest的重点就是破解这3个 _w_

### 第一个w

直接定位到如下内容, 打上断点

```js
var e = t[$_CEEIK(1077)][$_CEEIK(1072)](); // 断点
((t[$_CEEJl(1157)] = e),
  (t[$_CEEJl(368)][$_CEEIK(1031)] = n[$_CEEIK(1031)]),
  (t[$_CEEJl(368)][$_CEEIK(1137)] = n[$_CEEIK(895)]),
  (t[$_CEEJl(368)][$_CEEIK(444)] = e));
var r = t[$_CEEJl(1133)](), // 断点
  o = $_BFD()[$_CEEJl(1119)](
    he[$_CEEJl(488)](t[$_CEEJl(368)]),
    t[$_CEEJl(1125)](),
  ), // 断点
  i = p[$_CEEIK(1190)](o), // 断点
  s = {
    // 断点
    gt: t[$_CEEIK(368)][$_CEEIK(359)],
    challenge: t[$_CEEIK(368)][$_CEEIK(322)],
    lang: n[$_CEEJl(231)],
    pt: t[$_CEEIK(1081)],
    client_type: t[$_CEEIK(1049)],
    w: i + r,
  };
```

可得 _w = i + r_, 现在需要得到 _i_ 和 _r_, 而 _i = p(o)_

#### i

开始运行看看断点, 观察重要量结果

```js
e="-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1"
aeskey = "c4fcce0b8f08d70e" = t["$_CCHI"]()

r = function $_CCGH() = "较长随机字符串"
o = $_BFD() ["encrypt1"](he["stringify"](t["$_EJY"]), t["$_CCHI"]()) = List(912)
i = p[$_CEEIK(1190)](o) = function $_HEv(o) = "超长字符串"

he["stringify"](t["$_EJY"]) = '{
      "gt": "ac597a4506fee079629df5d8b66dd4fe",
      "challenge": "bc122467f9a5933f3ad451b3e6b10d76",
      "offline": false,
      "new_captcha": true,
      "product": "popup",
      "width": "300px",
      "https": true,
      "protocol": "https://",
      "type": "fullpage",
      "static_servers": [
          "static.geetest.com/",
          "static.geevisit.com/"
      ],
      "beeline": "/static/js/beeline.1.0.1.js",
      "voice": "/static/js/voice.1.2.4.js",
      "click": "/static/js/click.3.1.0.js",
      "fullpage": "/static/js/fullpage.9.1.9-glhvqm.js",
      "slide": "/static/js/slide.7.9.2.js",
      "geetest": "/static/js/geetest.6.0.9.js",
      "aspect_radio": {
          "slide": 103,
          "click": 128,
          "voice": 128,
          "beeline": 50
      },
      "cc": 16,
      "ww": true,
      "i": "-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1"
    }'
```

步入 _aeskey/$\_BFD()_, 查查加密

```js
'encrypt': function (e, t, n, r) {
    r = this[$_EGI_(94)][$_EGJi(68)](r);
    var o = e[$_EGJi(84)](n, r),
    i = o[$_EGI_(42)](t), // 断点
    s = o[$_EGJi(94)]; // 断点
    return v[$_EGJi(36)]({ // 断点
      'ciphertext': i,
      'key': n,
      'iv': s[$_EGJi(93)], // 断点
      'algorithm': e,
      'mode': s[$_EGJi(59)], // 断点
      'padding': s[$_EGI_(24)], // 断点
      'blockSize': e[$_EGI_(54)], // 断点
      'formatter': r[$_EGI_(60)]
    });
}

// 重点
t = he["stringify" ](t["$_EJY"]) = '{......}'
aeskey = "c4fcce0b8f08d70e" // 前文
key = n = List(4) = [1680945718, 926114659, 929183028, 825516900]
iv = [808464432, 808464432, 808464432, 808464432]
ciphertext = i = Array(228)
blockSize = 4
mode网友总结为CBC
```

再跳到 _encrypt1_

```js
'encrypt1': function (e, t, n) {
    t = u[$_EBIa(67)](t), // 断点
    n &&
    n[$_EBIa(93)] ||
    ((n = n || {
    }) [$_EBIa(93)] = u[$_EBIa(67)]($_EBJV(74))); // 断点
    for (
      var r = m[$_EBJV(57)](c, e, t, n),
      o = r[$_EBIa(31)][$_EBJV(43)],
      i = r[$_EBIa(31)][$_EBJV(22)],
      s = [],
      a = 0;
      a < i;
      a++
    ) {
      var _ = o[a >>> 2] >>> 24 - a % 4 * 8 & 255;
      s[$_EBJV(79)](_);
    }
    return s; // 断点
}

// 信息
e = 数据
t = aeskey
$_EBIa(93) = "iv"
$_EBIa(67) = "parse"
$_EBJV(74) = "0000000000000000"
["iv"] = u["parse"]("0000000000000000") = [808464432, 808464432, 808464432, 808464432]
```

得出: _o_ 为 _字符串t_ 经过 _AES CBC加密_ 后的结果, _AES密钥_ 会变(其实有惊喜, 事后诸葛亮了), iv为 _0000000000000000_

`o(data: dict) = AES(o, key) -> List`

下面求外层算法, 已知 _i = function $\_HEv(o)_, 找到这个函数

```js
'$_HEv': function (e) {
    var $_JDAM = $_JCHM[0]; // 断点
    var t = this[$_JCIk(438)](e); // 断点
    return t[$_JCIk(434)] + t[$_JCJx(461)]; // 断点
},

// 查看
e = {
  "res": "bKh9qdo6hwG4O8N04bblKlkugH3LMRFRO18SL(jIF0CxvNVpkAzlcQ2aOzmWqrld7m0pmImymDEIBnkAcP1LifKuzWfp9Ckb8NfEOt0A1XyfNKMTmqphPIUJRyQMWFk342EutTEuA98heEbYkKOwcoW)jNoSPidkg692Qn3xHLjEly66zWWOfvx8ODKIji9VWk5Q4Ic9Av6j5((cce7R6bKxEThBD4mSOwOZsFhhp3dBo2lNpSjHT4)Kv(WJ98ZcFQglAi(F5t2WYWFqE7VGgUEUs3laWeVpozjdAUqSdzlXXMpEx7(5mwxmYMQa8Db9SP(v25o9h(nOU)velrbaUMWmBCAlGpe8YDySLmAjYTxmcMQJCaHcf6jyBN1QZm6fXDZOsvNN5c2RNH5YD9oftr(2rpg5HuJ901SOcKDzkRYiwiG6wzbt1KXmMEiQ2N5ptMhJXmMuPMQSNUzMD4qnTqVD)x6)QT2Cqph34ddGVkjxYeuFSeJCcoM5od3eyzcgBU2WobfAnnsKr5jUqeW11jjhDtlPq(d7q6EFFAVUf2h3G8Ir2grWeQ((bb9iLfyol5TPphe9Z1hMahJx10C4NlkbpYUoRUYD1d5EesBw5w2tRIHzLfYeqZVKUaYzU(vJCj3hveoWLo7hMJRdgQ5f)WuH0ZoEZrPWdUYNe24mIge3ARECcaukr8BNYOAf3)fDJloMTZu3ljTBiPRWqyBycVSY01byqZnKtjG0IGDW5WQ8APhONdBrVFX0OGlR(W7M5eNzUOhQbnmi1UTxGg0oMK5GRj)(bf0W0X4Qk1jnZ6KXYE8vu7qnjfJn99QMDwOVUhVcOADmYU6ZKrvwsMRvCX8XLuEMdw)yOnvwdA3v0HVpCd643zubtDb9liMXaARaWqT(IVq7btGTawku6bMD98o6FCbRIt6sljVnPd9b5M3SkVVdWAXbxEiKnr7huKrZs(g0cNFOAqdxkVUTQLAtUC4OGMITrZn16kI)VdsU0ZdthoT)TNcKbwMwmSDZ)jCavZyPKnobDbI8BJGqcLhwl4ZlDrcFzUbXjrEKB8W3hflep03WRT6B6c8CCFLrO8zpLyowXkOyRpP5rHx7ENPaJbnvWHvnTKqbsjulhk7uJDZGuBSDomUjXIaxk1p4kaqy9aBjXvV0ebQzvJPVouZh4Aw9xKfD2DNv8cyaG8RDxuVTfziU16Dssw7OcEBhcwMN",
  "end": ""
}
$_JCIk(434) = "res"
$_JCJx(461) = "end"
```

跳转到了`'$_HCR': function (e, o)`, 扒下整个p函数

```js
t = {
  "res": "超级长",
  "end": ""
}

t[$_JCIk(434)] = "超级长"
t[$_JCJx(461)] = ""

return = t[$_JCIk(434)] + t[$_JCJx(461)] = "超级长" = i
```

得出 _i_ 为`function $_HEv(o)`, 算法扒出来是

```js
p = {
  $_GJr: function (e) {
    var $_IJIW = __GCt.$_CI,
      $_IJHm = ["$_JABS"].concat($_IJIW),
      $_IJJY = $_IJHm[1];
    $_IJHm.shift();
    var $_JAAd = $_IJHm[0];
    var t = this[$_IJIW(409)];
    return e < 0 || e >= t[$_IJJY(1)] ? $_IJIW(86) : t[$_IJJY(476)](e);
  },

  $_HBX: function (e, t) {
    var $_JAIB = __GCt.$_CI,
      $_JAHw = ["$_JBBc"].concat($_JAIB),
      $_JAJY = $_JAHw[1];
    $_JAHw.shift();
    var $_JBAX = $_JAHw[0];
    return (e >> t) & 1;
  },

  $_HCR: function (e, o) {
    var $_JBD_ = __GCt.$_CI,
      $_JBCr = ["$_JBGu"].concat($_JBD_),
      $_JBEK = $_JBCr[1];
    $_JBCr.shift();
    var $_JBFF = $_JBCr[0];
    var i = this;
    o || (o = i);
    for (
      var t = function (e, t) {
          var $_JBIZ = __GCt.$_CI,
            $_JBHx = ["$_JCBj"].concat($_JBIZ),
            $_JBJI = $_JBHx[1];
          $_JBHx.shift();
          var $_JCAR = $_JBHx[0];
          for (var n = 0, r = o[$_JBJI(483)] - 1; 0 <= r; r -= 1)
            1 === i[$_JBIZ(499)](t, r) && (n = (n << 1) + i[$_JBJI(499)](e, r));
          return n;
        },
        n = $_JBD_(260),
        r = $_JBEK(260),
        s = e[$_JBEK(1)],
        a = 0;
      a < s;
      a += 3
    ) {
      var _;
      if (a + 2 < s)
        ((_ = (e[a] << 16) + (e[a + 1] << 8) + e[a + 2]),
          (n +=
            i[$_JBEK(414)](t(_, o[$_JBD_(463)])) +
            i[$_JBD_(414)](t(_, o[$_JBEK(404)])) +
            i[$_JBD_(414)](t(_, o[$_JBEK(457)])) +
            i[$_JBD_(414)](t(_, o[$_JBD_(447)]))));
      else {
        var c = s % 3;
        2 == c
          ? ((_ = (e[a] << 16) + (e[a + 1] << 8)),
            (n +=
              i[$_JBEK(414)](t(_, o[$_JBEK(463)])) +
              i[$_JBEK(414)](t(_, o[$_JBD_(404)])) +
              i[$_JBEK(414)](t(_, o[$_JBD_(457)]))),
            (r = o[$_JBD_(425)]))
          : 1 == c &&
            ((_ = e[a] << 16),
            (n +=
              i[$_JBD_(414)](t(_, o[$_JBD_(463)])) +
              i[$_JBEK(414)](t(_, o[$_JBD_(404)]))),
            (r = o[$_JBEK(425)] + o[$_JBD_(425)]));
      }
    }
    return {
      res: n,
      end: r,
    };
  },

  $_HEv: function (e) {
    var t = this["$_HCR"](e);
    return t["res"] + t["end"];
  },
};
```

手工提纯!

```js
var Enc = {
  $_GJr: function (e) {
    var t = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789()";
    // t["length"] = 64
    // t.charAt(e) = ")"
    // return ")"
    return e < 0 || e >= t["length"] ? "." : t.charAt(e);
  },

  $_HBX: function (e, t) {
    return (e >> t) & 1;
  },

  $_HCR: function (e, o) {
    var i = this;
    for (
      var t = function (e, t) {
          for (var n = 0, r = 23; 0 <= r; r -= 1)
            1 === i["$_HBX"](t, r) && (n = (n << 1) + i["$_HBX"](e, r));
          return n;
        },
        n = "",
        r = "",
        s = e["length"],
        a = 0;
      a < s;
      a += 3
    ) {
      var _;
      if (a + 2 < s) {
        ((_ = (e[a] << 16) + (e[a + 1] << 8) + e[a + 2]),
          (n +=
            i["$_GJr"](t(_, 7274496)) +
            i["$_GJr"](t(_, 9483264)) +
            i["$_GJr"](t(_, 19220)) +
            i["$_GJr"](t(_, 235))));
      } else {
        var c = s % 3;
        2 == c
          ? ((_ = (e[a] << 16) + (e[a + 1] << 8)),
            (n +=
              i["$_GJr"](t(_, 7274496)) +
              i["$_GJr"](t(_, 9483264)) +
              i["$_GJr"](t(_, 19220))),
            (r = "."))
          : 1 == c &&
            ((_ = e[a] << 16),
            (n += i["$_GJr"](t(_, 7274496)) + i["$_GJr"](t(_, 9483264))),
            (r = "." + "."));
      }
    }
    return { res: n, end: r };
  },

  $_HEv: function (e) {
    var t = this["$_HCR"](e);
    return t["res"] + t["end"];
  },
};
```

`i = Enc.'$_HEv'(o)`, 结束!

#### r

已知`r = function $_CCGH() = "较长随机字符串"`, 步入并删掉无用信息

```js
'$_CCGH': function (e) {
    var t = new X() [$_CGCJZ(57)](this[$_CGCIO(1125)](e)); // 断
    while (!t || 256 !== t[$_CGCIO(1)]) t = new X() [$_CGCIO(57)](this[$_CGCIO(1125)](!0)); // 断
    return t;
}

// 打断点, 获取重要信息
$_CGCJZ(57) = "encrypt"
this[$_CGCIO(1125)](e) = "14c6b3920c7e5b58"
this[$_CGCIO(1125)](!0) = "随机16位数"
t = "5dc3e9b8b543a28422fc0408f573d362971a2ceb26c68e53366378f0e408922bc185894f4b56e746df4c88ad9ff6cf32b8e60cd0f348953fd2a75b6372db48b5fcc647d6a60055be5bd22ced161dd9ec8a90d30cff364f36c6d241ba3ab46bf90eac775e91bb1154af390360048ecb2b641e95211f38a7a789fdb31281a30ce9"
```

这个16位数似曾相识! 重新回到前面断 _aeskey_, 我们惊奇的发现 _aeskey = 随机数_

```js
aeskey = 27fc7a03bf06227a
this[$_CGCIO(1125)](e) =27fc7a03bf06227a
```

也就是说r = 加密(aeskey), 至于是什么加密继续打下去

```js
case __GCt.$_DH() [8][11]:
  this[$_JJDd(531)]($_JJEM(521), $_JJEM(520)); // 断
  $_DDBJY = __GCt.$_DH() [4][10]; // 断

// 获取信息
$_JJDd(531) = "setPublic"
$_JJEM(521) = "00C1E3934D1614465B33053E7F48EE4EC87B14B95EF88947713D25EECBFF7E74C7977D02DC1D9451F79DD5D1C10C29ACB6A9B4D6FB7D0A0279B6719E1772565F09AF627715919221AEF91899CAE08C0D686D748B20A3603BE2318CA6BC2B59706592A9219D0BF05C9F65023A21D2330807252AE0066D59CEEFA5F2748EA80BAB81"
$_JJEM(520) = "10001"
```

可知他们分别为 _RSA公钥和模值_, 因此这个加密函数也就造出来了

但是还有一个坑: _AES Key是动态更新的!!!_, 所以我们还得挖一下AES Key是怎么来的, 我们回到最初获取到aeskey的 _$_CCHI_, 断点

```js
'$_CCHI': function (e) {
    return this[$_CGCDA(384)][$_CGCEc(1199)] &&
    !e ||
    (this[$_CGCDA(384)][$_CGCEc(1199)] = te()), //  断
    this[$_CGCDA(384)][$_CGCEc(1199)];
},

// 步入te
return function () {
    ....
    return e() + e() + e() + e(); // 断
};

// 找到e()
function e() {
    var $_DDDCX = __GCt.$_DH() [0][12];
    for (; $_DDDCX !== __GCt.$_DH() [4][11]; ) {
      switch ($_DDDCX) {
        case __GCt.$_DH() [8][12]:
          return (65536 * (1 + Math[$_BFBE_(267)]()) | 0) [$_BFBDb(16)](16) [$_BFBE_(642)](1);
          break;
      }
    }
}

$_BFBE_(267) = "random"
$_BFBDb(16) = "toString"
$_BFBE_(642) = "substring"

// 得到
function e() return (65536 * (1 + Math.random()) | 0).toString(16).substring(1);
```

最终我们知道了, 所谓aeskey就是四个e()相加! ~~不得不说太随意了~~

#### 总结

综上所述, 可得出以下内容

```python
AES_Key = GenerateKey() -> str
params = str(data -> dict)
o = AES(data = params -> str, key = AES_Key -> str) -> list
i = Enc(data = o -> list) -> str
r = RSA(data = AES_Key-> str) -> str
w = i + r
```

### 第二个w

定位ajax网络请求栈跟踪里第一个函数 _$_CDIZ_

```js
'$_CDIZ': function () {
  var t = this,
  e = t[$_CFCJr(384)];
  t[$_CFCJr(1177)]();
  var n = {};
  n[$_CFCII(359)] = e[$_CFCJr(359)],
  n[$_CFCJr(322)] = e[$_CFCJr(322)],
  n[$_CFCJr(231)] = e[$_CFCJr(231)] || $_CFCJr(261),
  n[$_CFCJr(387)] = t[$_CFCJr(1081)],
  n[$_CFCJr(1103)] = t[$_CFCJr(1049)],
  n[$_CFCII(843)] = t[$_CFCJr(1139)], // 断
  j(t[$_CFCII(384)], p[$_CFCJr(416)]($_CFCII(1114)), n) [$_CFCII(345)](
    function (e) {
      if (e[$_CFDEE(456)] === Xe) return G(F(e, t, $_CFDEE(1122)));
      t[$_CFDDl(1117)](e[$_CFDDl(822)]);
    },
    function () {
      return G(I($_CFDJF(1144), t));
    }
  );
},

// 发现
$_CFCJr(1177) = "$_CDJu"
$_CFCII(843) = "w"
$_CFCJr(1139) = "$_CEAR"
```

切入`'$_CDJu': function ()`, 既视感很强, 找到这个函数最后

```js
i[$_CFFId(1139)] = p[$_CFFId(1190)](c[$_CFFJp(57)](r, i[$_CFFJp(1125)]()));

//
$_CFFId(1139) = "$_CEAR";
$_CFFId(1190) = "$_HEv";
$_CFFJp(57) = "encrypt";
i[$_CFFJp(1125)]() = aeskey;
i["$_CEAR"] = P["$_HEv"]["encrypt"](r, asekey);
```

`i["$_CEAR"] = P["$_HEv"]["encrypt"](r,asekey)` 这就是我们的i的算法了, 先aes再js算法, 所以我们只需要关注r里的一些东西即可

```js
r = '{
        "lang": "zh-cn",
        "type": "fullpage",
        "tt": "M/?8Pjp8PjQA(U)*-b,5b-5bJ(5((c((Ib(b,)-(@h))DFDMUFE-0C*NTGcoYMjFj//BN7),*VhBj9/JRJCK*NZ-EXBJNl)))FBgM9FhBj//Ke9CV1(fMn((85b5b,(b(e5e(eq(/*(5-)1?-M-U7(Mb-1-w)*)(91E/(/)(*-)MjH(?,)(?-M3*M)M9(E5(/*()Mb(M/)M,p)p)(/W()M)M//(0p/(FNSLMDU_N55,*3GYY*,7X2)(9NNM2QF0MMC.(b1)(M?.)9H/d995I***A2(X(M195,*9A*(M1(((p(-",
        "light": "SPAN_0",
        "s": "c7c3e21112fe4f741921cb3e4ff9f7cb",
        "h": "321f9af1e098233dbd03f250fd2b5e21",
        "hh": "39bd9cad9e425c3a8f51610fd506e3b3",
        "hi": "09eb21b3ae9542a9bc1e8b63b3d9a467",
        "vip_order": -1,
        "ct": -1,
        "ep": {
            "v": "9.1.9-glhvqm",
            "te": false,
            "$_BCQ": true,
            "ven": "NVIDIA Corporation",
            "ren": "NVIDIA GeForce GTX 980, or similar",
            "fp": [ "move", 1020, 189, 1714498250771, "pointermove" ],
            "lp": [ "up", 1021, 381, 1714498251685, "pointerup" ],
            "em": { "ph": 0, "cp": 0, "ek": "f1", "wd": 1, "nt": 0, "si": 0, "sc": 0 },
            "tm": {
                "a": 1714482583754,
                "b": 1714482586300,
                "c": 1714482586300,
                "d": 0,
                "e": 0,
                "f": 1714482585314,
                "g": 1714482585314,
                "h": 1714482585314,
                "i": 1714482585433,
                "j": 1714482585824,
                "k": 1714482585438,
                "l": 1714482585824,
                "m": 1714482586201,
                "n": 1714482586201,
                "o": 1714482583800,
                "p": 1714482583868,
                "q": 1714482583932,
                "r": 1714482583933,
                "s": 1714482587280,
                "t": 1714482587280,
                "u": 1714482587339
            },
            "dnf": "dnf",
            "by": 0
        },
        "passtime": 15843294,
        "rp": "28e658f44d60d06fb641434bee7f75c1",
        "captcha_token": "735345315",
        "n8md": "gfdpqvbj"
    }'
```

很多东西可以固定, 我们需要解决:

- tt 疑似是鼠标轨迹
- s
- h
- hh
- hi
- ep
  - tm `H(o[$_CFEEX(359)] + o[$_CFEEX(322)] + s)`
- passtime
- rp
- captcha_token
- n8md

翻函数开头, 找找定义

```js
e = i["$_BJJV"]["$_BIBF"]() ="M*?8PN9U(F(,,(55(-9?-K,)TC)NTFDM9FDMMFgJJPMFE(/Me9.(Ej(/)M0(,?((((///)hNUGB,Cf3OV)b:V(MG0(M9Q5*((((("
t = i["$_BJJV"]["$_BICJ"]() = function _BICJ() = "M(*((1((M(("
n = i["$_BJCx"]["$_BICJ"]() = "-1magic data-1magic data-1magic data-1magic data-1magic data-1magic data-1magic data-1magic data-1magic data-1magic data-1magic data-1magic data-1magic data-1magic data-1magic data-1magic data-1magic data-1magic data-1magic data-1magic data-1magic data-1magic data-1magic data-1magic data-1magic data-1magic data-1magic data-1magic data-1magic data-1magic data-1magic data-1magic data-1magic data-1magic data-1magic data-1magic data-1magic data-1magic data-1magic data-1magic data-1magic data-1magic data-1magic data-1magic data-1magic data-1magic data-1magic data-1magic data-1magic data-1magic data-1magic data-1magic data-1magic data-1magic data-1magic data-1magic data-1magic data-1magic data-1magic data-1magic data-1magic data-1magic data-1magic data-1magic data-1magic data-1magic data-1magic data-1magic data-1magic data-1magic data-1magic data-1magic data-1magic data-1"
r = i["$_BDHy"]["$_BIBF"]() = "DIV_0"
rt = 1714499622513
$_GI() = 时间戳
s = $_GI() - rt = 504287
i["$_CECj" ] = $_CFEDy(260) = ""

$_CFEEX(1116) = "tt" = function (e, t, n) {
  if (!t || !n) return e;
  var r,
  o = 0,
  i = e,
  s = t[0],
  a = t[2],
  _ = t[4];
  while (r = substr((o, 2)) {
    o += 2;
    var c = parseInt(r, 16),
    l = String["fromCharCode"](c),
    u = (s * c * c + a * c + _) % e["length" ];
    i = i["substr"](0, u) + l + i["substr"](u);
  }
  return i;
}(e, o["c"], o["s"]) || - 1

t = [ 12, 58, 98, 36, 43, 95, 62, 15, 12 ]
t[0] = 12
t[2] = 98
t[4] = 43

H = md5小写
$_CFEDy(566) = "s" = H(p["$_HDB"](t)) = H("tEQOYESJYERVYEQ." )
$_CFEEX(1168) = "h" = H(p["$_HDB"](n)) = H(dGFdxFsdzEBYxHgZ循环)
$_CFEEX(1128) = "hh" = H(n)
$_CFEDy(1135) ="hi" = H(i["$_CCFN"]) = "09eb21b3ae9542a9bc1e8b63b3d9a467" = H("-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1")
$_CFEDy(1166) = "ep" = i["$_CEDu"]() = {...}
$_CFEEX(1118) = "passtime" = s = 627652 // 自己随便写
$_CFEEX(1132) = "rp" = H(gt + challenge + passtime)
```

更多参数后面再扒

至此, w2完成

### 第三个w

找到入口, 太熟悉了, 这不是w1吗, 大概率就是参数不一样, 其他地方一样了

```js
var u = n[$_CACBc(731)](),
  h = X[$_CACBc(355)](ae[$_CACAq(125)](o), n[$_CACBc(785)]()),
  p = w[$_CACAq(720)](h),
  d = {
    gt: r[$_CACBc(160)],
    challenge: r[$_CACBc(101)],
    lang: o[$_CACBc(177)],
    pt: n[$_CACAq(601)],
    client_type: n[$_CACAq(632)],
    w: p + u,
  };
```

搞出请求内容

```js
ae[$_CACAq(125)](o) ='{
  "lang": "zh-cn",
  "passtime": 1734,
  "a": "5363_8046,3130_3310,6599_4788",
  "pic": "/captcha_v3/batch/v3/69087/2024-05-01T02/word/837a7b7fa6054f4da41aebcb309b4861.jpg",
  "tt": "M?d8Pjp8Pjp8Pjp8M:38NN38Pc38Pjp/.*M6MeD,((b5(5):5(,(((5)@((@cBB.-A((*(e(b(n(g(((((c(.A:-((5,(5B9b6,(((b((-,)-1//d))NMLMEFDMbFgJDC))TBj5/JE:jI/JR3,::FU-84-F.M9FgJCKCNj//JC/A:11/JDCqFkM9K*NT0N60.NAId*fN0:J:59gVFkOI-c:TMUFE-/JDMEFgFgM9G)NeJDMMGdB6N2OUW3OjW1/2U9hHjQE7.Emb?I:I:FmOhKU-0aIMMFmFj1/BlNC5RFE-/JDO1EXgE//JDBgJDM9FhC-g2U9RRM9K4@cG1*gYebb(((b5nbn,(5e5q,,(bbe5(,(n5,5b55((b8b((58(5n(,((qb((((5((f1E-(/.()bE4*(c8)M9-*(M-N4)(?(E-(/)M5-),*(9/)M5-)(9b9-)(Y3),*M9bM-5-),)(I-*b9-)M9(?bE-N8*(94)M:,)M9cM-1/)5@:TMEBfC)(j/)11-)1)ME(E-(/)M*-5-)9Y--J2BQH)MB-Y/)M~E*)(9AV9mH1--Ej7)M93/:E-,3)(E5(-fAgM99Q1??)(U-)ME**(9-)(?(9-)(E-(W-)(9/-(0qqqn((Lqj((((((M4he(,8bbe((5n,((5e5qb5,5e5b8((5((b(855(-9(((8(((5(b(,n(,5((q5(((n@a/(?b96.:@b99n/*b98)).P)NQP)N*bb-N1@-Y-),)ME-(-)M9(9-)(E-(/)()M9(E1(/)(1/)M97)M91E1(-NM9(E-(/*M)ME(E3(/,()(jD-)M960REK1-0:O9f7)),F.9j-*M9-U-(-5-)7Ul:Bc6oL-5S293)M11)1B1A.:3)(9-)M9(92,-j/)MM**(@C0OE-4d),IhEJON9/)(U1)3*(919-)(9Mb/)(0qqqqej((()qqqM((((((",
  "ep": {
    "ca": [
      { "x": 1014, "y": 306, "t": 1, "dt": 2745 },
      { "x": 940, "y": 149, "t": 1, "dt": 393 },
      { "x": 1055, "y": 198, "t": 1, "dt": 691 },
      { "x": 1122, "y": 395, "t": 3, "dt": 646 }
    ],
    "v": "3.1.0",
    "$_FB": false,
    "me": true,
    "tm": {
      "a": 1714499620351,
      "b": 1714499620593,
      "c": 1714499620593,
      "d": 0,
      "e": 0,
      "f": 1714499620357,
      "g": 1714499620357,
      "h": 1714499620357,
      "i": 1714499620357,
      "j": 1714499620357,
      "k": 1714499620357,
      "l": 1714499620357,
      "m": 1714499620574,
      "n": 1714499620593,
      "o": 1714499620593,
      "p": 1714499620702,
      "q": 1714499620709,
      "r": 1714499620757,
      "s": 1714499620759,
      "t": 1714499620759,
      "u": 1714499620776
    }
  },
  "h9s9": "1816378497",
  "rp": "059b65ecc532496663c442cbd2196e9d"
}'
```

很多熟面孔, 也有生面孔

- a 点选位置
- h9s9 每天变化
- ep
