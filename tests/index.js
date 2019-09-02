const config = require('../config');

module.exports = {
  before(browser) {
    browser
      .url('https://lenken.andela.com')
      .waitForElementVisible('body')
      .click('.sign-in-button')
      .waitForElementVisible('#view_container')
      .setValue('input[type=email]', config.email)
      .click('#identifierNext')
      .waitForElementVisible('.okta-container')
      .setValue('input[type=text]', config.oktaUserName)
      .setValue('input[type=password]', config.oktaPassword)
      .click('input[type=submit]')
      .pause(10000)
      .waitForElementVisible('#view_container')
      .click('.qhFLie')
      .pause(10000)
      .waitForElementVisible('.pool-body')
      .assert.containsText('#request-button', 'REQUEST FOR')
      .assert.containsText('#side-grid > form > div:nth-child(1) > h4', 'Requests')
  },

  'Discard a mentor request'(browser) {
    browser
      .click('#request-button')
      .click('#mentor')
      .waitForElementVisible('.mentor-request-modal')
      .assert.containsText('.modal-heading', 'REQUEST MENTOR')
      .assert.containsText('body > app-root > app-create-or-update-request > div > div > div > form > div:nth-child(1) > label', 'Select the skill you want to acquire')
      .assert.containsText('body > app-root > app-create-or-update-request > div > div > div > form > div:nth-child(2) > label', 'Description')
      .assert.containsText('body > app-root > app-create-or-update-request > div > div > div > form > div:nth-child(3) > label', 'Complementary Skills')
      .assert.visible('.btn-modal-close')
      .assert.visible('#btn-request');
      
    browser.expect.element('#btn-request').to.not.be.enabled
    browser.click('.btn-modal-close')
      .assert.elementNotPresent('.mentor-request-modal')
  },
  'Request Mentor Button should be disabled if "acquire skill" is selected and description is empty'(browser) {
    browser
      .click('#request-button')
      .click('#mentor')
      .waitForElementVisible('.mentor-request-modal')
      .assert.containsText('.modal-heading', 'REQUEST MENTOR')
      .assert.visible('.btn-modal-close')
      .assert.visible('#btn-request')
      .click('#undefined > ul > li > button')
      .useXpath().click("//a[contains(text(), 'Android')]")
      .useCss()
      .assert.containsText('body > app-root > app-create-or-update-request > div > div > div > form > div.skill-list > span', 'Android');
    browser.expect.element('#undefined > ul > li > button').to.not.be.enabled
    browser.expect.element('#btn-request').to.not.be.enabled
    browser.click('.btn-modal-close')
      .assert.elementNotPresent('.mentor-request-modal')
  },
  'Should show a warning message if all required fields are not supplied'(browser) {
    browser
      .click('#request-button')
      .click('#mentor')
      .waitForElementVisible('.mentor-request-modal')
      .assert.containsText('.modal-heading', 'REQUEST MENTOR')
      .assert.visible('.btn-modal-close')
      .assert.visible('#btn-request')
      .click('#undefined > ul > li > button')
      .useXpath().click("//a[contains(text(), 'Android')]")
      .useCss()
      .setValue('.description', 'Tesing Description')
    
    browser.assert.containsText('body > app-root > app-create-or-update-request > div > div > div > form > div.skill-list > span', 'Android')
    browser.expect.element('#undefined > ul > li > button').to.not.be.enabled
    browser.expect.element('#btn-request').to.be.enabled // this should be disabled
    browser.click('#btn-request')
      .assert.containsText('body > app-root > app-alert > div > app-message-alert > div.alert > div.body > span', 'Please fill in the compulsory fields to complete your request')
      .click('.close-button')
      .click('.btn-modal-close')
      .assert.elementNotPresent('.mentor-request-modal')
  },
  'Request should be successfull if all required fields are supplied'(browser) {
    browser
      .click('#request-button')
      .click('#mentor')
      .waitForElementVisible('.mentor-request-modal')
      .click('#undefined > ul > li > button')
      .useXpath().click("//a[contains(text(), 'Android')]")
      .useCss()
      .setValue('.description', 'Tesing Description')
      .click('#all-days-checkbox')
      .click('#btn-request')
      .pause(1000)
      .assert.containsText('body > app-root > app-alert > div > app-confirmation-alert > div > div.alert > div.body > span', 'Your request was successfully created.')
      .click('.blue-button') // view created content
      .assert.containsText('body > app-root > app-request-details > div.request-modal > div.modal-heading', 'Request for Android Mentor')
      .assert.containsText('body > app-root > app-request-details > div.request-modal > div.request-body > p.request-description', 'Tesing Description')
      .click('.delete') // delete request
      .waitForElementVisible('body > app-root > app-request-details > div.request-modal > app-cancel-request-modal > div > div > div')
      .click('body > app-root > app-request-details > div.request-modal > app-cancel-request-modal > div > div > div > div > div.dropdown > div > div.cancel-reason-box')
      .click('body > app-root > app-request-details > div.request-modal > app-cancel-request-modal > div > div > div > div > div.dropdown > div > div.dropdown-content > a:nth-child(1)')
      .click('.cancel-button')
      .click('.cancel-button')
      .assert.elementNotPresent('.mentor-request-modal')
      .end()
  }
};
