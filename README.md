# Grindset Addon

This addon redirects your browser away from NSFW websites and guides you to a LeetCode problem instead. Ideal for maintaining focus during work or study sessions, it substitutes potential distractions with coding challenges, turning your browsing time into a productive learning opportunity.

## Installation

* Clone the repository:

    ```bash
    git clone https://github.com/NichiHachi/grindset-addon.git
    ```

* Follow the browser-specific instructions to set up the addon:

### Google

1. Go to your extension manager.
2. Enable Developer mode.
3. Click on "Load unpacked".
4. Select the project's directory.

### Firefox

1. Enter `about:debugging` in the URL bar.
2. Click on "This Firefox".
3. Click on "Load Temporary Add-on".
4. Open the project's directory and select `manifest.json`.

## Features

- **Website Redirection**: The addon automatically redirects your browser from NSFW websites to a LeetCode problem.

- **Customizable Sensitivity**: You can customize the sensitivity of the word detection.

- **Customizable Redirection**: You can select which websites to be redirected to.

- **Blacklisted Words**: You can add blacklisted words in which the website should not contain.

- **Whitelisted URLs**: You can add whitelisted URLs ensuring that websites containing blacklisted and NSFW words will not trigger verification or redirection.