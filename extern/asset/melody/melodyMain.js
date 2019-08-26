import littleStar from './elementary/반짝반짝 작은별';
import loveGreeting from './elementary/사랑의 인사';
import happayBirthdayToYou from './elementary/생일 축하 노래';
import trout from "./elementary/슈베르트 '송어'";
import jingleBells from './elementary/징글벨';

console.log('melodyMain imported')

Entry.getLocalMelody = function () {
    return {
        '반짝반짝 작은별': littleStar.content,
        '사랑의 인사':loveGreeting.content,
        '생일 축하 노래':happayBirthdayToYou.content,
        "슈베르트 송어":trout.content,
        '징글벨':jingleBells.content,
    }
}
