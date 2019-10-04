module.exports = {
    Time(duration) {
        const time = new Date(duration * 1000).toISOString().substr(12, 7);
        return time[0] == 0 ? time.substr(2, 5) : time;
    },
    DateComparison(date) {
        const compare = new Date(date);
        const today = new Date();

        const difference = today.getTime() - compare.getTime();
        if (window.timeSpan < difference) return date;
        else {
            const daysLeft = Math.floor((window.daysToCompare - (window.timeSpan - difference) / 86400000))
            return daysLeft;
        }
    }

}
