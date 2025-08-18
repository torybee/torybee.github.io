# battledome-scoreboard
Fork this repo to create a battledome scoreboard for your guild.

## getting started 
1. Fork this repo and name it `<GITHUB_USERNAME>.github.io` - MUST be named this way in order for GitHub pages to work.
2. Configure your repo to be a GitHub pages site. [Full instructions here.](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
   - Go to the settings tab of your repo.
   - Scroll down to the "GitHub Pages" section.
   - Choose `Deploy from a branch` as the source.
   - Select `main` branch and `/ (root)` folder.
3. After ~10 minutes, your scoreboard should be available to see at `<GITHUB_USERNAME>.github.io/battledome.html` with one default player: superkathiee. (You should eventually delete this entry from your JSON data file.)
4. Customize the HTML page by... (_each update is optional_)
   - Setting `GITHUB_USERNAME` with your GitHub username
   - Setting `GUILD_NAME` with your guild name
   - Updating `#spuds tr:nth-child(even)` and `(odd)` background colors with custom colors
   - Replacing `background.png`, `banner.png`, and `icon.png` in the `images` folder of the repo with your own images
   - Updating background/font colors in `.yellow-box` and `#guild-totals`
   - Update the wording in the `yellow-box` class

### preparing the bd_fetcher script
1. You will need a GitHub personal access token (PAT) in order for the script to run. To create one:
   - Go to your GitHub settings
   - Click on "Developer settings" on the bottom of left sidebar
   - Select "Personal access tokens" > "Fine-grained tokens" > "Generate new token"
   - Give the token a name, description, and expiration
   - It is recommended to give the token access to "Only select repositories" > select your `<GITHUB_USERNAME>.github.io` repo, and add `Contents` permissions. That's the minimum that the script needs.
   - Confirm and generate. You will get a chance to copy this token **one time**. GitHub won't let you copy it again. **Keep it somewhere safe and never commit this token to your GitHub source code.**
2. Fill in the `// FIRST TIME USERS MUST FILL IN THESE DETAILS!!!!` block in the `bd_fetcher.js` script. You can (and should) commit these details to source code.
   - `GITHUB_USERNAME` and `MY_NAME`: self-explanatory
   - `AUTO_REFRESH_ON_FAILURE`: If set to **true**, when one of the pages fails, it will auto refresh the page until it succeeds. (On every test I've done, every page has eventually succeeded after a few seconds.) However, if you are nervous about your browser freezing OR about too many refreshes flagging your account, don't set this to true. If set to **false** (default) when it fails, you will see a "failed" box on the page, and you can either refresh the page or click "try again" to refresh it.
   - `PLAYERS`: comma-separated list of usernames to be included in the scoreboard. If someone new joins your guild, you will need to update this list both in the source code and on every instance you have of the script.
    ```
        const GITHUB_USERNAME = "";
        const MY_NAME = "Kat";
        const AUTO_REFRESH_ON_FAILURE = false;
        const PLAYERS = [
            "superkathiee"
        ];
    ```
3. Copy/paste the `bd_fetcher.js` script into a new TamperMonkey script. Then fill in the `SECRET_GITHUB_TOKEN` variable with the PAT you created in step 1. Again, do not commit to source code.

### running the script
1. To capture data for the first time, you will need to visit the battledome stats page of every user in the `PLAYERS` list. The URL for this page is `https://www.neopets.com/dome/record.phtml?username=USERNAME`
2. Upon visiting a stats page, the script will automatically capture data and push a new commit it to GitHub. These updates are committed to the `bd_scores.json` file in your repo. You can view the file in the source code to confirm it's coming through.
3. After you have visited all the players' stats pages, it takes ~3-5 minutes for the action that updates your pages site to complete running. (Each new commit to your repo usually cancels the previous run and makes a new one start, so sometimes it takes a bit longer for the data to reflect. To review the actions, navigate to `https://github.com/GITHUB_USERNAME/GITHUB_USERNAME.github.io/actions`)
4. For subsequent runs, the `battledome.html` page table will be a clickable link to each user's respective battledome stats page, so you can simply click each link (open in a new tab).
5. Don't forget to delete the entry for "superkathiee" from `bd_scores.json` :)

### adding other script runners
If you want to add other people to run the script (for instance, to cover multiple timezones) they will need to:
1. Create a new PAT for each person from your guild you want to share the script with.
2. Direct them to copy/paste the `bd_fetcher.js` script from your repo into a new TamperMonkey script.
3. Instruct them to fill in the `MY_NAME`, `AUTO_REFRESH_ON_FAILURE`, and `SECRET_GITHUB_TOKEN` variables. (The `PLAYERS` and `GITHUB_USERNAME` variables should stay the same.)
4. They will be able to click on usernames from the scorebaord page and update scores too! 