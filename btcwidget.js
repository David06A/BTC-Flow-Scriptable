const DATA_COLOUR = new Color("#d17339");
//Green is negative net as suggests more BTC is moving out of exchanges
const IN_COLOUR = new Color("#b30c0c");
const FROM_COLOUR = new Color("#27ad02");
const NET_COLOUR = new Color("#d17339");
const API_KEY = ''
const TRANSFERS_INTO_EXCHANGES_URL ="https://api.glassnode.com/v1/metrics/transactions/transfers_volume_to_exchanges_sum?a=BTC&api_key="+API_KEY+"&c=native&category=Exchanges&ema=0";
const TRANSFERS_FROM_EXCHANGES_URL =
  "https://api.glassnode.com/v1/metrics/transactions/transfers_volume_from_exchanges_sum?a=BTC&api_key="+API_KEY+"&c=native&category=Exchanges&ema=0";

const widget = new ListWidget();
const inData = await fetchTransfersIn();
const fromData = await fetchTransfersOut();

await createWidget();
// used for debugging if script runs inside the app
if (!config.runsInWidget) {
  await widget.presentSmall();
}

widget.setPadding(5, 5, 5, 5);
widget.url = "https://twitter.com/David06A_";
Script.setWidget(widget);
Script.complete();
// build the content of the widget

async function createWidget() {
  let line1, line2, line3;
  let icon = widget.addStack();

  const coin = await getImage("bitcoin");
  const coinImg = icon.addImage(coin);
  coinImg.imageSize = new Size(30, 30);
  icon.layoutHorizontally();

  icon.addSpacer(8);

  let iconRow = icon.addStack();
  iconRow.layoutVertically();
  let iconText = iconRow.addStack();
  line1 = iconText.addText("Exchange");
  line1.font = Font.mediumRoundedSystemFont(14);
  let line1nxt = iconRow.addText("Flow");
  line1nxt.font = Font.mediumRoundedSystemFont(14);
  line2 = widget.addText("by David06A_");
  line2.font = Font.lightRoundedSystemFont(11);
  line2.leftAlignText();
  
  widget.addSpacer(10);


  let row = widget.addStack();
  row.layoutHorizontally();
  let inText = row.addText("In: ");
  inText.font = Font.mediumRoundedSystemFont(16);
  let inValue = row.addText(Math.round(inData * 100) / 100 + '');
  inValue.textColor = IN_COLOUR
  inValue.font = Font.regularMonospacedSystemFont(16);
  
  let row3 = widget.addStack();
  let outText = row3.addText("Out: ");
  outText.font = Font.mediumRoundedSystemFont(16);
  let outValue = row3.addText(Math.round(fromData * 100) / 100 + '');
  outValue.textColor = FROM_COLOUR
  outValue.font = Font.regularMonospacedSystemFont(16);

  let row4 = widget.addStack();
  let netText = row4.addText("Net: ");
  netText.font = Font.mediumRoundedSystemFont(16);
  let netValue = row4.addText(Math.round((inData - fromData) * 100) / 100 + '');
  netValue.textColor = NET_COLOUR
  netValue.font = Font.regularMonospacedSystemFont(16);

  widget.addSpacer(10);

  let row2 = widget.addStack();
  row2.layoutHorizontally();
  let timeStr = row2.addText("Update in: ");
  timeStr.font = Font.lightRoundedSystemFont(11);
  var d = new Date();
  var h = d.getHours();
  var m = d.getMinutes();
  var s = d.getSeconds();
  var secondsUntilEndOfDate = (24*60*60) - (h*60*60) - (m*60) - s;  
  let time = row2.addDate(toDateTime(secondsUntilEndOfDate));
  time.font = Font.lightMonospacedSystemFont(11);
  time.applyTimerStyle();
}

// Create the datetime object when update will happen

function toDateTime(secs) {
  const t = new Date();
  t.setSeconds(+t.getSeconds() + +secs);
  return t;
}

// fetches the fng value

async function fetchTransfersIn() {
  var since = new Date();
  since.setHours(23, 59, 0, 0);
  since.setDate(since.getDate() - 1);
  
  var url = TRANSFERS_INTO_EXCHANGES_URL + "&s=" + Math.floor(since.getTime() / 1000) + "&u=" + Math.floor(new Date().getTime() / 1000);
  const req = await new Request(url);
  const apiResult = await req.loadJSON();
  const data = apiResult[0].v

  return data;
}

async function fetchTransfersOut() {
  var since = new Date();
  since.setHours(23, 59, 0, 0);
  since.setDate(since.getDate() - 1);
  
  var url = TRANSFERS_FROM_EXCHANGES_URL + "&s=" + Math.floor(since.getTime() / 1000) + "&u=" + Math.floor(new Date().getTime() / 1000);
  const req = await new Request(url);
  const apiResult = await req.loadJSON();
  const data = apiResult[0].v

  return data;
}

// get images from local filestore or download them once

async function getImage(image) {
  let fm = FileManager.local();
  let dir = fm.documentsDirectory();
  let path = fm.joinPath(dir, image);

  if (fm.fileExists(path)) {
    return fm.readImage(path);
  } else {
    // download once
    let imageUrl;
    switch (image) {
      case "bitcoin":
        imageUrl = "/images/coin_icons/bitcoin.jpg";
        break;
      default:
        console.log(`Sorry, couldn't find ${image}.`);
    }

    let iconImage = await loadImage("https://alternative.me" + imageUrl);
    fm.writeImage(path, iconImage);

    return iconImage;
  }
}

// helper function to download an image from a given url
async function loadImage(imgUrl) {
  const req = new Request(imgUrl);
  return await req.loadImage();
}

// end of script
