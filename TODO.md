# TODO
These is a list of all the frontend todo tasks
- [ ] Add email verification info and option to UpdateProfilePage
- [ ] FE: arror when logging out and I'm in the edit user information window, need to reroute to main page(?)

---
Previous:
- [x] Add profile update page, letting users update display name
- [x] Retrieve articles from database, instead of the JSON, in ArticlePage
- [x] Create api call to retrieve all articles
- [x] Separate comments from articles by moving them to a different collection, support displaying and adding new ones
- [x] Add comment deletetion button in the comments list
  - [x] Create a delete button in FE
  - [x] Protect FE: Make sure the delete button is only visible to the owner of the comment
  - [x] Be able to actually delete a comment in the BE
  - [x] Protect BE: Make sure only owners can remove their comment using API
  - [x] Update FE when a comment has been deleted
  - [x] BUG: after adding a comment, the remove buttons disappear from all of the comments - neede to update the canDelete field after adding a comment in the BE
- [x] Let users remove their upvote from an article
- [x] Add posting date to comments, display it in the comments list
- [x] Support user icons in the comments list
  - [x] FE: Add icons to the comment box
  - [x] FE: Add icon URL to the comments in MongoDB
  - [x] FE & BE: Update icon URLs in all of the users' comments when updating profile information
- [x] Allow users edit their comments
  - [x] FE: add a new component to edit text
  - [x] BE: add API to edit coment text