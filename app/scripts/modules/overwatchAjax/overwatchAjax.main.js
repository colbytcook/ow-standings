'use strict';

var $ = require('jquery');

module.exports = class OverwatchAjax{
  constructor($el){
    var profiles = [];
    var heroes = [];
    var timo = 'timomcd-1765';
    var ewok = 'EwoK-11957';
    var colby = 'muddypants-1515';
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
      })
    ).then(function() {
      var newHeroesOrder = [];
      var arrayReorder = function(profiles, heroes){
        for(var pa = 0; pa < profiles.length; pa++){
          var playtime = profiles[pa].data.playtime.quick.split(' ');
          for(var h = 0; h < heroes.length; h++){
            var timePlayed = heroes[h].TimePlayed.split('hours');
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
        var infoRow = '';
        var keyValue = keyOrder[ko];
        infoRow = '<tr><td>' + keyValue.replace( /([A-Z])/g, " $1" ) + '</td>';
        for(var nho = 0; nho < newHeroesOrder.length; nho++){
          if(newHeroesOrder[nho][keyValue] === undefined || newHeroesOrder[nho][keyValue] === ''){
            newHeroesOrder[nho][keyValue] = 0;
          }
          infoRow = infoRow + '<td>' + newHeroesOrder[nho][keyValue] + '</td>';
        }
        infoRow = infoRow + '</tr>';
        // console.log(infoRow);
        $('.hero-data').append(infoRow);
      }
    });
  }
};
