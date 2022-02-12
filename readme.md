# Vaccination Schedule Notifier

## 📝 Purpose

Welkin Mauritius is one of the vaccination centers available across Mauritius. They use Acuity Scheduling for their vaccination appointment booking system. 

Unfortunately they do not provide a way of automatically notifying people whenever appointments are available for booking. If you are a busy person and want to know when you can book an appointment, you are probably out of luck. They only way to know is to frequently visit their site.

This is a basic pupeteer script which monitors Welkin Mauritius vaccination scheduling website for specific vaccination appointments available in a specific vaccination center.


## ✨ Features
- Monitor for vaccines at given intervals
- Detect active vaccination schedules for a specific vaccine
- Detect active vaccination schedules available in a specific region
- Send an SMS via Twilio to notify of available vaccines

## 🚨 Requirement
- A Twilio account to send messages when active schedules are found