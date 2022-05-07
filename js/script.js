divCreator()
function divCreator(){
  for(i=0;i<5;i++){
    var div = document.createElement("div");
    div.className = "enemyPlayer";
    document.getElementById("enemy").appendChild(div);
    var name = document.createElement("p");
    name.id = "enemy"+i+"SummonerName";
    document.getElementsByClassName("enemyPlayer")[i].appendChild(name)
    var name = document.createElement("p");
    name.id = "enemy"+i+"ChampName";
    document.getElementsByClassName("enemyPlayer")[i].appendChild(name)
    var name = document.createElement("img");
    name.id = "enemy"+i+"ChampIcon";
    document.getElementsByClassName("enemyPlayer")[i].appendChild(name)
  }
}
var count = 0;
var tag = "";
var summoner_name = "";
var api_key = "";
var enemy_summoner_id_list = [];
var enemy_champion_name_list = [];
var enemy_champion_id_list = []
var enemy_champion_url = [];
function start(){
  tag = document.getElementById("tag").value;
  summoner_name = document.getElementById("name").value;
  api_key = document.getElementById("key").value;
  url = "https://"+tag+".api.riotgames.com/lol/summoner/v4/summoners/by-name/"+summoner_name+"?api_key="+api_key
  summonerDataCollector(url)
}
function summonerDataCollector(url){
  fetch(url)
  .then(response => response.json())
  .then(data => spactatorDataCollector(data["id"]))
}
function spactatorDataCollector(id){
  var url = "https://"+tag+".api.riotgames.com/lol/spectator/v4/active-games/by-summoner/"+id+"?api_key="+api_key
  fetch(url)
  .then(response => response.json())
  .then(data => NameAndCP(data,id))
}
function NameAndCP(match,playerId){
  for(i=0;i<10;i++){
    var summoner_id = match["participants"][i]["summonerId"]
    if(summoner_id==playerId){
      allyTeam_id = match["participants"][i]["teamId"]
      var username = match["participants"][i]["summonerName"]
      document.getElementById("mySummonerName").innerText = username
      var champion_id = match["participants"][i]["championId"]  
      fetch("../json/champs.json")
        .then(response => response.json())
        .then(data => userChampionName(data[0][champion_id]))
    }
  }
  for(i=0;i<10;i++){
    var team_id = match["participants"][i]["teamId"]
    if(allyTeam_id!=team_id){
      enemy_summoner_id_list.push(match["participants"][i]["summonerId"])
      enemy_champion_id_list.push(match["participants"][i]["championId"])
      console.log(match["participants"][i])
    }
  }
  fetch("../json/champs.json")
    .then(response => response.json())
    .then(data => enemyChampionName(data))
}
function userChampionName(champion_name){
  var url = "http://ddragon.leagueoflegends.com/cdn/12.8.1/data/en_US/champion/"+champion_name+".json"
  fetch(url)
    .then(response => response.json())
    .then(data => userChampionDetails(data,champion_name))
}
function userChampionDetails(data,champion_name){
  var pic_url = "https://ddragon.leagueoflegends.com/cdn/11.22.1/img/champion/"+champion_name+".png"
  document.getElementById("myChampName").innerText=data["data"][champion_name]["name"]
  document.getElementById("myChampIcon").src=pic_url
}
function enemyChampionName(data){
  for(i=0;i<5;i++){
    enemy_champion_name_list.push(data[0][enemy_champion_id_list[i]])
  }
  count = 0;
  for(i=0;i<5;i++){
    var url = "http://ddragon.leagueoflegends.com/cdn/12.8.1/data/en_US/champion/"+enemy_champion_name_list[i]+".json"
    fetch(url)
      .then(response => response.json())
      .then(data => enemyChampionDetails(data))
  }
}
function enemyChampionDetails(data){
  single_enemy_champion_name = enemy_champion_name_list[count]
  document.getElementById("enemy"+count+"ChampName").innerHTML=data["data"][single_enemy_champion_name]["name"]
  document.getElementById("enemy"+count+"ChampIcon").src="https://ddragon.leagueoflegends.com/cdn/11.22.1/img/champion/"+single_enemy_champion_name+".png"
  count++;
}