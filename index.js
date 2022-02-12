// Basic automation script to detect active vaccination schedules

require('dotenv').config()

const puppeteer = require('puppeteer');

const accountSid = process.env.TWILIO_ACCOUNT_SID || '';
const authToken = process.env.TWILIO_AUTH_TOKEN || '';
const client = require('twilio')(accountSid, authToken);

// Vaccines & vaccination center regions to monitor
const nameOfVaccine = "Moderna";
const vaccinationCenterRegion = "Moka";

const MonitorVaccines = (regionName, vaccineName) => {
  return new Promise(async (resolve, reject) => {
    try {

      const browser = await puppeteer.launch({
        headless: false,
        devtools: false,
        args: ['--no-sandbox', '--incognito']
      });

      const page = await browser.newPage();

      await page.goto("https://c-caremauritius.as.me/schedule.php", { waitUntil: 'networkidle2' });

      let vaccines = [];

      // Wait for vaccines to load
      await page.waitForSelector('span.appointment-type-name');

      // Get vaccines' data
      let availableVaccines = await page.evaluate(() => {
        let results = [];
        let ids = [];

        let items = document.querySelectorAll('span.appointment-type-name');
        let vaccineIdNodes = document.querySelectorAll('label.babel-ignore');

        vaccineIdNodes.forEach((htmlNode) => {
          ids.push(htmlNode.getAttribute("for")?.split('-')[1]?.trim());
        })

        items.forEach((item, count) => {
          let vaccineText = item?.innerText;
          const vaccineName = vaccineText?.split("-")[1]?.trim();
          const jabType = vaccineText?.split("-")[2]?.split('@')[0]?.trim();
          const location = vaccineText?.split("@")[1]?.trim();

          results.push({
            id: ids[count],
            appointment: item?.innerText,
            vaccineName: vaccineName,
            jabType: jabType,
            location: location
          });
        });
        return results;
      });

      vaccines = vaccines.concat(availableVaccines);

      let filteredResults;
      if (regionName && vaccineName) {
        filteredResults = vaccines.filter(vaccine => vaccine?.location?.toLowerCase()?.includes(regionName?.toLowerCase()) && vaccine?.vaccineName?.toLowerCase()?.includes(vaccineName?.toLowerCase()));
        console.log('filterered', filteredResults);

        for (let i = 0; i < filteredResults.length; i++) {
          let resultId = filteredResults[i].id;
          await page.waitForSelector(`#appointmentType-${resultId}`);

          await page.evaluate((resultId) => {
            document.querySelector(`#appointmentType-${resultId}`).click();
          }, resultId);

          let message;

          // Check availability for appointment scheduling
          // If message is present, then no schedules are avaialble
          try {
            message = await page.waitForSelector('#no-times-available-message', { timeout: 3000 })
          } catch (err) {
            message = false;
          }


          if (message) {
            console.log("NO VACCINES FOUND");
          } else {
            console.log("VACCINES AVAILABLE FOR SCHEDULING");
            client.messages
            .create({
              body: `Vaccine ${filteredResults[i]?.vaccineName} is currently available for scheduling at ${filteredResults[i]?.location} as a ${filteredResults[i]?.jabType} jab`,
              from: process.env.SENDER_NUMBER,
              to: process.env.RECEPIENT_NUMBER
            })
            .then(message => console.log(message.sid));
          }

          await page.evaluate((resultId) => {
            document.querySelector(`#appointmentType-${resultId}`).click();
          }, resultId);
        }
      }

      console.log("filteredResults", filteredResults);

      browser.close();

      // In case we don't care about regional vaccination centers
      // let nonRegional = vaccines.filter(vaccine => !vaccine?.location?.toLowerCase()?.includes(regionName?.toLowerCase()));
      // regional = vaccines.filter(vaccine => vaccine?.location?.toLowerCase()?.includes(regionName?.toLowerCase()));

      // console.log(`Non-Regional Vaccines`, nonRegional)
      // console.log(`Regional Vaccines Found (${regionName})`, regional)

      return resolve(vaccines);
    } catch (e) {
      return reject(e);
    }
  })
}

// Monitor for active schedules every ${x} intervals
setInterval(() => {
  MonitorVaccines(vaccinationCenterRegion, nameOfVaccine).catch(console.error);  
}, 300000)