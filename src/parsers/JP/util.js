/*
    
    
*/

var hankaku = '1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ ';
var zenkaku = '１２３４５６７８９０ａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺ　';

exports.zenkakuToHankaku = function (word) {
  for (var i = 0, n = zenkaku.length; i < n; i++) {
    word = word.replace(new RegExp(zenkaku[i], 'gm'), hankaku[i]);
  }
  return word.replace(/^\s+|\s+$/g, ''); // trim head and tail white space
};

exports.hankakuToZenkaku = function (word) {
  for (var i = 0, n = hankaku.length; i < n; i++) {
    word = word.replace(new RegExp(hankaku[i], 'gm'), zenkaku[i]);
  }
  return word.replace(/^\s+|\s+$/g, ''); // trim head and tail white space
};

