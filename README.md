# gmail-label-organizer
Allows users to reorganize the Gmail system labels, i.e. to put the 'Important' label above 'Inbox'.

**NOTE:** This has only been tested in Firefox Developer Edition on Manjaro and Windows 10 so far.
Eventually, adding cross-browser compatibility, or developing different versions for different
browsers, is intended. I may add a list of platforms I've tested on as I continue testing
and development.

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
- Test extension on other versions of Firefox
