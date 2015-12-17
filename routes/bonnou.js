var mongo = require('mongodb');
var cache = require('memory-cache');
 
var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;
 
var server = new Server(process.env.MONGO_HOST, process.env.MONGO_PORT, {auto_reconnect: true});
db = new mongo.Db('bonnou', server, {safe:false});
 
db.open(function(error, data) {
    if(!error) {
      data.authenticate(process.env.MONGO_USER, process.env.MONGO_PASS, function(err, data){
        console.log("Connected to 'bonnoudb' database");
        db.collection('bonnou', {strict:true}, function(err, collection) {
            if (err) {
                console.log("The 'bonnou' collection doesn't exist. Creating it with data...");
                populateDB();
            }
        });
      });
    }
});
 
exports.findById = function(req, res) {
    var id = req.params.id;
    var cache_result = cache.get('bonnou-' + id);
    if (cache_result) {
      res.jsonp(cache_result);
    } else {
      db.collection('bonnou', function(err, collection) {
        collection.findOne({'id':parseInt(id)}, function(err, item) {
          var result = null;
          if (!item) {
            res.jsonp({error: "bonnou not found"}, 404);
          } else {
            cache.put('bonnou-' + id, item);
            res.jsonp(item);
          }
        });
      });
    }
};
 
exports.findAll = function(req, res) {
    var cache_result = cache.get('bonnou-all');
    if (cache_result) {
      res.jsonp(cache_result);
    } else {
      db.collection('bonnou', function(err, collection) {
          collection.find().toArray(function(err, items) {
              cache.put('bonnou-all', items);
              console.log('not cache');
              res.jsonp(items);
          });
      });
    }
};
 
