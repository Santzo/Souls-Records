import { Dimensions, PixelRatio } from "react-native";

const Global = {
    width: PixelRatio.getPixelSizeForLayoutSize(Dimensions.get('window').width),
    height: PixelRatio.getPixelSizeForLayoutSize(Dimensions.get('window').height),
    ratio: PixelRatio.getPixelSizeForLayoutSize(Dimensions.get('window').height) / PixelRatio.getPixelSizeForLayoutSize(Dimensions.get('window').width)
}

window.daysToCompare = 14;
window.timeSpan = daysToCompare * 86400000;
window.isPortrait = () =>
{
    const dim = Dimensions.get('screen');
    return dim.height >= dim.width;
};

export default Global;