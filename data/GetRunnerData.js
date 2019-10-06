import Games from './Games';

async function GetRunnerData(name) {
    let UserData = {}
    UserData.games = [];
    UserData.runner = name;
    const response = await fetch(`https://www.speedrun.com/api/v1/users/${name}/personal-bests?embed=game,category,players`);
    const data = await response.json();

    if (typeof data.data === 'undefined' || data.data === null) return null;

    let tempLocation = data.data[0].players.data[0].location;
    let tempCountry = Check(tempLocation) ? data.data[0].players.data[0].location.country.code : null;
    UserData.country = Check(tempCountry) ? tempCountry : '';

    const games = data.data.filter(dat => {
        let _data = false;
        Games.forEach(game => {
            if (game.id === dat.run.game) {
                _data = true;
            }
        })
        return _data;
    });


    for (let i = 0; i < games.length; i++) {
        const tempName = games[i].game.data.names.international;
        const tempCategory = games[i].category.data.name;
        const tempPlace = games[i].place;
        const tempTime = games[i].run.times.primary_t;
        const tempDate = games[i].run.date;


        const tempVideoCat = games[i].run.videos;
        const tempVideo = Check(tempVideoCat) ? games[i].run.videos.links[0].uri : null;

        const name = Check(tempName) ? tempName : '';
        const category = Check(tempCategory) ? tempCategory : '';
        const date = Check(tempDate) ? tempDate : '';
        const place = Check(tempPlace) ? tempPlace : 0;
        const time = Check(tempTime) ? tempTime : 0;
        const video = Check(tempVideo) ? tempVideo : '';


        // Check for duplicate Bloodborne categories, because no quitout meme runs still exist in the leaderboard
        if (!UserData.games.some(user => user.name === name && user.category === category)) UserData.games.push({ name, category, date, place, time, video });
        else {
            const index = UserData.games.findIndex(game => game.name === name && game.category === category && game.time === time)
            if (index !== -1) 
            {
                UserData.games[index].place = UserData.games[index].place > place ? UserData.games[index].place : place;
            }
        }
    }
    return UserData;
}

function Check(e) {
    return typeof e !== 'undefined' && e !== null
}

export default GetRunnerData;