//###########################################
// $( document ).ready()
$(document).ready(function () {

    resetTargets();
    bindDragNDrop();
    chkTargets();
    //
    $("#timerContainer").append(strEl);
    // console.info("[ready] strEl: " + strEl);

});

//###########################################
// Global
var oldPlayListsCount = 0;
var isPlaying = "N";

var playOne;
var playlists = [];

var arrPlaylist = [];
var arrPlayData = [{
        name: "LTSR-01",
        data: "audioResource/audio/bit-a-01"
    },
    {
        name: "LTSR-02",
        data: "audioResource/audio/bit-a-02"
    },
    {
        name: "LTSR-03",
        data: "audioResource/audio/bit-a-03"
    },
    {
        name: "LTSR-04",
        data: "audioResource/audio/bit-a-04"
    },
    {
        name: "LTSR-05",
        data: "audioResource/audio/bit-a-05"
    },
    {
        name: "LTSR-06",
        data: "audioResource/audio/bit-b-01"
    },
    {
        name: "LTSR-07",
        data: "audioResource/audio/bit-b-02"
    },
    {
        name: "LTSR-08",
        data: "audioResource/audio/bit-b-03"
    },
    {
        name: "LTSR-09",
        data: "audioResource/audio/bit-b-04"
    },
    {
        name: "LTSR-10",
        data: "audioResource/audio/bit-b-05"
    }
];

function chkTargets() {
    oldPlayListsCount = arrPlaylist.length;

    arrPlaylist = [];
    var obj = $("div.loop-container").find('div.loop-btn');

    for (let i = 0; i < obj.length; i++) {
        // console.log($(obj).eq(i).find("div.toy").length);
        if ($(obj).eq(i).find("div.toy").length > 0) {
            // console.log($(obj).eq(i).attr("btn-id"));
            var code = $(obj).eq(i).find(".toy").attr("data");
            var codeData = arrPlayData.find(dt => dt.name.toUpperCase() === code.toUpperCase());
            arrPlaylist = arrPlaylist.concat(codeData.data);
            console.log("[chkTargets] arrPlaylist : " + arrPlaylist);

        }
    }

    console.log("-----------------------------------------");
    console.log("[chkTargets] oldPlayListsCount::" + oldPlayListsCount);
    console.log("[chkTargets] curPlayListsCount::" + arrPlaylist.length);
}

//
function changeImg(el, img, data) {
    // console.log(el + "||" + img + "||" + data);
    el.children(".toy").children("img").attr("src", img);
    el.children(".toy").attr("data", data);
    // 리스트 데이터 저장
    chkTargets();
};

function resetTargets() {
    for (let i = 1; i < 8; i++) {
        deleteTarget('LT0' + i);
    }

}

function activeTagets(id) {

    if (typeof id !== "undefined") {
        var actEl = "[btn-id=\'" + id + "\']";
        // console.info("-[activeTagets] id: " + id);
        // 이미지를 움직이는 것으로 변경.
        var toyEl = $(actEl).find(".toy img");
        var strSrc = toyEl.attr("src");
        // console.info("-[activeTagets] strSrc: " + strSrc);
        if (typeof strSrc != "undefined") {
            // 음소거 표시 없애고
            $(actEl).attr("class", "loop-btn");
            toyEl.attr("src", strSrc.replaceAll("_pause", ""));
            // console.info("-[activeTagets] toyEl Src: " + toyEl.attr("src"));
        }
        return;
    }

    for (let i = 1; i < 8; i++) {
        var num = num > 9 ? i : '0' + i;
        var actEl = "[btn-id=\'LT" + num + "\']";
        // console.info("-[activeTagets] i: " + i + " || num: " + num);

        // 이미지를 움직이는 것으로 변경.
        var toyEl = $(actEl).find(".toy img");
        var strSrc = toyEl.attr("src");
        // console.info("-[activeTagets] strSrc: " + strSrc);

        if (typeof strSrc != "undefined") {
            // 음소거 표시 없애고
            $(actEl).attr("class", "loop-btn");
            toyEl.attr("src", strSrc.replaceAll("_pause", ""));
            // console.info("-[activeTagets] toyEl Src: " + toyEl.attr("src"));
        }
    }
}

