function embedMusicPlayer() {
  // 创建音乐播放器的HTML结构，复制于index.html
  const musicPlayerHTML = `
    <canvas id="canvasCover" height="180" width="150"></canvas>
    <div id="AoralsfoutMusic">
      <audio id="audio">
        <source src="music/1.mp3" type="audio/mpeg" />
      </audio>
      <audio id="chorus">
        <source src="music/1.mp3" type="audio/mpeg" />
      </audio>
      <div id="musicBox">
        <div id="toggleMusicFilter">
          <i class="fa-solid fa-angles-right" id="toggleMusicBtm"></i>
        </div>
        <div id="toggleMusic"></div>
        <div id="music_box">
          <div id="music_box_filter"></div>
          <canvas id="spectrum" width="600" height="320"></canvas>
          <div id="music_box_left">
            <div id="music_box_cover_box">
              <div id="music_box_cover"></div>
            </div>
            <div id="music_box_info">
              <span>TITLE&nbsp;:</span>
              <div id="music_box_info_title"></div>
              <span>AUTHOR&nbsp;:</span>
              <div id="music_box_info_author"></div>
              <span>ALBUM&nbsp;:</span>
              <div id="music_box_info_album"></div>
            </div>
          </div>
          <div id="music_box_right">
            <div id="music_box_lyric"></div>
            <div id="music_box_control">
              <div id="progressBox">
                <div id="timeProgress">00:00 / 00:00</div>
                <div class="progress" id="progress">
                  <div class="progressTrack" id="progressTrack">
                    <div class="progressBar" id="progressBar"></div>
                    <div class="progressThumb" id="progressThumb"></div>
                  </div>
                </div>
              </div>
              <div id="btmBox">
                <div class="controlBtm" id="pervious">
                  <i
                    class="fa-solid fa-backward-step icon"
                    style="font-size: 40px"
                  ></i>
                </div>
                <div class="controlBtm" id="pause">
                  <i class="fa-solid fa-pause icon" style="font-size: 40px"></i>
                </div>
                <div class="controlBtm" id="play" style="display: none">
                  <i class="fa-solid fa-play icon" style="font-size: 34px"></i>
                </div>
                <div class="controlBtm" id="next">
                  <i
                    class="fa-solid fa-forward-step icon"
                    style="font-size: 40px"
                  ></i>
                </div>
              </div>
              <div id="subLyric"></div>
              <div id="bottom">
                <div id="bottom-left">
                  <div class="otherBtm" id="listBtm">
                    <i
                      class="fa-solid fa-bars icon"
                      style="font-size: 19px"
                    ></i>
                  </div>
                  <div id="volumeBox">
                    <i class="fa-solid fa-volume-up icon" id="volumeIcon"></i>
                    <div class="volume" id="volume">
                      <div class="volumeTrack" id="volumeTrack">
                        <div class="volumeBar" id="volumeBar"></div>
                        <div class="volumeThumb" id="volumeThumb"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div id="bottom-right">
                  <div class="otherBtm" id="random" style="display: none">
                    <i
                      class="fa-solid fa-shuffle icon"
                      style="font-size: 19px"
                    ></i>
                  </div>
                  <div class="otherBtm" id="loop" style="display: none">
                    <i class="fa-solid fa-repeat icon" style="font-size: 19px">
                    </i>
                    <div class="loop-1">1</div>
                  </div>
                  <div class="otherBtm" id="order" style="display: none">
                    <i
                      class="fa-solid fa-repeat icon"
                      style="font-size: 19px"
                    ></i>
                  </div>
                  <div class="otherBtm" id="translate">
                    <i class="fa-solid" style="font-size: 18px">译</i>
                  </div>
                  <div id="playState"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="music_list_box"></div>
    </div>
  `;
  // 将音乐播放器的HTML结构插入到页面中
  const targetElement = document.querySelector("body"); // 你可以根据需要更改目标元素
  if (targetElement) {
    targetElement.insertAdjacentHTML("beforeend", musicPlayerHTML);
    // 加载音乐播放器的样式和脚本
    const styleLink = document.createElement("link");
    styleLink.rel = "stylesheet";
    styleLink.href = "https://cdn.jsdelivr.net/gh/Aoralsfout/htmlMusicPlayer/style.css";
    document.head.appendChild(styleLink);

    //复制于script.js

    //动态连线背景

    var canvas = document.createElement("canvas");
    var context = canvas.getContext("2d");
    canvas.style.cssText =
      "position: static;z-index:1;opacity:0.8;margin-left:-550px";

    var W = (canvas.width = 550);
    var H = (canvas.height = 180);
    var count = 50;
    var color = "255,255,255";

    //生成随机位置的小方块
    var random = Math.random,
      squares = []; //存放小方块

    //往squares[]数组放小方块
    for (let p = 0; p < count; p++) {
      var square_x = random() * W, //横坐标
        square_y = random() * H, //纵坐标
        square_xa = 2 * random() - 1, //x轴位移 -1,1
        square_ya = 2 * random() - 1; //y轴位移
      squares.push({
        x: square_x,
        y: square_y,
        xa: square_xa,
        ya: square_ya,
        max: 6000,
      });
    }

    //生成鼠标小方块
    var mouse = {
      x: null,
      y: null,
      max: 20000,
    };

    //绘制小方块，小方块移动(碰到边界反向移动)，小方块受鼠标束缚
    var animation =
      window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function (i) {
        window.setTimeout(i, 1000 / 45);
      }; //各个浏览器支持的requestAnimationFrame有所不同，兼容各个浏览器

    function drawLine() {
      //清除画布
      context.clearRect(0, 0, W, H);

      var w = [mouse].concat(squares); //连接(合并)鼠标小方块数组和其他小方块数组
      var x, A;

      //square属性表：x，y，xa，ya，max
      squares.forEach(function (i) {
        //实现小方块定向移动
        i.x += i.xa;
        i.y += i.ya;

        // 控制小方块移动方向
        // 当小方块达到窗口边界时，反向移动
        i.xa = i.xa * (i.x > W || i.x < 0 ? -1 : 1);
        i.ya = i.ya * (i.y > H || i.y < 0 ? -1 : 1);

        //fillRect前两个参数为矩形左上角的x，y坐标，后两个分别为宽度和高度
        //绘制小方块
        context.fillRect(i.x - 0.5, i.y - 0.5, 1, 1);

        //遍历w中所有元素
        for (let n = 0; n < w.length; n++) {
          x = w[n];
          //如果x与i不是同一个对象实例且x的xy坐标存在
          if (i !== x && null !== x.x && null !== x.y) {
            x_diff = i.x - x.x; //i和x的x坐标差
            y_diff = i.y - x.y; //i和x的y坐标差
            distance = x_diff * x_diff + y_diff * y_diff; //斜边平方
            if (distance < x.max) {
              A = (x.max - distance) / x.max;
              context.beginPath();
              //设置画笔的画线的粗细与两个小方块的距离相关，范围0-0.5，两个小方块距离越远画线越细，达到max时画线消失
              context.lineWidth = A / 2;
              //设置画笔的画线颜色为s.c即画布颜色，透明度为(A+0.2)即两个小方块距离越远画线越淡
              context.strokeStyle = "rgba(" + color + "," + (A + 0.2) + ")";
              //设置画笔的笔触为i小方块
              context.moveTo(i.x, i.y);
              //使画笔的笔触移动到x小方块
              context.lineTo(x.x, x.y);
              //完成画线的绘制，即绘制连接小方块的线
              context.stroke();
            }
          }
        }
        //把i小方块从w数组中去掉
        //防止两个小方块重复连线
        w.splice(w.indexOf(i), 1);
      });

      animation(drawLine);
    }

    setTimeout(function () {
      drawLine();
    }, 100);

    //加载音频变量

    const audio = document.getElementById("audio"); //主音频
    const chorus = document.getElementById("chorus"); //副歌音频

    //加载缓存变量

    function strToBoolean(str) {
      if (str === "false") {
        return false;
      } else if (str === "true") {
        return true;
      }
    }

    //检查是否存在缓存
    if (localStorage["currentTime"] === undefined) {
      localStorage.setItem("currentTime", 0);
      localStorage.setItem("nowPlayingMusicId", 0);
      localStorage.setItem("playMode", "order");
      localStorage.setItem("isShowTranslate", true);
      localStorage.setItem("nowVolume", 0.5);
      localStorage.setItem("memIsListShow", false);
    }

    var currentTime = localStorage["currentTime"];
    var nowPlayingMusicId = localStorage["nowPlayingMusicId"];
    var playMode = localStorage["playMode"];
    var isShowTranslate = strToBoolean(localStorage["isShowTranslate"]);
    var temp_isShowTranslate = [0, isShowTranslate];
    var nowVolume = localStorage["nowVolume"];
    var memIsListShow = strToBoolean(localStorage["memIsListShow"]);
    var isShowDetailsTranslate = false;
    audio.volume = nowVolume;
    chorus.volume = nowVolume;

    setTimeout(function () {
      if (isShowTranslate) {
        document.getElementById("translate").style.color = hexToRgba(
          data[nowPlayingMusicId].mainColor,
          true
        );
      } else {
        document.getElementById("translate").style.color = hexToRgba(
          data[nowPlayingMusicId].mainColor,
          false,
          0.5
        );
      }
    }, 100);

    // var playMode = "order"; //播放模式 order顺序播放 random随机播放 loop单曲循环

    //保存缓存

    setInterval(function () {
      localStorage.setItem("currentTime", audio.currentTime);
      localStorage.setItem("nowPlayingMusicId", nowPlayingMusicId);
      localStorage.setItem("playMode", playMode);
      localStorage.setItem("isShowTranslate", isShowTranslate);
      localStorage.setItem("nowVolume", audio.volume);
      localStorage.setItem("memIsListShow", memIsListShow);
    }, 200);

    //展开&收起列表
    var isListShow = false; //记录列表展开状态

    document.getElementById("listBtm").addEventListener("click", toggleList);

    function toggleList() {
      if (isListShow) {
        isListShow = !isListShow;
        memIsListShow = false;
        document.getElementById("music_list_box").style.height = "0px";
      } else {
        isListShow = !isListShow;
        memIsListShow = true;
        document.getElementById("music_list_box").style.height = "300px";
      }
    }

    //展开&收起播放器
    var isPlayerShow = false;

    document
      .getElementById("toggleMusicFilter")
      .addEventListener("click", togglePlayer);

    document.getElementById("AoralsfoutMusic").style.right = "-357px";
    document.getElementById("toggleMusicBtm").style.transform =
      "rotate(180deg)";

    function togglePlayer() {
      //如果播放器展开
      if (isPlayerShow) {
        //如果列表展开
        if (isListShow) {
          toggleList(); //收起列表
          memIsListShow = true; //记录列表展开
          //延迟收起播放器
          setTimeout(function () {
            isPlayerShow = !isPlayerShow;
            document.getElementById("AoralsfoutMusic").style.right = "-357px";
            document.getElementById("toggleMusicBtm").style.transform =
              "rotate(180deg)";
          }, 300);
          return;
        } else {
          //如果列表收起
          memIsListShow = false; //记忆列表收起
          //直接收起播放器
          isPlayerShow = !isPlayerShow;
          document.getElementById("AoralsfoutMusic").style.right = "-357px";
          document.getElementById("toggleMusicBtm").style.transform =
            "rotate(180deg)";
          return;
        }
      }
      //如果播放器收起
      if (!isPlayerShow) {
        //如果列表记忆为展开
        if (memIsListShow) {
          //展开再展开
          isPlayerShow = !isPlayerShow;
          document.getElementById("AoralsfoutMusic").style.right = "0px";
          document.getElementById("toggleMusicBtm").style.transform =
            "rotate(0deg)";
          setTimeout(toggleList, 300);
          return;
        } else {
          //如果列表记忆为收起
          //直接展开
          isPlayerShow = !isPlayerShow;
          document.getElementById("AoralsfoutMusic").style.right = "0px";
          document.getElementById("toggleMusicBtm").style.transform =
            "rotate(0deg)";
          return;
        }
      }
    }

    function showDetails(id) {
      //隐藏列表展开详情页
      document.getElementById("list_item_" + id).style.display = "none";
      document.getElementById("list_details_" + id).style.opacity = "1";
      //转移连线动态背景
      canvas.id = "line" + id;
      document.getElementById("music_list_" + id).appendChild(canvas);
      //详情页子元素大小适应
      document.getElementById("details_info_" + id).style.width = "210px";
      document.getElementById("details_lyrics_" + id).style.width = "210px";
    }

    function hideDetails(id) {
      document.getElementById("list_item_" + id).style.display = "flex";
      document.getElementById("list_details_" + id).style.opacity = "0";
      document.getElementById("list_details_" + id).style.display = "none";
      setTimeout(function () {
        document.getElementById("list_details_" + id).style.display = "flex";
      }, 100);
      document.getElementById("line" + id).remove();
      document.getElementById("details_info_" + id).style.width = "200px";
      document.getElementById("details_lyrics_" + id).style.width = "200px";
    }

    var nowPlayingChorusId = -1;

    var isPlayingChorus = false;
    var isFading = false;

    //监听鼠标悬浮，展开详情

    function addEventListeners(element, id, index) {
      element.addEventListener("mouseenter", function () {
        showDetails(index);
        setTimeout(function () {
          if (
            document.getElementById("music_list_" + index).offsetHeight ===
              182 &&
            audio.paused
          ) {
            isPlayingChorus = true;
            nowPlayingChorusId = index;
            playChoru(index);
            sourceChorus.connect(analyser);
          }
        }, 500);
      });

      element.addEventListener("mouseleave", function () {
        hideDetails(index);
        isPlayingChorus = false;
        isFading = false;
        isFadingOut = false;
        stopChoru(index);
        nowPlayingChorusId = -1;
      });
    }

    //副歌渐入渐出

    function fadeChours(inOrOut) {
      if (inOrOut == "in") {
        isFading = true;
        chorus.volume = 0;
        chorus.play();
        let volume = 0;
        let targetVolume = nowVolume;
        let totalTime = 1000;
        let interval = 100;
        let volumeIncreasement =
          (targetVolume - volume) / (totalTime / interval);
        let fadeInterval = setInterval(function () {
          if (isPlayingChorus && isFading) {
            volume += volumeIncreasement;
            if (volume >= targetVolume) {
              clearInterval(fadeInterval);
              isFading = false;
            } else {
              chorus.volume = volume;
            }
          } else {
            isFading = false;
            chorus.pause();
            chorus.volume = nowVolume;
            clearInterval(fadeInterval);
          }
        }, interval);
      }
      if (inOrOut == "out") {
        isFading = true;
        let volume = nowVolume;
        let targetVolume = 0;
        let totalTime = 1000;
        let interval = 100;
        let volumeDecreasement =
          (targetVolume - volume) / (totalTime / interval);
        let fadeInterval = setInterval(function () {
          if (isPlayingChorus && isFading) {
            volume += volumeDecreasement;
            if (volume <= targetVolume) {
              chorus.pause();
              isFading = false;
              clearInterval(fadeInterval);
            } else {
              chorus.volume = volume;
            }
          } else {
            isFading = false;
            chorus.pause();
            chorus.volume = nowVolume;
            clearInterval(fadeInterval);
          }
        }, interval);
      }
    }

    let isFadingOut = false; // 添加一个标志来跟踪渐出状态
    //副歌函数
    function playChoru() {
      chorus.src =
        "music/" + nowPlayingChorusId + "." + data[nowPlayingChorusId].format;
      chorus.currentTime = data[nowPlayingChorusId].chorusIn;

      if (data[nowPlayingChorusId].chorusIn == null) {
        data[nowPlayingChorusId].chorusIn = 0;
      }
      if (data[nowPlayingChorusId].chorusOut == null) {
        data[nowPlayingChorusId].chorusOut = chorus.duration;
      }

      chorus.addEventListener("timeupdate", function () {
        if (isPlayingChorus) {
          if (
            chorus.currentTime >= data[nowPlayingChorusId].chorusOut &&
            !isFading &&
            !isFadingOut // 检查渐出标志
          ) {
            isFadingOut = true; // 设置渐出标志
            fadeChours("out");
            setTimeout(function () {
              if (isPlayingChorus) {
                chorus.currentTime = data[nowPlayingChorusId].chorusIn;
                fadeChours("in");
                isFadingOut = false; // 重置渐出标志
              }
            }, 2000);
          }
        }
      });

      // 等待.5秒后开始播放
      setTimeout(function () {
        if (isPlayingChorus) {
          fadeChours("in");
        }
      }, 500);
    }

    function stopChoru(id) {
      chorus.pause();
    }

    //加载音乐盒

    var data; //所有音乐信息

    var lyricsData = [];
    var translatedLyricsData = [];

    var musicLanguage; //音乐语言（中文格式）

    var arr_isShowDetalisTranslate; //记录每一栏翻译的展开状态

    async function getMusicInfo() {
      try {
        const response = await fetch("https://cdn.jsdelivr.net/gh/Aoralsfout/htmlMusicPlayer/getMusicInfo.php",
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          },
        });

        data = await response.json();

        const list = document.getElementById("music_list_box");
        const languageMap = { cn: "中文", jp: "日文", en: "英文", ru: "俄文" };

        const listRes = data
          .map((item) => {
            const bgPositionY =
              item.bgPositionY == null ? "center" : `-${item.bgPositionY}px`;
            const musicLanguage = languageMap[item.language] || "";

            return `
        <div
          class="music_list_items"
          id="music_list_${item.id}"
          style="
            background-image: url('/music_v2/cover/${item.id}.jpg');
            background-position: center ${bgPositionY};
          "
        >
          <div class="music_list_items_filter" id="list_filter_${item.id}"></div>
          <div class="music_list_item" id="list_item_${item.id}">
            <div class="musicIndex">${item.id}</div>
            <div class="music_list_info" style="display: flex">
              ${item.title} - ${item.author}
            </div>
          </div>
          <div
            class="music_list_details"
            id="list_details_${item.id}"
          >
            <div class="details_info" id="details_info_${item.id}">
              <div class="details_title">${item.title}</div>
              <div class="details_2a">作者：${item.author}</div>
              <div class="details_2a">
                专辑：${item.album}
              </div>
              <div class="details_others">
                <div class="details_other">时长 ： ${item.duration}</div>
                <div class="details_other">语言 ： ${musicLanguage}</div>
              </div>
            </div>
            <div class="details_coverBox">
              <div
                class="details_cover"
                id="details_cover_${item.id}"
                style="background-image: url('/music_v2/cover/${item.id}.jpg');transform: scale(1);"
              ></div>
            </div>
            <div>
              <div class="details_lyrics" id="details_lyrics_${item.id}">
                <div class="details_lyrics_original" id="details_lyrics_original_${item.id}"></div>
                <div class="details_lyrics_translated" id="details_lyrics_translated_${item.id}"></div>
              </div>
              <div class="details_lyrics_translateBtm"  id="details_lyrics_translateBtm_${item.id}">译</div>
            </div>
          </div>
        </div>
      `;
          })
          .join("");

        list.innerHTML = listRes;
        loadMusicInfo(nowPlayingMusicId);
        audio.currentTime = currentTime;

        //生成一个数组,记录每一栏翻译的展开状态
        arr_isShowDetalisTranslate = new Array(data.length).fill(false);

        // 在生成音乐列表时，为每个翻译按钮添加事件监听器
        data.forEach((item, index) => {
          const element = document.getElementById(`music_list_${item.id}`);
          addEventListeners(element, item.id, index);
          document
            .getElementById(`details_cover_${item.id}`)
            .addEventListener("click", function () {
              loadMusicInfo(index);
              isPlayingChorus = false;
              isFading = false;
              isFadingOut = false;
              stopChoru(index);
              nowPlayingChorusId = -1;
            });

          // 为翻译按钮添加事件监听器
          const translateButton = document.getElementById(
            `details_lyrics_translateBtm_${item.id}`
          );
          const originalLyrics = document.getElementById(
            `details_lyrics_original_${item.id}`
          );
          const translatedLyrics = document.getElementById(
            `details_lyrics_translated_${item.id}`
          );

          translateButton.style.color = hexToRgba(item.mainColor, false, 0.8);

          translateButton.addEventListener("mouseover", function () {
            translateButton.style.color = "#ccc";
          });

          translateButton.addEventListener("mouseout", function () {
            // 根据当前显示状态更新按钮颜色
            if (arr_isShowDetalisTranslate[index]) {
              translateButton.style.color = hexToRgba(item.mainColor, true);
            } else {
              translateButton.style.color = hexToRgba(
                item.mainColor,
                false,
                0.8
              );
            }
          });

          translateButton.addEventListener("click", function () {
            arr_isShowDetalisTranslate[index] =
              !arr_isShowDetalisTranslate[index];
            if (arr_isShowDetalisTranslate[index]) {
              originalLyrics.style.display = "none";
              translatedLyrics.style.display = "block";
            } else {
              originalLyrics.style.display = "block";
              translatedLyrics.style.display = "none";
            }
            // 更新按钮颜色
            if (arr_isShowDetalisTranslate[index]) {
              translateButton.style.color = hexToRgba(item.mainColor, true);
            } else {
              translateButton.style.color = hexToRgba(
                item.mainColor,
                false,
                0.8
              );
            }
          });
        });
      } catch (error) {
        console.error("Fetch error: ", error);
      }
    }

    getMusicInfo();

    //十六进制转RBG
    function hexToRgba(hex, isReverse, a) {
      // 检查输入是否以#开头
      if (hex.charAt(0) === "#") {
        hex = hex.slice(1);
      }

      // 检查输入是否为3位或6位十六进制
      if (hex.length === 3) {
        hex = hex
          .split("")
          .map(function (hex) {
            return hex + hex;
          })
          .join("");
      }
      // 将十六进制转换为RGBA
      var bigint = parseInt(hex, 16);
      var r = (bigint >> 16) & 255;
      var g = (bigint >> 8) & 255;
      var b = bigint & 255;
      if (isReverse) {
        if (typeof a === "undefined") {
          return "rgb(" + (255 - r) + ", " + (255 - g) + ", " + (255 - b) + ")";
        } else if (typeof a === "number") {
          return (
            "rgba(" +
            (255 - r) +
            ", " +
            (255 - g) +
            ", " +
            (255 - b) +
            "," +
            a +
            ")"
          );
        }
      } else {
        if (typeof a === "undefined") {
          return "rgb(" + r + ", " + g + ", " + b + ")";
        } else if (typeof a === "number") {
          return "rgba(" + r + ", " + g + ", " + b + "," + a + ")";
        }
      }
    }

    //加载音乐
    function loadMusicInfo(id) {
      if (id === -1) {
        id = data.length - 1; //指定id -1 或 0 为最后一首歌
      } else {
        id = Math.abs(id) % data.length; //防止id为负数和限制id不超出总歌曲数量
      }

      audio.pause();

      document.getElementById(
        "list_item_" + nowPlayingMusicId
      ).style.fontWeight = "normal";

      document
        .getElementById("list_item_" + nowPlayingMusicId)
        .querySelector(".music_list_info").innerHTML =
        data[nowPlayingMusicId].title + " - " + data[nowPlayingMusicId].author;

      document.getElementById("list_item_" + id).style.fontWeight = "700";
      document
        .getElementById("list_item_" + id)
        .querySelector(".music_list_info").innerHTML =
        "正在播放：" + data[id].title + " - " + data[id].author;

      nowPlayingMusicId = id; //更新音乐id

      const address = "music/" + id + "." + data[id].format;
      const cover = "cover/" + id + ".jpg";

      //加载信息
      document.getElementById("AoralsfoutMusic").style.color = hexToRgba(
        data[id].mainColor,
        true
      );
      document.getElementById("toggleMusicBtm").style.color = hexToRgba(
        data[id].mainColor,
        true
      );
      document.getElementById("music_box_info").style.textShadow =
        "1px 1px 0px " + hexToRgba(data[id].mainColor, false, 0.8);
      document.getElementById("music_box").style.backgroundImage =
        "url(" + cover + ")";
      document.getElementById("music_box_cover").style.backgroundImage =
        "url(" + cover + ")";
      document.getElementById("toggleMusic").style.backgroundImage =
        "url(" + cover + ")";
      document.getElementById("music_box_info_title").innerHTML =
        data[id].title;
      document.getElementById("music_box_info_author").innerHTML =
        data[id].author;
      document.getElementById("music_box_info_album").innerHTML =
        data[id].album;
      document.getElementById("audio").src = address;
      progressTrack.style.backgroundColor = hexToRgba(
        data[id].mainColor,
        false,
        0.2
      );
      progressBar.style.backgroundColor = hexToRgba(data[id].mainColor, true);
      progressThumb.style.backgroundColor = hexToRgba(data[id].mainColor, true);
      volumeTrack.style.backgroundColor = hexToRgba(
        data[id].mainColor,
        false,
        0.2
      );
      volumeBar.style.backgroundColor = hexToRgba(data[id].mainColor, true);
      volumeThumb.style.backgroundColor = hexToRgba(data[id].mainColor, true);
      document.getElementById("timeProgress").style.color = hexToRgba(
        data[id].mainColor,
        true
      );
      document.getElementById("btmBox").style.color = hexToRgba(
        data[id].mainColor,
        true
      );
      if (isShowTranslate) {
        document.getElementById("translate").style.color = hexToRgba(
          data[nowPlayingMusicId].mainColor,
          true
        );
      } else {
        document.getElementById("translate").style.color = hexToRgba(
          data[nowPlayingMusicId].mainColor,
          false,
          0.5
        );
      }
      if (data[id].isTranslate === "0") {
        temp_isShowTranslate = [1, isShowTranslate];
        isShowTranslate = false;
        document.getElementById("translate").style.display = "none";
      } else {
        if (temp_isShowTranslate[0] === 1) {
          isShowTranslate = temp_isShowTranslate[1];
          temp_isShowTranslate[0] = 0;
        }
        document.getElementById("translate").style.display = "flex";
      }

      document.getElementById(`${playMode}`).style.display = "flex";

      getLrc(id);

      //播放音乐
      audio.load();
      audio.play();

      setTimeout(showLrc, 500);
    }

    var playState = document.getElementById("playState");

    //控制音乐播放暂停按钮切换
    audio.addEventListener("playing", function () {
      document.getElementById("play").style.display = "none";
      document.getElementById("pause").style.display = "flex";
      playState.innerHTML = "播放中";
    });

    audio.addEventListener("pause", function () {
      document.getElementById("play").style.display = "flex";
      document.getElementById("pause").style.display = "none";
      playState.innerHTML = "暂停";
    });

    //按钮功能
    document.getElementById("play").addEventListener("click", function () {
      audio.play();
    });
    document.getElementById("pause").addEventListener("click", function () {
      audio.pause();
      playState.innerHTML = "暂停";
    });
    document.getElementById("pervious").addEventListener("click", function () {
      loadMusicInfo(nowPlayingMusicId - 1);
    });
    document.getElementById("next").addEventListener("click", function () {
      changeMusic();
    });

    //随机播放
    function getRandomMusicId(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      let id = Math.floor(Math.random() * (max - min + 1)) + min;
      if (id === nowPlayingMusicId) {
        id = getRandomMusicId(min, max); //如果随机到同一首歌再随机一次;
      }
      return id;
    }

    //播放模式

    function changeMusic() {
      switch (playMode) {
        case "order":
          loadMusicInfo(nowPlayingMusicId + 1);
          break;
        case "random":
          loadMusicInfo(getRandomMusicId(0, data.length - 1));
          break;
        case "loop":
          audio.currentTime = 0;
          audio.play();
          changeProgress();
          showTextProgress();
          break;
        default:
          break;
      }
      showTextProgress();
      changeProgress();
    }

    audio.addEventListener("ended", function () {
      changeMusic();
      playState.innerHTML = "歌曲结束";
    });

    //更改图标

    document
      .getElementById("loop")
      .addEventListener("click", toggleChangePlayMode);
    document
      .getElementById("random")
      .addEventListener("click", toggleChangePlayMode);
    document
      .getElementById("order")
      .addEventListener("click", toggleChangePlayMode);

    //更改播放模式

    function toggleChangePlayMode() {
      const loop = document.getElementById("loop");
      const order = document.getElementById("order");
      const random = document.getElementById("random");
      switch (playMode) {
        case "order":
          playMode = "random";
          order.style.display = "none";
          random.style.display = "flex";
          break;
        case "random":
          playMode = "loop";
          random.style.display = "none";
          loop.style.display = "flex";
          break;
        case "loop":
          playMode = "order";
          loop.style.display = "none";
          order.style.display = "flex";
          break;
        default:
          break;
      }
    }

    //封面震动

    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = audioCtx.createAnalyser();
    const sourceAudio = audioCtx.createMediaElementSource(audio);
    const sourceChorus = audioCtx.createMediaElementSource(chorus);
    sourceAudio.connect(analyser);
    analyser.connect(audioCtx.destination);
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    function coverAnimation() {
      analyser.getByteTimeDomainData(dataArray);
      const avgAmplitude =
        dataArray.reduce((sum, val) => sum + val, 0) / bufferLength;
      const scaleFactor = Math.pow(1 + (avgAmplitude / 255) * 0.1, 32) - 0.3;

      if (isPlayingChorus) {
        id = nowPlayingChorusId;
      } else {
        id = nowPlayingMusicId;
      }

      const cover = document.getElementById("details_cover_" + id);
      cover.style.transform = `scale(${scaleFactor})`;
    }

    setInterval(coverAnimation, 1000 / 20);

    //音频频谱

    const spectrum = document.getElementById("spectrum");
    const spectrumCtx = spectrum.getContext("2d");
    analyser.fftSize = 128;

    function drawSpectrum() {
      requestAnimationFrame(drawSpectrum);

      analyser.getByteFrequencyData(dataArray);

      spectrumCtx.clearRect(0, 0, spectrum.width, spectrum.height);

      const barWidth = (spectrum.width / bufferLength) * 5;
      let barHeight;
      let px = spectrum.width / 2 + barWidth;
      let nx = spectrum.width / 2 - barWidth;
      let spacing = 3;
      for (let i = 10; i < 128; i++) {
        barHeight = dataArray[i] / 2;

        spectrumCtx.fillStyle = hexToRgba(
          data[nowPlayingMusicId].mainColor,
          true,
          barHeight / 255
        );
        spectrumCtx.fillRect(
          px,
          spectrum.height - barHeight / 3,
          barWidth,
          barHeight / 2
        );
        spectrumCtx.fillRect(
          nx,
          spectrum.height - barHeight / 3,
          barWidth,
          barHeight / 2
        );

        px += barWidth + spacing;
        nx -= barWidth + spacing;
      }
    }
    audio.addEventListener("play", () => {
      drawSpectrum();
    });

    //进度条

    var progressBar = document.getElementById("progressBar");
    var progressThumb = document.getElementById("progressThumb");

    let isMouseDown = false;
    let audioDuration = isNaN(audio.duration) ? 0 : audio.duration;
    let currentPercentage = 0;

    // 鼠标按下
    function handleMouseDown(e) {
      isMouseDown = true;
      updateProgressAndAudio(e);
    }

    // 鼠标松开
    function handleMouseUp(e) {
      isMouseDown = false;
      updateProgressAndAudio(e);
    }

    // 鼠标移动
    function handleMouseMove(e) {
      if (isMouseDown) {
        updateProgressAndAudio(e);
      }
    }

    function updateProgressAndAudio(e) {
      const progressBarRect = document
        .getElementById("progress")
        .getBoundingClientRect();
      const clickX = e.clientX;
      const clickY = e.clientY;

      if (
        clickX >= progressBarRect.left &&
        clickX <= progressBarRect.right &&
        clickY >= progressBarRect.top &&
        clickY <= progressBarRect.bottom
      ) {
        const percentage =
          (clickX - progressBarRect.left) / progressBarRect.width;

        const validPercentage = Math.max(0, Math.min(1, percentage));

        progressBar.style.width = `${validPercentage * 100}%`;
        progressThumb.style.left = `${validPercentage * 100}%`;
        playState.innerHTML = s_To_mmss(
          Math.round(audio.duration * percentage)
        );

        if (!isMouseDown) {
          progressBar.style.removeProperty("width");
          progressThumb.style.removeProperty("left");
          changeProgress();
        }

        if (!isMouseDown && audio.readyState >= 4) {
          const audioCurrentTime = audioDuration * validPercentage;
          audio.currentTime = audioCurrentTime;
        }
      }
      showTextProgress();
    }

    document
      .getElementById("progress")
      .addEventListener("mousedown", handleMouseDown);
    document
      .getElementById("progress")
      .addEventListener("mouseup", handleMouseUp);
    document
      .getElementById("progress")
      .addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    audio.addEventListener("loadedmetadata", function () {
      audioDuration = isNaN(audio.duration) ? 0 : audio.duration;
    });

    //更改进度
    function changeProgress() {
      var percentage = getProgressPercentage();
      progressBar.style.setProperty("--progress", percentage);
      progressThumb.style.setProperty("--progress", percentage);
    }

    //显示进度条进度
    function getProgressPercentage() {
      var totalSeconds = audio.duration;
      var seconds = audio.currentTime;
      var res = (seconds / totalSeconds) * 100 + "%";
      return res;
    }

    //显示文本进度
    function showTextProgress() {
      var totalSeconds = Math.floor(audio.duration);
      var seconds = Math.floor(audio.currentTime);
      var totalProgress = s_To_mmss(totalSeconds);
      var progress = s_To_mmss(seconds);
      if (totalProgress === "NaN:NaN") {
        totalProgress = "00:00";
      }
      var result = progress + "/" + totalProgress;
      document.getElementById("timeProgress").innerHTML = result;
    }

    //秒转换为分秒显示
    function s_To_mmss(ts) {
      var m = Math.floor(ts / 60);
      var s = ts % 60;
      var mm = addZero(m);
      var ss = addZero(s);
      var result = mm + ":" + ss;
      return result;
    }

    function addZero(a) {
      a < 10 ? (a = "0" + a) : a;
      return a;
    }

    //更新进度条
    setInterval(() => {
      changeProgress();
      showTextProgress();
    }, 1000);

    //音量控制
    var volumeSlider = document.getElementById("volume");
    var volumeTrack = document.getElementById("volumeTrack");
    var volumeProgress = document.getElementById("volumeBar");
    var volumeDot = document.getElementById("volumeThumb");

    let isVolumeSliderShow = true;

    toggleVolumeSlider();

    function toggleVolumeSlider() {
      isVolumeSliderShow = !isVolumeSliderShow;
      if (!isVolumeSliderShow) {
        volumeSlider.style.width = "0px";
        volumeTrack.style.width = "0px";
      } else {
        volumeSlider.style.width = "110px";
        volumeTrack.style.width = "110px";
      }
    }

    audio.addEventListener("volumechange", () => {
      if (audio.volume === 0) {
        document
          .getElementById("volumeIcon")
          .setAttribute("class", "fa-solid fa-volume-xmark icon");
      } else {
        document
          .getElementById("volumeIcon")
          .setAttribute("class", "fa-solid fa-volume-up icon");
      }
    });

    document
      .getElementById("volumeIcon")
      .addEventListener("click", toggleVolumeSlider);

    volumeProgress.style.width = `${nowVolume * 100}%`;
    volumeDot.style.left = `${nowVolume * 100}%`;

    // 鼠标按下
    function volumeHandleMouseDown(e) {
      isMouseDown = true;
      updateVolumeProgress(e);
    }

    // 鼠标松开
    function volumeHandleMouseUp(e) {
      isMouseDown = false;
      updateVolumeProgress(e);
      if (audio.paused) {
        playState.innerHTML = "暂停";
      } else {
        playState.innerHTML = "播放中";
      }
    }

    // 鼠标移动
    function volumeHandleMouseMove(e) {
      if (isMouseDown) {
        updateVolumeProgress(e);
      }
    }

    function updateVolumeProgress(e) {
      const volumeSliderRect = volumeSlider.getBoundingClientRect();
      const clickX = e.clientX;
      const clickY = e.clientY;

      if (
        clickX >= volumeSliderRect.left &&
        clickX <= volumeSliderRect.right &&
        clickY >= volumeSliderRect.top &&
        clickY <= volumeSliderRect.bottom
      ) {
        const percentage =
          (clickX - volumeSliderRect.left) / volumeSliderRect.width;

        volumeProgress.style.width = `${Math.round(percentage * 100)}%`;
        volumeDot.style.left = `${Math.round(percentage * 100)}%`;
        playState.innerHTML = `${Math.round(percentage * 100)}%`;

        audio.volume = percentage;
        chorus.volume = percentage;
      }
    }

    volumeSlider.addEventListener("mousedown", volumeHandleMouseDown);
    volumeSlider.addEventListener("mouseup", volumeHandleMouseUp);
    volumeSlider.addEventListener("mousemove", volumeHandleMouseMove);
    document.addEventListener("mouseup", volumeHandleMouseUp);

    audio.addEventListener("loadedmetadata", function () {
      nowVolume = audio.volume;
    });

    audio.addEventListener("waiting", function () {
      playState.innerHTML = "等待中";
    });

    //歌词

    var lyricsData = [];
    var translatedLyricsData = [];

    function showLrc() {
      var LrcBox = document.getElementById("music_box_lyric");
      LrcBox.innerHTML = "";
      if (isShowTranslate) {
        for (let i = 0; i < translatedLyricsData.length; i++) {
          if (i % 2 === 1) {
            LrcBox.innerHTML += `
        <div class="ly ly_cn" id="ly_${i}">${translatedLyricsData[i].text}</div>
      `;
          } else {
            LrcBox.innerHTML += `
        <div class="ly" id="ly_${i}">${translatedLyricsData[i].text}</div>
      `;
          }
        }
      } else {
        for (let i = 0; i < lyricsData.length; i++) {
          LrcBox.innerHTML += `
        <div class="ly" id="ly_${i}">${lyricsData[i].text}</div>
      `;
        }
      }
    }

    function getLrc(id) {
      //检测是否有歌词
      if (data[id].language === "0") {
        lyricsData = [{ time: "0.00", text: "纯音乐,请欣赏" }];
        translatedLyricsData = [{ time: "0.00", text: "纯音乐,请欣赏" }];
        return;
      }
      const dataItem = data[id];
      const language = dataItem.language;
      const isTranslate = dataItem.isTranslate;

      if (isTranslate === "1") {
        //有翻译歌词
        fetchLyrics(id, language);
        fetchTranslatedLyrics(id);
      } else {
        //没翻译歌词
        fetchLyrics(id, language);
      }

      //获取歌词

      function fetchLyrics(id, language) {
        fetch(`lrc/${id}-${language}.lrc`)
          .then((response) => response.text())
          .then((lyricsText) => {
            const lyrics = parseLyrics(lyricsText);
            lyricsData = lyrics;
          });
      }

      //获取翻译歌词

      function fetchTranslatedLyrics(id) {
        fetch(`lrc/${id}-cn.lrc`)
          .then((response) => response.text())
          .then((translatedLyricsText) => {
            const translatedLyrics = parseLyrics(translatedLyricsText);
            translatedLyricsData = translatedLyrics;
          });
      }
    }

    const lyricsBox = document.getElementById("music_box_lyric");

    // 解析歌词文本并将歌词数据存入数组
    function parseLyrics(lyricsText) {
      const lines = lyricsText.split("\n");
      const lyricsData = [];
      const timeRegex = /\[(\d{2}):(\d{2})\.(\d+)\]/;
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const timeMatches = line.match(timeRegex);
        if (timeMatches) {
          const minutes = parseInt(timeMatches[1]);
          const seconds = parseInt(timeMatches[2]);
          const milliseconds = parseInt(timeMatches[3]);
          const millisecondsLength = timeMatches[3].length;
          const time =
            minutes * 60 +
            seconds +
            milliseconds / Math.pow(10, millisecondsLength); // 根据毫秒位数调整
          const text = line.replace(timeRegex, "").trim();
          // 即使 text 为空，也添加到 lyricsData 中
          lyricsData.push({ time, text });
        }
      }
      return lyricsData;
    }

    function changeCurrentLyrics() {
      const currentTime = audio.currentTime;
      const data = isShowTranslate ? translatedLyricsData : lyricsData;
      let currentIndex = -1;

      // 找到当前时间对应的歌词索引
      for (let i = 0; i < data.length; i++) {
        if (currentTime >= data[i].time) {
          currentIndex = i;
        } else {
          break;
        }
      }

      // 清除所有歌词的 ly_now 类
      const lyricsElements = document.querySelectorAll(".ly");
      lyricsElements.forEach((element) => element.classList.remove("ly_now"));

      // 添加当前歌词的 ly_now 类
      if (currentIndex !== -1) {
        const currentLyricElement = document.getElementById(
          `ly_${currentIndex}`
        );
        currentLyricElement.classList.add("ly_now");
        centerLyrics(currentIndex);
      }
    }

    let scrollTimeout;
    let canCenterLyrics = true;

    //允许用户滚动歌词

    lyricsBox.addEventListener("wheel", handleScroll);
    function handleScroll(event) {
      canCenterLyrics = false;
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        canCenterLyrics = true;
        centerLyrics();
      }, 2000);
    }

    //居中歌词

    function centerLyrics(id) {
      if (canCenterLyrics) {
        var height = 0;
        for (let i = 0; i < id; i++) {
          height += document.getElementById("ly_" + i).offsetHeight + 10; //10是歌词的margin-top，同下
        }

        targetScrollTop =
          height -
          (lyricsBox.offsetHeight / 2 -
            document.getElementById("ly_" + id).offsetHeight / 2 -
            10);

        lyricsBox.scrollTo({
          top: targetScrollTop,
          behavior: "smooth",
        });
      }
    }

    window.onload = function () {
      showDetailsLyrics();
    };

    async function fetchLyrics(id, language) {
      try {
        const response = await fetch(`lrc/${id}-${language}.lrc`);
        const lyricsText = await response.text();
        return parseLyrics(lyricsText);
      } catch (error) {
        console.error(`Failed to fetch lyrics for id ${id}:`, error);
        return [];
      }
    }

    async function fetchTranslatedLyrics(id) {
      if (data[id].isTranslate === "0") {
        const lyricsText = `[00:01.00]暂无翻译，请欣赏`;
        return parseLyrics(lyricsText);
      } else {
        try {
          const response = await fetch(`lrc/${id}-cn.lrc`);
          const lyricsText = await response.text();
          return parseLyrics(lyricsText);
        } catch (error) {
          console.error(
            `Failed to fetch translated lyrics for id ${id}:`,
            error
          );
          return [];
        }
      }
    }

    async function showDetailsLyrics() {
      for (let j = 0; j < data.length; j++) {
        const translated = document
          .getElementById("details_lyrics_" + data[j].id)
          .getElementsByClassName("details_lyrics_translated")[0];
        const original = document
          .getElementById("details_lyrics_" + data[j].id)
          .getElementsByClassName("details_lyrics_original")[0];

        if (data[j].language === "0") {
          const lyData = [{ time: "0.00", text: "纯音乐,请欣赏" }];
          displayLyrics(original, lyData);
        } else {
          const [lyData, translatedLyData] = await Promise.all([
            fetchLyrics(data[j].id, data[j].language),
            fetchTranslatedLyrics(data[j].id),
          ]);
          displayLyrics(original, lyData);
          displayTranslatedLyrics(translated, translatedLyData);
        }
      }
    }

    function displayLyrics(container, lyrics) {
      container.innerHTML = lyrics
        .map((lyric) => `<div class="dly">${lyric.text}</div>`)
        .join("");
    }

    function displayTranslatedLyrics(container, lyrics) {
      container.innerHTML = lyrics
        .map((lyric, index) => {
          return index % 2 === 1
            ? `<div class="dly dly_cn">${lyric.text}</div>`
            : `<div class="dly">${lyric.text}</div>`;
        })
        .join("");
    }

    // 监听音乐的时间更新事件
    audio.addEventListener("timeupdate", function () {
      changeCurrentLyrics();
      if (isShowTranslate) {
        changeCurrentLyrics();
      }
    });

    audio.addEventListener("loadstart", () => {
      lyricsBox.innerHTML = "歌曲加载中,请稍候...";
    });

    //更改翻译图标

    function toggleTranslateIcon() {
      if (!isShowTranslate) {
        isShowTranslate = !isShowTranslate;
        document.getElementById("translate").style.color = hexToRgba(
          data[nowPlayingMusicId].mainColor,
          true
        );
        showLrc();
        changeCurrentLyrics();
      } else {
        isShowTranslate = !isShowTranslate;
        document.getElementById("translate").style.color = hexToRgba(
          data[nowPlayingMusicId].mainColor,
          false,
          0.5
        );
        changeCurrentLyrics();
        showLrc();
      }
    }

    document
      .getElementById("translate")
      .addEventListener("click", toggleTranslateIcon);
  } else {
    console.error("无法找到目标元素，音乐播放器无法嵌入。");
  }
}

// 在页面加载完成后调用函数以嵌入音乐播放器
window.onload = function () {
  embedMusicPlayer();
};