var populateDB = function() {
    Array.prototype.in_array = function(val) {
      for(var i = 0,  l = this.length; i < l; i++) {
        if(this[i] == val) {
          return true;
        }
      }
      return false;
    };

    var rokudai = {
        "貪": {
            name: "貪",
            kana: "とん",
            description: "万の物を必要以上に求める心"
        },
        "瞋": {
            name: "瞋",
            kana: "しん",
            description: "自分に背くことがあれば必ず怒るような心"
        },
        "癡": {
            name: "癡",
            kana: "ち",
            description: "万物の理にくらき心"
        },
        "慢": {
            name: "慢",
            kana: "まん",
            description: "他人と比較して思い上がり、自分を頼んで人を侮るような心"
        },
        "疑": {
            name: "疑",
            kana: "ぎ",
            description: "仏教の示す真理に、まず疑ってかかる心"
        },
        "悪見": {
            name: "悪見",
            kana: "あくけん",
            description: "曲がった事を強く思い、誠の道理を知らない心"
        }
    };

    var akuken = {
        "有身見": {
            name: "有身見",
            kana: "うしんけん",
            description: "悪見：自分と自分のものにこだわる心"
        },
        "辺執見": {
            name: "辺執見",
            kana: "へんしゅうけん",
            description: "悪見：部分に固執するかたよったものの見方"
        },
        "邪見": {
            name: "邪見",
            kana: "じゃけん",
            description: "悪見：因果の法則を無視した考え方"
        },
        "見取見": {
            name: "見取見",
            kana: "けんしゅけん",
            description: "悪見：自己の見解に固執し、他人の見解を否定する、諸々の諍論、対立をひきおこす心"
        },
        "戒禁取見": {
            name: "戒禁取見",
            kana: "かいごんしゅけん",
            description: "悪見：誤った「仏教の実践」を正しいと思いこだわる心"
        }
    };

    var sangai = {
        "欲界": {
            name: "欲界",
            kana: "よくかい",
            description: "欲望にとらわれた生物が住む世界"
        },
        "色界": {
            name: "色界",
            kana: "しきかい",
            description: "欲望を離れた清浄な物質の世界"
        },
        "無色界": {
            name: "無色界",
            kana: "むしきかい",
            description: "欲望も物質的条件も超越し、ただ精神作用にのみ住む世界"
        }
    };

    var shitai = {
        "苦諦": {
            name: "苦諦",
            kana: "くたい",
            description: "苦という真理",
            akuken: ["有身見", "辺執見", "邪見", "見取見", "戒禁取見"]
        },
        "集諦": {
            name: "集諦",
            kana: "じったい",
            description: "苦の原因という真理",
            akuken: ["邪見", "見取見"]
        },
        "滅諦": {
            name: "滅諦",
            kana: "めったい",
            description: "苦の滅という真理",
            akuken: ["邪見", "見取見"]
        },
        "道諦": {
            name: "道諦",
            kana: "どうたい",
            description: "苦の滅を実現する道という真理",
            akuken: ["邪見", "見取見", "戒禁取見"]
        }
    };

    var shudou = {
        "欲界": ["貪", "瞋", "癡", "慢"],
        "色界": ["貪", "癡", "慢"],
        "無色界": ["貪", "癡", "慢"]
    };

    var jiten = {
        "無漸": {
            name: "無漸",
            kana: "むざん",
            description: "内面的に恥じないこと"
        },
        "無愧": {
            name: "無愧",
            kana: "むき",
            description: "人に恥じないこと"
        },
        "嫉": {
            name: "嫉",
            kana: "しつ",
            description: "ねたみ"
        },
        "慳": {
            name: "慳",
            kana: "けん",
            description: "ものおしみ"
        },
        "悪作": {
            name: "悪作",
            kana: "あくさ",
            description: "後悔"
        },
        "睡眠": {
            name: "睡眠",
            kana: "すいめん",
            description: "人に恥じないこと"
        },
        "掉挙": {
            name: "掉挙",
            kana: "じょうこ",
            description: "精神的な躁状態のこと"
        },
        "惘沈": {
            name: "惘沈",
            kana: "こんじん",
            description: "精神的な鬱状態のこと"
        },
        "忿": {
           name: "忿",
           kana: "ふん",
           description: "いきどおり"
        },
        "覆": {
            name: "覆",
            kana: "ふく",
            description: "罪をおおい隠すこと"
        }
    };

    var bonnou = [],
        bonTemp,
        kai, tai, bon, ken, ten, i, key,
        id = 1;

    for(kai in sangai) {
      for(tai in shitai) {
        for(bon in rokudai) {
          if (kai !== "欲界" && bon === "瞋") {
            continue;
          }
          if (bon === "悪見") {
            for(ken in akuken) {
              if (shitai[tai]["akuken"].in_array(ken)) {
                bonnou.push(getBonbouInfo({
                  "base":   akuken[ken],
                  "sub":    {name: "六大煩悩", kana: "ろくだいぼんのう", description: "根本的煩悩"},
                  "tai":    shitai[tai],
                  "kai":    sangai[kai],
                  "level":  "見道"
                }));
              }
            }
          } else {
            bonnou.push(getBonbouInfo({
              "base":   rokudai[bon],
              "sub":    {name: "六大煩悩", kana: "ろくだいぼんのう", description: "根本的煩悩"},
              "tai":    shitai[tai],
              "kai":    sangai[kai],
              "level":  "見道"
            }));
          }
        }
      }
    }
    for(kai in shudou) {
      len = shudou[kai].length;
      for(i = 0; i < len; i++) {
        key = shudou[kai][i];
        bonnou.push(getBonbouInfo({
          "base":   rokudai[key],
          "sub":    null,
          "tai":    null,
          "kai":    sangai[kai],
          "level":  "修道"
        }));
      }
    }
    for(ten in jiten) {
      bonnou.push(getBonbouInfo({
        "base":   jiten[ten],
        "sub":    {name: "十纏", kana: "じってん", description: "枝末煩悩"},
        "tai":    null,
        "kai":    null,
        "level":  null
      }));
    }

    db.collection('bonnou', function(err, collection) {
        collection.insert(bonnou, {safe:true}, function(err, result) {
          console.log(err, result);
        });
    });
 
    function getBonbouInfo(params) {
        var base = params["base"],
            sub = params["sub"],
            tai = params["tai"],
            kai = params["kai"],
            level = params["level"],
            bonnou = {};

        bonnou["id"] = id;
        id++;

        bonnou["name"] = base["name"];
        bonnou["kana"] = base["kana"];
        bonnou["description"] = base["description"];

        bonnou["category"] = sub ? sub["name"] : null;
        bonnou["category_kana"] = sub ? sub["kana"] : null;
        bonnou["category_description"] = sub ? sub["description"] : null;

        bonnou["satya"] = tai ? tai["name"] : null;
        bonnou["satya_kana"] = tai ? tai["kana"] : null;
        bonnou["satya_description"] = tai ? tai["description"] : null;

        bonnou["dhaatu"] = kai ? kai["name"] : null;
        bonnou["dhaatu_kana"] = kai ? kai["kana"] : null;
        bonnou["dhaatu_description"] = kai ? kai["description"] : null;

        bonnou["level"] = level;
        return bonnou;
    }
};
