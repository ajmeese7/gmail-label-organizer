# gmail-label-organizer
Allows users to reorganize the Gmail system labels, i.e. to put the 'Important' label above 'Inbox'.

**This extension is now on the Firefox store!** Go give it a try and a review [here](https://addons.mozilla.org/addon/gmail-label-organizer/).

### Developing
1. Navigate to `about:debugging` in Firefox
2. Check `Enable add-on` debugging
3. Click `Load Temporary Add-on`
4. Select any file within the directory of the cloned repository
5. Click the `Debug` button on the extension container
6. Click `Ok` on the popup to allow debugging

This will get you set up to easily test changes to the code. Simply click `Reload`
on the extension container to refresh the extension and see any changes.

### Plans
- Sometimes when you receive a new email everything gets screwed up. If anyone
  can figure this out, I would greatly appreciate it. Please report any unusual
  behavior on the issues page
- Carry over code to Chrome extension
- Make application adapt to user settings on which labels are shown (currently assumes all 6 labels are shown)