function inactiveTagets() {
    // console.info("-[inactiveTagets] id: " + id);
    for (let i = 1; i < 8; i++) {
        var num = num > 9 ? i : '0' + i;
        var actEl = "[btn-id=\'LT" + num + "\']";
        // console.info("-[inactiveTagets] i: " + i + " || num: " + num);

        // 이미지를 움직이는 것으로 변경.
        var toyEl = $(actEl).find(".toy img");
        var strSrc = toyEl.attr("src");
        // console.info("-[inactiveTagets] strSrc[0]: " + strSrc);

        if (typeof strSrc !== "undefined") {
            // 음소거 표시 보이고
            $(actEl).addClass("pause");
            strSrc = strSrc.replaceAll("../", "##").replaceAll("_pause", "");
            var nStrSrc = strSrc.split(".");
            // console.info("-[inactiveTagets] nStrSrc[1]: " + nStrSrc);

            nStrSrc[0] += "_pause";
            strSrc = nStrSrc[0].concat("." + nStrSrc[1]).replaceAll("##", "../");
            // console.info("-[inactiveTagets] strSrc[2]: " + strSrc);

            toyEl.attr("src", strSrc);
        }
    }
}

function enableTarget(el, img, data) {
    // console.log(el + "||" + img + "||" + el.parent().attr("btn-id"));
    // el.children(".toy").children("img").attr("src", img);

    var apHtml = "<div class=\'toy\' data=\'" + data + "\'>" +
        "<img src = \'" + img + "\' >" +
        "</div>";

    var btnHtml = "<div class=\"btn-group\">" +
        "   <button type=\'button\' class=\'btn btn-lg btn-outline-secondary\' onclick=playToTarget(\'" + el.parent().attr("btn-id") + "\')\;><i class=\"bi bi-play-circle-fill\"><\/i><\/button>" +
        "   <button type=\'button\' class=\'btn btn-lg btn-outline-secondary\' onclick=deleteTarget(\'" + el.parent().attr("btn-id") + "\')\;><i class=\"bi bi-x-circle-fill\"><\/i><\/button>" +
        "<\/div>"

    var childNode = $(el).children(".btn-box");
    // 클래스를 변경하고
    childNode.addClass("type-1");
    childNode.append(apHtml);
    el.attr("class", "loop-on");
    el.parent().append(btnHtml)
    el.parent().addClass("pause");

    // 리스트 데이터 저장
    chkTargets();
};

function deleteTarget(id) {

    var el = "<div class=\"loop-off\">" +
        "<div class = \"btn-box\">" +
        "<div class = \"btn-box-top\"><\/div>" +
        "<div class = \"btn-box-front\"><\/div>" +
        "<div class = \"btn-box-right\"><\/div>" +
        "<\/div><\/div>";

    // console.log("[deleteTarget] id:" + id);
    var delEl = "[btn-id=\'" + id + "\']";
    $(delEl).html(el);
    // 클래스 초기화
    $(delEl).attr("class", "loop-btn");
    // 리스트 데이터 저장
    chkTargets();
    // reBind
    bindDragNDrop();
    if (typeof playOne != "undefined") {
        // 음악 멈추고 모두 비활성화
        stopAudioListsWithToy();
    }
}

//--------------------------
function playToTarget(id) {
    // 선택된 캐릭터만 활성화.
    inactiveTagets();
    activeTagets(id);
    // 사운드를 전부 멈추기
    stopAudioLists();
    // 선택된 사운드만 플레이
    playAudioOne(id);
}

function pauseToTarget(id) {

}

//--------------------------
// Drag N Drop event bind
function bindDragNDrop() {
    var tObj;

    $('div.list-loop-btn .drag-image').draggable({
        start: function (event, ui) {
            tObj = $(".ui-draggable-dragging");
        },
        revert: 'invalid',
        helper: 'clone',
        snap: 'true',
        snapMode: 'both',
        zIndex: 2000,
    });

    $('.loop-container div.btn-box').droppable({
        // accept: "img",
        drop: function (event, ui) {
            // $(this).centerOnDrop(ui);
            // alert("확인!");

            var pObj = $(this).parent();
            var pObjClass = $(this).parent().attr("class").toLowerCase();

            // console.log("ui (s)img name : " + tObj.attr("src"));
            // console.log("ui (t)img name : " + $(this).attr("class") + " || " + $(this).parent().attr("class") + " || " + $(this).attr("btn-id"));

            switch (pObjClass) {
                case 'loop-on':
                    // loop-on일 경우에는 이미지만 교체
                    changeImg(pObj, tObj.attr("src"), tObj.parent().attr("data"));
                    break;
                case 'loop-off':
                    // loop-off일 경우에는 이미지 활성화
                    enableTarget(pObj, tObj.attr("src"), tObj.parent().attr("data"));
                    break;
                default:
                    // console.log(`Sorry, we are out of ${pObjClass}.`);
            }
        }
    });
}

