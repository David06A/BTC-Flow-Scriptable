const widget = new ListWidget();
const indexData = await fetchFngValue();
await createWidget();
// used for debugging if script runs inside the app
if (!config.runsInWidget) {
  await widget.presentSmall();
}

widget.setPadding(10, 10, 10, 10);
widget.url = "https://twitter.com/David06A_";
Script.setWidget(widget);
Script.complete();
const DATA_COLOUR = new Color("#d17339");
//Green is negative net as suggests more BTC is moving out of exchanges
const NEGATIVE_NET_COLOUR = new Color("#d17339");
const POSTIIVE_NET_COLOUR = new Color("#d17339");
const TRANSFERS_INTO_EXCHANGES_URL ="https://api.glassnode.com/v1/metrics/transactions/transfers_volume_to_exchanges_sum?a=BTC&c=native&category=Exchanges&ema=0";
const TRANSFERS_FROM_EXCHANGES_URL =
  "https://api.glassnode.com/v1/metrics/transactions/transfers_volume_from_exchanges_sum?a=BTC&c=native&category=Exchanges&ema=0&s=1639398693&u=1639485093";
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
  line1 = iconText.addText("Exchange Flow Direction");
  line1.font = Font.mediumRoundedSystemFont(13);
  let line1nxt = iconRow.addText("In/Out/Net");
  line1nxt.font = Font.mediumRoundedSystemFont(13);
  line2 = widget.addText("by David06A_");
  line2.font = Font.lightRoundedSystemFont(11);
  line2.leftAlignText();
  
  widget.addSpacer(10);

  let row = widget.addStack();
  row.layoutHorizontally();
  let fngText = row.addText("In: ");
  fngText.font = Font.mediumRoundedSystemFont(14);
  let fngValue = row.addText(indexData.value.toString());
  fngValue.textColor = new Color("#d17339");
  fngValue.font = Font.regularMonospacedSystemFont(14);
  
  let fngText = row.addText("Out: ");
  fngText.font = Font.mediumRoundedSystemFont(14);
  let fngValue = row.addText(indexData.value.toString());
  fngValue.textColor = new Color("#d17339");
  fngValue.font = Font.regularMonospacedSystemFont(14);

  let fngText = row.addText("Net: ");
  fngText.font = Font.mediumRoundedSystemFont(14);
  let fngValue = row.addText(indexData.value.toString());
  fngValue.textColor = new Color("#d17339");
  fngValue.font = Font.regularMonospacedSystemFont(14);

  widget.addSpacer(10);

  let row2 = widget.addStack();
  row2.layoutHorizontally();
  let timeStr = row2.addText("Update in: ");
  timeStr.font = Font.lightRoundedSystemFont(11);
  let relativeDate = toDateTime();
  let time = row2.addDate(relativeDate);
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
  
  var url = TRANSFERS_INTO_EXCHANGES_URL + "&s=" + since.getTime() / 1000 + "&u=" +new Date().getTime() / 1000;
  const req = new Request(url);
  const apiResult = await req.loadJSON();
  let indexValue = apiResult.data[0];

  return indexValue;
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
