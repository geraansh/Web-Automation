//The purpose of this project is to Automate Whatsapp which will make sending messages to a number of people at a time easier.
//Also i'll be able to put my skills and uderstanding of Javascript and NodeJs to test.

//npm install -y
//npm install minimist
//npm install puppeteer

//node code.js --url=https://web.whatsapp.com --message=message.json 

//!!!!------NOTE-------The receiver's name shoukd be in characters only. Names saved with Emojis won't work.----!!!!! 
//!!!!------NOTE-------Also everytime you have to scan QR code with phone if you are not a beta tester.----!!!!!!
//Before running add name(s) and message(s) in message.json file. You can add array of messages too!
let minimist = require("minimist");
let puppeteer = require("puppeteer");
let fs = require("fs");

let args=minimist(process.argv);

messageJson = fs.readFileSync(args.message,'utf-8');
messageJso  = JSON.parse(messageJson);

// Login Function Logic
(async function main() {
  try {
    // Configures puppeteer
    let browser = await puppeteer.launch({ 
        headless: false ,
        args:['--start-maximized'],
        defaultViewport: null
    });

    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36"
    );

    //Navigates to Whatsapp
    await page.goto(args.url);
    await page.waitFor(5000);

    for(let i=0;i<messageJso.receivers.length;i++)
    {
        //Searches person by title
        await page.waitForSelector("div[role=textbox]");
        await page.type("div[role=textbox]",messageJso.receivers[i],{delay:50});
        await page.click(`span[title=${messageJso.receivers[i]}]`);


        //messages you want to send
        await page.waitForSelector("div.p3_M1");
        await page.waitFor(1000);
        await page.type("div.p3_M1",messageJso.message,{delay:50});

        //press send button
        await page.waitForSelector("button._4sWnG");
        await page.click("button._4sWnG");

    }

  } catch (err) {
    console.error(err);
  }
})(); //Immediately-Invoked Function Expression

