function handleMessage(request, sender) {
  if (request && request.closeWebPage === true) {
    if (request.isSuccess === true) {
      /* Set username and token */
      chrome.storage.local.set({
        leethub_username: request.username,
        leethub_token: request.token,
      });

      /* Close pipe */
      chrome.storage.local.set({ pipe_leethub: false }, () => {
        console.log('Closed pipe.');
      });

      /* Go to onboarding for UX */
      const urlOnboarding = chrome.runtime.getURL('welcome.html');
      chrome.tabs.create({ url: urlOnboarding, active: true }); // creates new tab
    } else if (request.isSuccess === false) {
      console.error(
        'Something went wrong while trying to authenticate your profile!',
      );
      chrome.storage.local.set({ pipe_leethub: false });
    }

    /* Close the GitHub tab that sent the message */
    if (sender && sender.tab && sender.tab.id !== undefined) {
      chrome.tabs.remove(sender.tab.id);
    }
  }
}

chrome.runtime.onMessage.addListener(handleMessage);