//===========================================
// Control PlayList
function playAudioListsWithToy() {
    playAudioLists();
    //캐릭터 전부 활성화.
    activeTagets();
}

function playAudioLists() {

    console.log("[playAudioLists] arrPlaylist: " + arrPlaylist + " --playlists.length:" + playlists.length);
    if (playlists.length > 0) {
        onTimesUp();
        stopAudioLists();
    }

    if (arrPlaylist.length > 0) {
        for (const dt in arrPlaylist) {
            playlists[dt] = new Audio();
            playlists[dt].src = "http://localhost:8080/" + arrPlaylist[dt];
            playlists[dt].currentTime = 0;
            playlists[dt].loop = true;
            playlists[dt].play();
        }
        isPlaying = "Y";

    } else {
        alert("데이터가 없습니다. 캐릭터를 올려 주세요.");
        isPlaying = "N";
        return;
    }

    //
    resetTimer();
    startTimer();
}

function playAudioOne(id) {

    // 기존 재생 멈춤.
    if (typeof playOne != "undefined") {
        playOne.currentTime = 0;
        playOne.pause();
    }

    var selEl = "[btn-id=\'" + id + "\']";
    var code = $(selEl).find(".toy").attr("data");

    // console.log(">[playAudioOne] code: " + code);

    var strSrc = arrPlayData.filter(function (item) {
        return item.name.toUpperCase() === code.toUpperCase();
    });

    // console.log(">[playAudioOne] Filter results: ", strSrc[0].data);

    // 새롭게 재생.
    playOne = new Audio();
    playOne.src = "http://localhost:8080/" + strSrc[0].data;
    playOne.currentTime = 0;
    playOne.loop = true;
    playOne.play();

    return;
}


function stopAudioListsWithToy() {
    stopAudioLists();
    //캐릭터 전부 비활성화.
    inactiveTagets();
}

function stopAudioLists() {

    onTimesUp();

    console.log("[stopAudioLists] arrPlaylist: " + arrPlaylist + " --playlists.length:" + playlists.length);

    // 기존 재생 멈춤.
    if (typeof playOne != "undefined") {
        playOne.currentTime = 0;
        playOne.pause();
    }

    var num = (playlists.length >= oldPlayListsCount) ? playlists.length : oldPlayListsCount;
    console.log(" +num:" + num + " || isPlaying: " + isPlaying);

    if (isPlaying == "N") return;

    for (let i = 0; i < num; i++) {
        console.log(" ++.i:" + i);
        playlists[i].currentTime = 0;
        playlists[i].pause();
    }

    isPlaying = "N";

    return;
}

//========================================
// play Init
var pgDuration = 8000;
var tm = 0;
var tmCnt = 0;

// function setPlayTimer(t) {
//     tm = setInterval(function () {
//         if (tmCnt > (t / 1000)) {
//             setProgessBar(t);
//             tmCnt = 0;
//         }

//         console.log(tmCnt);
//         tmCnt++;
//     }, t);
// }

// function delPlayTimer() {
//     if (tm != null) {
//         tnCnt = 0;
//         clearInterval(tm)
//     };
// }

// function setProgessBar(dur) {
//     bar = new ProgressBar.SemiCircle(pgbarContainer, {
//         strokeWidth: 6,
//         color: '#FFEA82',
//         trailColor: '#eee',
//         trailWidth: 1,
//         easing: 'easeInOut',
//         duration: dur,
//         svgStyle: null,
//         text: {
//             value: '',
//             alignToBottom: false
//         },
//         from: {
//             color: '#FFEA82'
//         },
//         to: {
//             color: '#ED6A5A'
//         },
//         // Set default step function for all animate calls
//         step: (state, bar) => {
//             bar.path.setAttribute('stroke', state.color);
//             var value = Math.round(bar.value() * 100);
//             if (value === 0) {
//                 bar.setText('');
//             } else {
//                 bar.setText(value);
//             }

