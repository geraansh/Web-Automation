//The purpose of this project is to create n number of contests on HackerRank to be used later during "Moderator Add Activity".
//Also i'll be able to put my skills and uderstanding of Javascript and NodeJs to test.

//npm install -y
//npm install minimist
//npm install puppeteer

//node code.js --url=https://www.hackerrank.com --config=config.json --contestcount=3

//!!!!-----NOTE-----Hackerrank does not let you make more than 3 contests in a single day. That's why i have kept the loop to a maximum of 5 contests----!!!!!
//
let minimist = require("minimist");
let puppeteer = require("puppeteer");
let fs = require("fs");

let args = minimist(process.argv);

let configJSON = fs.readFileSync(args.config,"utf-8"); //reading config.json file
let config = JSON.parse(configJSON); //parsing config.json to JSO to make them accessible
    
async function run(){

    let browser = await puppeteer.launch({
        
        headless: false,
        args:['--start-maximized'],
        defaultViewport: null
    });

    let pages = await browser.pages();
    let page =  pages[0];

    await page.goto(args.url);

    await page.waitForSelector("a[data-event-action='Login']");
    await page.click("a[data-event-action='Login']");

    await page.waitForSelector("a[href='https://www.hackerrank.com/login']");
    await page.click("a[href='https://www.hackerrank.com/login']");

    await page.waitForSelector("input#input-1");
    await page.type("input#input-1",config.userid,{delay:50});

    await page.waitForSelector("input#input-2");
    await page.type("input#input-2",config.password,{delay:50});

    await page.waitForSelector("button[data-analytics='LoginPassword']");
    await page.click("button[data-analytics='LoginPassword']");

    for(let k=0;k<args.contestcount;k++)
    {
        await page.waitForSelector("a[data-analytics='NavBarContests']");
        await page.click("a[data-analytics='NavBarContests']");

        await page.waitForSelector("a[href='/administration/contests/create']");
        await page.click("a[href='/administration/contests/create']");

        await page.waitForSelector("input#name");
        await page.type("input#name",config.contestname+k+String.fromCharCode(70+k),{delay:50});
   
        let date = new Date().toLocaleDateString();
        await page.waitForSelector("input#startdate");
        await page.type("input#startdate",date,{delay:50});

        let currtime = new Date().toLocaleTimeString('en-US', { hour12: false, hour: "numeric", minute: "numeric"});
        await page.waitForSelector("input#starttime");
        await page.type("input#starttime",currtime,{delay:50});

        for(let i=0;i<3;i++)
        {
            await page.keyboard.press("Tab");
        }
        await page.waitForSelector("input#noendtime");
        await page.click("input#noendtime");
        await page.keyboard.press("Enter");

        //Select value from dropdown
        await page.keyboard.press("Tab");
        await page.keyboard.press("Enter");
        for(let j=0;j<4;j++)
        {
            await page.keyboard.press('ArrowDown');
        }
        await page.keyboard.press('Enter');

        await page.waitForSelector("input#organization_name");
        await page.type("input#organization_name",config.organizationname,{delay:50});

        await page.waitForSelector("button[data-analytics='CreateContestButton']");
        await page.click("button[data-analytics='CreateContestButton']");

        await page.waitFor(3000);

    }
    await page.close();    
}

run();
