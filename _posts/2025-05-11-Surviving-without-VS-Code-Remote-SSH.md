---
layout: post
title: Surviving without VS Code Remote SSH
date: 2025-05-11 12:06:00+1000
description: 'Or: "They took away my extension, but not my will to code."'
tags: Aqua, VSCode, SSH
categories: HPC
giscus_comments: true
related_posts: true
toc:
  sidebar: right
---

> ##### VS Code Remote SSH is banned
>
> QUT Aqua banned VS Code Remote SSH extension due to potential high workload on the node. Even you try to connect to Aqua through Remote SSH, it will be disconnected automatically after around 30 seconds. Check [this](https://docs.eres.qut.edu.au/hpc-vscode-usage#using-vs-code-to-edit-files-on-the-hpc) for more details.
{: .block-danger }

So... you're trying to develop on QUT Aqua, but the server gods have other plans. Maybe you can't use VS Code Remote SSH. Maybe you're just feeling adventurous. But do not worry — you can still edit remote files and develop like a champ. Here's how I've kept my sanity while developing on remote HPC systems.


---

## Before you start

### Recommend to add a shortcut to `~/.ssh/config`

If you are using SSH keys to connect to the HPC, you can add a shortcut to `~/.ssh/config` to make your life easier. QUT Aqua documentation provides a [guide](https://docs.eres.qut.edu.au/hpc-getting-started-with-high-performance-computin#how-you-log-into-aqua-depends-on-the-operating-system-of-your-computer) on how to set up SSH keys for passwordless login.

```bash
# Add to your ~/.ssh/config
Host aqua
    HostName aqua.qut.edu.au
    User your-username
    IdentityFile ~/.ssh/id_rsa_aqua # Add your SSH key here
    ServerAliveInterval 60
```

Then, you can connect to the HPC by running `ssh aqua`. Also, you can use `aqua` to replace `your-username@aqua.qut.edu.au` in the following commands.


---

## 🧩 1. Fake it with SSH-mounted folders 

### 🧀 Option A: Mount via Finder — the cheese board approach

> Here's a quick guide for macOS users. Please refer to the [QUT Aqua documentation](https://docs.eres.qut.edu.au/hpc-transferring-files-tofrom-hpc#using-file-explorer-or-finder-to-mount-a-drive-to-the-hpc) for other OS.

1. Open **Finder** → `Go` → `Connect to Server...`
2. Enter:

    ```
    smb://hpc-fs/home/
    ```
3. Mount it, then open the folder in VS Code like it's 1999.

📝 *Note*: You can edit files, but **no shell**, **no Git**, and no terminal tantrums. It's like eating cake without the frosting.

#### But ... is this method elegant?

You've mounted an SMB share to your Finder. Congratulations! You've just volunteered for the following comedy of errors:

1. **Git? More like "Get Lost"** - Your carefully crafted version control system now has all the functionality of a chocolate teapot. Want to commit changes? Sorry, Git is too sophisticated for your peasant SMB connection. It's like bringing a quantum physicist to a kindergarten counting class.
2. **VS Code's Terminal: The Phantom Feature** - That beautiful integrated terminal in VS Code? It now stares at you like a confused puppy. `Command not found` becomes your new error mantra. It's there... but also not there, like your motivation on Monday mornings.
3. **The Mysterious Disconnection** - Nothing says "surprise vacation" like your SMB connection randomly dropping when you're in the middle of important work. It's like having a co-worker who pulls the fire alarm whenever they're bored.
4. **HPC Disruption: The Digital Hostage Situation** - Ah, you've put ALL your files on the server! So when the High-Performance Computing cluster decides to have its quarterly existential crisis (or weekly, who's counting?), your work becomes as accessible as your childhood memories. Your options? Make coffee, stare wistfully out the window.
5. **The .DS_Store Epidemic: Exclusive for macOS** - Ah, macOS and its infamous `.DS_Store` files! Your Mac scatters these digital breadcrumbs in every folder you visit like an overzealous tourist taking selfies at landmarks. The HPC server, meanwhile, treats them with the same enthusiasm as finding glitter in its keyboard – "Thanks for the desktop settings I absolutely didn't ask for and can't use!" 

<div class="text-center mt-3">
    {% include figure.liquid loading="eager" path="assets/img/posts/DS_Store-meme.png" class="img-fluid rounded z-depth-1 w-50" %}
</div>
<div class="caption" style="font-style: italic;">
    <b>For macOS users only:</b> Check out <a href="/blog/2025/The-DS_Store-Strikes-Back">The .DS_Store Strikes Back: Finder Edition</a> about how to solve it (or not).
</div>

<br>

### 🔧 Option B: SSHFS — Mount through SSH Wizardry

Mount your HPC home directory *directly* via SSH, no Finder fluff. It's like having your HPC filesystem in your pocket.

#### For macOS Users:

```bash
# Install the prerequisites (because your Mac doesn't come with everything, despite what Apple claims)
brew install macfuse
brew install gromgit/fuse/sshfs-mac

# Mount your HPC home (1)
mkdir ~/aqua
sshfs your-username@aqua.qut.edu.au:/home/your-username ~/aqua #(2)

# When you're done pretending these files are local
umount ~/aqua
# Or if that fails spectacularly (as technology loves to do)
diskutil unmount ~/aqua
```

Notes:
1. When you're running `sshfs` first time, you will be asked to go to "System Preferences" → "Security & Privacy" → "Security" → click "Allow" for running the app. Then you also need to restart your Mac.
2. You can use `aqua` to replace `your-username@aqua.qut.edu.au` if you have added a shortcut to `~/.ssh/config`.

#### For Linux Users (Ubuntu):

```bash
# Install SSHFS (because of course Linux makes you work for everything)
sudo apt install sshfs

# Mount your HPC home, telling the laws of physics to take a break
mkdir -p ~/aqua
sshfs your-username@aqua.qut.edu.au:/home/your-username ~/aqua -o follow_symlinks

# To send these files back to their natural habitat
fusermount -u ~/aqua
```

#### For Windows Users:

Install [WinFSP](https://github.com/winfsp/winfsp/releases) and [SSHFS-Win](https://github.com/winfsp/sshfs-win/releases), because Windows needs two separate things to do what other systems accomplish with one. Then use Windows Explorer (which Microsoft keeps renaming as if that will make us forget its bugs) to map a network drive:

```
\\sshfs\your-username@aqua.qut.edu.au
```
Then open it in VS Code like you've just performed a miracle:

```bash
code ~/aqua
```

✅ *Pro*: Looks local. Feels local. Git operations work... until they mysteriously don't

❌ *Con*: Feels **too** local for large files. Might lag. If the connection drops, your filesystem freezes like it's seen a ghost


> ##### Performance Tips That Might Help (No Promises)
>
> - Use `-o cache=yes` to create the illusion of performance (side effects may include file synchronization existential crises)
> - Add `-o compression=yes` to squeeze your data through the internet tubes more efficiently
> - If everything hangs, adjust your `ServerAlive` settings, which is like giving your connection a gentle nudge every few minutes to check if it's still breathing
{: .block-tip }


> ##### Working with Git Over SSHFS: A Tragicomedy
>
> When using Git over SSHFS, you're essentially asking Git to perform a synchronized swimming routine while blindfolded. For anything more complex than a simple commit, consider SSH-ing directly into the server and running Git commands there. Your future self will thank you for not testing the limits of your patience.
{: .block-tip }

---

## 🔄 2. `rsync`, `scp` and `git`: Your old-school sync buddies

### ⚙️ Option A: `rsync` & `scp` — The Reliable Workhorse

```bash
# Sync your local code to HPC
rsync -avz ./my-project/ your-username@aqua.qut.edu.au:/home/your-username/projects/

# Sync back from HPC
rsync -avz your-username@aqua.qut.edu.au:/home/your-username/projects/ ./my-project/
```

Or for a quick one-file fling:

```bash
scp script.py your-username@aqua.qut.edu.au:/home/your-username/projects/
```

It's not fancy, but it works — like duct tape.

<br>

### ⚡ Option B: Git — The Version Control Way

If you are version-controlling your life (as you should), Git is a clean and reliable method.

```bash
# On your local machine
git init
git add .
git commit -m "Initial commit"
git remote add aqua your-username@aqua.qut.edu.au:/path/to/repo
git push aqua main

# On the HPC
git clone your-username@aqua.qut.edu.au:/path/to/repo
```

✅ *Pro*: Clean history, branch control, reproducibility

❌ *Con*: Needs initial setup and your SSH keys must behave

---


## 🖥️ 3. The Terminal-Only Approach

When all else fails, embrace the terminal:

```bash
ssh your-username@aqua.qut.edu.au
```

Then pick your weapon of choice:

* `vim` — For the brave
* `nano` — For the sane
* `neovim` — For the modern
* `emacs` — For the... unique

🎯 *Bonus*: Fast, keyboard-driven, and doesn't require GUI permission forms.

> *Note*: I will write another page about how to use `neovim` and its plugins to replace VS Code as a lightweight editor (with SSH).

---

## 🌐 4. The Web-Based Approach

### 📓 Option A: Jupyter Notebooks

> ##### Install Jupyter Lab in HPC before you start
>
> QUT Aqua documentation provides a [guide](https://docs.eres.qut.edu.au/hpc-accessing-available-software#install-conda) on how to install Miniconda in HPC.
{: .block-tip }

```bash
# On the HPC
# I prefer to use Jupyter Lab instead of Jupyter Notebook
jupyter lab --no-browser --port=8888 # (1)

# On your local machine, forward the port 8888 to your local machine
# local_port:localhost:remote_port (2)
ssh -N -L 8888:localhost:8888 your-username@aqua.qut.edu.au
```
Notes:
1. If port 8888 is already in use, you can try another port, e.g. 8889.
2. `-N` means no command to run on the remote machine. `-L` means forward the local port to the remote port. Both local and remote ports are 8888 in this case.

<br>

### 🔥 Option B: VSCode in Browser

> ##### This might require a sysadmin's blessing!
>
> Fortunately, the server gods haven't locked *everything* down:
{: .block-warning }

1. Install [`code-server`](https://github.com/coder/code-server) on the HPC.

    ```bash
    # On HPC server
    # Install code-server to your home directory
    curl -fsSL https://code-server.dev/install.sh | sh -s -- --method standalone --prefix=$HOME
    # code-server will be installed to $HOME/bin/code-server

    # check if code-server is installed
    code-server --version

    # Start code-server
    code-server  --bind-addr 127.0.0.1:8080 --disable-telemetry --disable-update-check --auth none

    # On your local machine
    # Forward the port 8080 to your local machine
    ssh -N -L 8080:127.0.0.1:8080 your-username@aqua.qut.edu.au
    ```

2. Open it in your browser

    ```bash
    # Open the web page in your browser
    http://localhost:8080
    ``` 

3. Marvel as VS Code rises from the ashes — web-style

> ##### Sync VS Code settings to code-server
>
> You can import your VS Code settings to code-server by importing the profile from VS Code. Check out [this page](https://code.visualstudio.com/docs/configure/profiles#_share-profiles) for more details about how to export and import profiles. However, this's not the perfect solution. Not all VS Code extensions are available for code-server, some extensions are restricted for Microsoft VS Code. Only the extensions that are available for code-server are listed in [Open VSX Registry](https://open-vsx.org/).
{: .block-tip }

#### Run code-server in the background with `tmux`

You can run code-server in the background with `tmux` to avoid the session being killed after you disconnect from the HPC.

```bash
# Start a new tmux session
tmux new -s code

# Run code-server in the background
code-server --bind-addr 127.0.0.1:8080 --disable-telemetry --disable-update-check --auth none

# Detach from the tmux session: `Ctrl+b`, then `d`

# Reattach to the tmux session
tmux attach -t code

# Kill the tmux session
tmux kill-session -t code

# If you forget the session name, you can list all sessions
tmux ls
```

#### Known issue on Integrated Terminal and Extension Host

I found that the terminal and the extension host are not stable when using code-server. The issue seems to revolve around the **ptyHost**, **File Watcher**, and **Extension Host**, and it's being **repeatedly killed by SIGTERM**.

🧠 **What Is Happening?**

```log
[12:18:01] ptyHost terminated unexpectedly with code null
[12:18:01] [File Watcher (universal)] restarting watcher after unexpected error: terminated by itself with code null, signal: SIGTERM (ETERM)
[12:18:01] [127.0.0.1][d0f383fd][ExtensionHostConnection] <3126357> Extension Host Process exited with code: null, signal: SIGTERM.
[12:18:02] [127.0.0.1][d0f383fd][ExtensionHostConnection] Unknown reconnection token (seen before).
[12:18:02] [127.0.0.1][368c67ad][ExtensionHostConnection] New connection established.
[12:18:02] [127.0.0.1][368c67ad][ExtensionHostConnection] <3132486> Launched Extension Host Process.
```

📜 **From the logs:**

- 💥 The `ptyHost` process (responsible for terminal sessions) crashed or was killed — possibly due to system resource limits or policy.
- 📦 File watcher was forcefully killed (SIGTERM) — system or job policy likely did this.
- 🧩 Extension host was also killed — same reason, likely tied to HPC rules.
- ↩️ code-server tried to reconnect to the crashed extension host but failed.
- 🆕 code-server restarted the extension host process automatically.

---

## TL;DR — What Works (and What Requires Sacrifice)

| 🛠️ Method | 🧑‍💻 Edit in VS Code | 🖥️ Terminal Access | 📂 Where Files Live            | 🖼️ GUI Needed | ⚡ Vibe Check                       |
| ---------------------------- | ------------------------------------- | ----------------------------------- | ------------------------------------------ | ---------------------------- | -------------------------------------- |
| **SMB (Finder)**             | ✅ Yes, like it's local                | ❌ Nope, just files                  | 🌐 Remote (mounted)           | ✅ Yes                        | 🧀 "Cheesy but it works"         |
| **SSHFS**                    | ✅ Yes (mostly)                        | ❌ Not really                        | 🌐 Remote (mounted)           | ❌ Nope                       | 🐢 "Kinda slow, kinda cool"      |
| **rsync / Git**              | ✅ Edit local, sync later              | ✅ Full control                      | 📂 Local (then synced)                | ❌ Nope                       | 🔨 "Old school, solid"          |
| **Terminal Editors**         | ❌ No GUI, no problem                  | ✅ Born in the terminal              | 🌐 Remote (SSH only)          | ❌ Nope                       | 💀 "For shell warriors" |
| **Jupyter**                  | ✅ Yes, via browser                    | ✅ If allowed                        | 🌐 Remote (Jupyter workspace) | ✅ Yes                        | 🧪 "Science with style"      |
| **code-server**              | ✅ Yes, but web-based                  | ❓ Unstable                    | 🌐 Remote (in browser)        | ✅ Yes                        | 🧙 "Feels like cheating"          |

---

## Final Words

Remote development on HPC doesn't have to be a pain. Pick your poison, set up your workflow, and remember: the best development environment is the one that doesn't make you want to throw your computer out the window.

Happy coding, and may your HPC connections be stable! 🚀
