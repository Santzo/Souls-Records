import userNames from './userNames'
import Games from './Games';

async function RunData(mainApp) {

    const done = await Games.map(async game =>
        GetRunData(game).then(() => mainApp.updateGames())
    );

    await Promise.all(done);

    userNames.sort((a, b) => {
        return a.toLowerCase().localeCompare(b.toLowerCase());
    });
}


async function GetRunData(game) {

    const categoryData = await GetCategories(game);

    for (let i = 0; i < categoryData.data.length; i++) {
        game.categories[i] = ({ name: categoryData.data[i].name, id: categoryData.data[i].id, leaderboard: [{ runner: '', runnerId: '', country: '', time: '', date: '', videoLink: '' }] });
    }

    const leaderboardData = await game.categories.map(async cat => {
        const catData = await GetLeaderboards(game, cat)
        for (let i = 0; i < catData.data.runs.length; i++) {
            const userType = catData.data.players.data[i].rel;
            const runner = userType === 'user' && userType !== null ? catData.data.players.data[i].names.international : catData.data.players.data[i].name;
            const runnerId = userType === 'user' && userType !== null ? catData.data.players.data[i].id : runner;

            const time = catData.data.runs[i].run.times.primary_t;

            const countryType = catData.data.players.data[i].location;
            const country = typeof countryType !== 'undefined' && countryType !== null ? catData.data.players.data[i].location.country.code : "";

            const date = catData.data.runs[i].run.date;


            const videoType = typeof catData.data.runs[i].run.videos !== 'undefined' && catData.data.runs[i].run.videos !== null ? catData.data.runs[i].run.videos.links : null;
            const videoLink = typeof videoType !== 'undefined' && videoType !== null ? catData.data.runs[i].run.videos.links[0].uri : "";

            cat.leaderboard[i] = ({ runner, runnerId, time, country, date, videoLink });

            if (!userNames.includes(runner))
                userNames.push(runner);
        }
    })

    await Promise.all(leaderboardData);

    game.isLoaded = true;
}


async function GetCategories(game) {

    const response = await fetch(`https://www.speedrun.com/api/v1/games/${game.id}/categories`).catch(err => console.log(err));
    const data = await response.json().catch(err => console.log(err));
    return data;


}

async function GetLeaderboards(game, category) {

    const response = await fetch(`https://www.speedrun.com/api/v1/leaderboards/${game.id}/category/${category.id}?embed=players`).catch(err => console.log(err));
    const data = await response.json().catch(err => console.log(err));


    return data;
}
export default RunData;