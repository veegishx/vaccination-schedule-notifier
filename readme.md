# Vaccination Schedule Notifier

## 📝 Purpose

Welkin Mauritius is one of the vaccination centers available across Mauritius. They use Acuity Scheduling for their vaccination appointment booking system. 

Unfortunately they do not provide a way of automatically notifying people whenever appointments are available for booking. If you are a busy person and want to know when you can book an appointment, you are probably out of luck. They only way to know is to frequently visit their site.

This is a basic pupeteer script which monitors Welkin Mauritius vaccination scheduling website for specific vaccination appointments available in specific vaccination centers.


## ✨ Features
- Monitor for vaccines at given intervals
- Detect active vaccination schedules for a specific vaccine
- Detect active vaccination schedules available in a specific region
- Send an SMS via Twilio to notify of available vaccines

## 🚨 Requirement
- A Twilio account to send messages when active schedules are found

## 🔨 Instructions
- Rename `.env.local` to `.env` and fill in the relevant details
- Update `nameOfVaccine` and `vaccinationCenterRegion` in `index.js` to specify the vaccine and region you want to monitor


By default the script runs every 300000 miliseconds (5 minutes)

## Example of notification

![screenshot](https://raw.githubusercontent.com/veegishx/vaccination-schedule-notifier/main/screenshot.png)
