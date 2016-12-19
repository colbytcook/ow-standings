'use strict';

var $ = require('jquery');

module.exports = class OverwatchAjax{
  constructor($el){
    // var users = $el.data('users');
    var profiles = [];
    var heroes = [];
    var timo = 'timomcd-1765';
    var ewok = 'EwoK-11957';
    var colby = 'muddypants-1515';
    var joe = 'Zeke-1376';
    // $.getData = function(user){
    //   // console.log(users);
    //   $.get('https://api.lootbox.eu/pc/us/' + user + '/profile', function(profile) {
    //     profiles.push(profile);
    //   }),
    //   $.get('https://api.lootbox.eu/pc/us/' + user + '/quickplay/allHeroes/', function(profileero) {
    //     heroes.push(profileero);
    //   })
    // };
    $.when(
      $.get('https://api.lootbox.eu/pc/us/' + timo + '/profile', function(timoData) {
        profiles.push(timoData);
      }),
      $.get('https://api.lootbox.eu/pc/us/' + timo + '/quickplay/allHeroes/', function(timoHeroes) {
        heroes.push(timoHeroes);
      }),
      $.get('https://api.lootbox.eu/pc/us/' + ewok + '/profile', function(ewokData) {
        profiles.push(ewokData);
      }),
      $.get('https://api.lootbox.eu/pc/us/' + ewok + '/quickplay/allHeroes/', function(ewokHeroes) {
        heroes.push(ewokHeroes);
      }),
      $.get('https://api.lootbox.eu/pc/us/' + colby + '/profile', function(colbyData) {
        profiles.push(colbyData);
      }),
      $.get('https://api.lootbox.eu/pc/us/' + colby + '/quickplay/allHeroes/', function(colbyHeroes) {
        heroes.push(colbyHeroes);
      }),
      $.get('https://api.lootbox.eu/pc/us/' + joe + '/profile', function(joeData) {
        profiles.push(joeData);
      }),
      $.get('https://api.lootbox.eu/pc/us/' + joe + '/quickplay/allHeroes/', function(joeHeroes) {
        heroes.push(joeHeroes);
      })
    ).then(function() {
      var newHeroesOrder = [];
      var medals = ['gold', 'silver', 'bronze'];
      var arrayReorder = function(profiles, heroes){
        var findGamesPlayed = function(){

        };
        for(var pa = 0; pa < profiles.length; pa++){
          var damageDone = '';
          var damageDoneAverage = '';
          var playtime = profiles[pa].data.playtime.quick.split(' ');
          for(var h = 0; h < heroes.length; h++){
            var timePlayed = heroes[h].TimePlayed.split('hour');
            damageDone = parseInt(heroes[h].DamageDone.replace(/,/g, ''), 10);
            damageDoneAverage = parseInt(heroes[h]["DamageDone-Average"].replace(/,/g, ''), 10);
            var gamesPlayed = damageDone / damageDoneAverage;
            if(heroes[h].GamesPlayed === undefined){
              heroes[h].GamesPlayed = Math.floor(gamesPlayed);
            }
            findGamesPlayed();
            if(timePlayed[0] === playtime[0]){
              newHeroesOrder.push(heroes[h]);
            }
          }
        }
      };
      var profileRow = '<th><img class="logo" src="/images/overwatch-logo.png" /></th>';
      arrayReorder(profiles, heroes);
      for(var p = 0; p < profiles.length; p++){
        var starImage = '';
        var starClass = '';
        var profileData = profiles[p].data;
        if(profileData.star !== ''){
          starClass = 'star-adjust';
          starImage = '<img class="star" src="' + profileData.star + '" alt="star" />';
        } else {
          starClass = '';
          starImage = '';
        }
        profileRow = profileRow + '<th class="profile-tab"><div class="tab"><img class="avatar" src="' + profileData.avatar + '" alt="' + profileData.username + ' avatar" /><p class="username">' + profileData.username + '</p><div class="level-container"><p class="level ' + starClass + '">' + starImage + profileData.level + '</p></div><p class="playtime">Play Time: ' + profileData.playtime.quick + '</p></div></div></th>';
      }
      $('.profiles').html(profileRow);
      var keyOrder = [];
      for (var key in newHeroesOrder[0]) {
        keyOrder.push(key);
      }
      for(var ko = 0; ko < keyOrder.length; ko++){
        var gamesPlayed = 0;
        var infoRow = '';
        var rank = '';
        var keyValue = keyOrder[ko];
        if(!keyValue.match(/Average/g) && !keyValue.match(/GamesPlayed/g)){
          if(!keyValue.match(/Deaths/g)){
            rank = ' class="htl"';
          } else {
            rank = ' class="lth"';
          }
          infoRow = '<tr' + rank + '><td>' + keyValue.replace( /([A-Z])/g, " $1" ) + '</td>';
          for(var nho = 0; nho < newHeroesOrder.length; nho++){
            var infoOutput = '';
            if(newHeroesOrder[nho][keyValue] === undefined || newHeroesOrder[nho][keyValue] === ''){
              newHeroesOrder[nho][keyValue] = 0;
            }
            if(!keyValue.match(/MostinGame/g)){
              var average = 0;
              if(typeof newHeroesOrder[nho][keyValue] === 'string'){
                average = parseInt(newHeroesOrder[nho][keyValue].replace(/,/g, ''), 10) / newHeroesOrder[nho].GamesPlayed;
              } else {
                average = newHeroesOrder[nho][keyValue] / newHeroesOrder[nho].GamesPlayed;
              }
              infoOutput = '<div class="top-row"><p class="data-value">' + newHeroesOrder[nho][keyValue] + '</p><p class="data-average">' + average.toFixed(3) + '</p></div>';
            } else {
              infoOutput = '<div class="top-row"><p class="data-average center">' + newHeroesOrder[nho][keyValue] + '</p></div>';
            }
            infoRow = infoRow + '<td>' + infoOutput + '</td>';
          }
          infoRow = infoRow + '</tr>';
          $('.hero-data').append(infoRow);
        }
      }
      var medalAssign = function(row, rankings){
        for(var r = 0; r < rankings.length; r++){
          row.find('td').each(function(i){
            var dataValue = $(this).find('.data-average').html();
            if(dataValue === rankings[r] && dataValue > 0){
              $(this).addClass('medal ' + medals[r]);
            } else {
              $(this).addClass('medal');
            }
          });
        }
      };
      var lth = function(data){
        return data.sort();
      };
      var htl = function(data){
        return data.sort().reverse();
      };
      $('.hero-data tr').each(function(i){
        var averages = [];
        var rankings = [];
        $(this).find('td').each(function(i){
          var dataValue = $(this).find('.data-average').html();
          if(dataValue !== undefined){
            console.log(dataValue.replace(',', ''));
            averages.push(dataValue.replace(',', '').replace(':', ''));
          }
        });
        if($(this).hasClass('lth')){
          rankings = lth(averages);
          medalAssign($(this), rankings);
        } else {
          rankings = htl(averages);
          medalAssign($(this), rankings);
        }
      });
    });
  }
};