//             bar.text.style.color = state.color;
//         }
//     });

//     bar.text.style.fontFamily = '"Raleway", Helvetica, sans-serif';
//     bar.text.style.fontSize = '2rem';

//     bar.animate(1.0); // Number from 0.0 to 1.0
// }


//====================================================
const FULL_DASH_ARRAY = 283;

const WARNING_THRESHOLD = 4;
const ALERT_THRESHOLD = 2;
const TIME_LIMIT = 8;

const COLOR_CODES = {
    info: {
        color: "green"
    },
    warning: {
        color: "orange",
        threshold: WARNING_THRESHOLD
    },
    alert: {
        color: "red",
        threshold: ALERT_THRESHOLD
    }
};

let timePassed = 0;
let timeLeft = TIME_LIMIT;
let timerInterval = null;
let remainingPathColor = COLOR_CODES.info.color;

var strEl = "<div class=\"base-timer\"> " +
    "  <svg class=\"base-timer__svg\" viewBox=\"0 0 100 100\" xmlns=\"http://www.w3.org/2000/svg\"> " +
    "    <g class=\"base-timer__circle\"> " +
    "      <circle class=\"base-timer__path-elapsed\" cx=\"50\" cy=\"50\" r=\"45\"></circle> " +
    "      <path " +
    "        id=\"base-timer-path-remaining\" " +
    "        stroke-dasharray=\"283\" " +
    "        class=\"base-timer__path-remaining " + remainingPathColor + "\"" +
    "        d=\" " +
    "          M 50, 50 " +
    "          m -45, 0 " +
    "          a 45,45 0 1,0 90,0 " +
    "          a 45,45 0 1,0 -90,0 " +
    "        \" " +
    "      ></path> " +
    "    </g> " +
    "  </svg> " +
    "  <span id=\"base-timer-label\" class=\"base-timer__label\">" + formatTime(timeLeft) + "</span> " +
    "</div> ";

function onTimesUp() {
    clearInterval(timerInterval);
}

function startTimer() {

    if (typeof timerInterval != "undefined") onTimesUp();

    timerInterval = setInterval(() => {
        timePassed = timePassed += 1;
        timeLeft = TIME_LIMIT - timePassed;
        document.getElementById("base-timer-label").innerHTML = formatTime(timeLeft);
        setCircleDasharray();
        setRemainingPathColor(timeLeft);

        if (timeLeft === 0) {
            //onTimesUp();
            resetTimer();
            playAudioListsWithToy();
        }
    }, 1000);
}

function resetTimer() {
    timePassed = -1;
    timeLeft = TIME_LIMIT;
    remainingPathColor = COLOR_CODES.info.color;

    document
        .getElementById("base-timer-path-remaining")
        .classList.remove(COLOR_CODES.alert.color);
    document
        .getElementById("base-timer-path-remaining")
        .classList.add(COLOR_CODES.info.color);
}

function formatTime(time) {
    const minutes = Math.floor(time / 60);
    let seconds = time % 60;

    if (seconds < 10) {
        seconds = `0${seconds}`;
    }

    return `${minutes}:${seconds}`;
}

function setRemainingPathColor(timeLeft) {
    const {
        alert,
        warning,
        info
    } = COLOR_CODES;

    // console.log("========================");
    // console.log("timeLeft : " + timeLeft);
    // console.log("warning.threshold : " + warning.threshold);
    // console.log("alert.threshold : " + alert.threshold);

    if (timeLeft <= alert.threshold) {
        document
            .getElementById("base-timer-path-remaining")
            .classList.remove(warning.color);
        document
            .getElementById("base-timer-path-remaining")
            .classList.add(alert.color);
    } else if (timeLeft <= warning.threshold) {
        document
            .getElementById("base-timer-path-remaining")
            .classList.remove(info.color);
        document
            .getElementById("base-timer-path-remaining")
            .classList.add(warning.color);
    }
}

function calculateTimeFraction() {
    const rawTimeFraction = timeLeft / TIME_LIMIT;
    return rawTimeFraction - (1 / TIME_LIMIT) * (1 - rawTimeFraction);
}

function setCircleDasharray() {
    const circleDasharray = `${(
    calculateTimeFraction() * FULL_DASH_ARRAY
  ).toFixed(0)} 283`;
    document
        .getElementById("base-timer-path-remaining")
        .setAttribute("stroke-dasharray", circleDasharray);
}